import { useEffect, useMemo, useRef, useState } from "react";
import { FaMinus, FaPlus, FaRedo, FaSpinner, FaTimes } from "react-icons/fa";

const CROP_VIEW_SIZE = 280;
const OUTPUT_SIZE = 720;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Interactive 1:1 crop modal with circular preview guide so the user can
 * frame their profile photo exactly as it appears in the Hero section.
 */
function ImageCropModal({ file, onCancel, onConfirm, uploading = false }) {
    const [imageUrl, setImageUrl] = useState("");
    const [loadError, setLoadError] = useState(false);
    const [imgSize, setImgSize] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);

    const dragStart = useRef(null);
    const imgRef = useRef(null);

    // Read the file as a data URL in an async callback so StrictMode remounts
    // never hit a revoked blob URL and state updates stay out of the effect body.
    useEffect(() => {
        if (!file) return undefined;

        let cancelled = false;
        const reader = new FileReader();

        reader.onload = () => {
            if (!cancelled) {
                setImageUrl(typeof reader.result === "string" ? reader.result : "");
                setLoadError(false);
                setImgSize(null);
            }
        };

        reader.onerror = () => {
            if (!cancelled) {
                setLoadError(true);
            }
        };

        reader.readAsDataURL(file);

        return () => {
            cancelled = true;
        };
    }, [file]);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Escape" && !uploading) {
                onCancel();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onCancel, uploading]);

    // Base scale ensures the shorter side of the image covers the crop box.
    const baseScale = useMemo(() => {
        if (!imgSize) return 1;
        return Math.max(CROP_VIEW_SIZE / imgSize.width, CROP_VIEW_SIZE / imgSize.height);
    }, [imgSize]);

    const displayScale = baseScale * zoom;

    const getClampedOffset = (nextX, nextY, targetScale = displayScale) => {
        if (!imgSize) return { x: 0, y: 0 };

        const renderedW = imgSize.width * targetScale;
        const renderedH = imgSize.height * targetScale;
        const maxOffsetX = Math.max(0, (renderedW - CROP_VIEW_SIZE) / 2);
        const maxOffsetY = Math.max(0, (renderedH - CROP_VIEW_SIZE) / 2);

        return {
            x: clamp(nextX, -maxOffsetX, maxOffsetX),
            y: clamp(nextY, -maxOffsetY, maxOffsetY),
        };
    };

    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        setImgSize({ width: naturalWidth, height: naturalHeight });
        setZoom(1);
        setOffset({ x: 0, y: 0 });
    };

    const handleZoomChange = (nextZoom) => {
        const clampedZoom = clamp(Number(nextZoom), 1, 3);
        const nextScale = baseScale * clampedZoom;
        setZoom(clampedZoom);
        setOffset((prev) => getClampedOffset(prev.x, prev.y, nextScale));
    };

    const handleReset = () => {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
    };

    const handlePointerDown = (e) => {
        if (uploading || !imgSize) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        dragStart.current = {
            pointerX: e.clientX,
            pointerY: e.clientY,
            startX: offset.x,
            startY: offset.y,
        };
    };

    const handlePointerMove = (e) => {
        if (!dragging || !dragStart.current) return;
        const dx = e.clientX - dragStart.current.pointerX;
        const dy = e.clientY - dragStart.current.pointerY;
        setOffset(getClampedOffset(dragStart.current.startX + dx, dragStart.current.startY + dy));
    };

    const handlePointerUp = () => {
        setDragging(false);
        dragStart.current = null;
    };

    const handleApply = async () => {
        if (!imgRef.current || !imgSize || uploading) return;

        const canvas = document.createElement("canvas");
        canvas.width = OUTPUT_SIZE;
        canvas.height = OUTPUT_SIZE;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Map the visible CROP_VIEW_SIZE square back to source image coordinates.
        const renderedW = imgSize.width * displayScale;
        const renderedH = imgSize.height * displayScale;
        const imgLeftInView = (CROP_VIEW_SIZE - renderedW) / 2 + offset.x;
        const imgTopInView = (CROP_VIEW_SIZE - renderedH) / 2 + offset.y;

        const srcX = -imgLeftInView / displayScale;
        const srcY = -imgTopInView / displayScale;
        const srcSize = CROP_VIEW_SIZE / displayScale;

        ctx.drawImage(
            imgRef.current,
            srcX,
            srcY,
            srcSize,
            srcSize,
            0,
            0,
            OUTPUT_SIZE,
            OUTPUT_SIZE
        );

        const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, "image/webp", 0.9)
        );

        const finalBlob =
            blob && blob.type === "image/webp"
                ? blob
                : await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

        if (!finalBlob) return;

        const ext = finalBlob.type === "image/webp" ? "webp" : "png";
        const baseName = (file?.name || "profile").replace(/\.[^.]+$/, "");
        const croppedFile = new File([finalBlob], `${baseName}-cropped.${ext}`, {
            type: finalBlob.type,
            lastModified: Date.now(),
        });

        onConfirm(croppedFile);
    };

    if (!file) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="crop-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 animate-modal-in"
            onClick={() => !uploading && onCancel()}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-5 sm:p-6"
            >
                <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                        <h3 id="crop-modal-title" className="text-lg font-bold text-slate-900">
                            Adjust Profile Photo
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Drag to reposition and zoom to frame your photo.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={uploading}
                        aria-label="Close crop dialog"
                        className="w-11 h-11 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition disabled:opacity-50"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Crop viewport */}
                <div className="flex justify-center">
                    <div
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        style={{ width: CROP_VIEW_SIZE, height: CROP_VIEW_SIZE }}
                        className={`relative overflow-hidden rounded-2xl bg-slate-900 select-none touch-none ${
                            dragging ? "cursor-grabbing" : "cursor-grab"
                        }`}
                    >
                        {imageUrl && !loadError && (
                            <img
                                ref={imgRef}
                                src={imageUrl}
                                alt="Crop preview"
                                onLoad={handleImageLoad}
                                onError={() => setLoadError(true)}
                                draggable={false}
                                style={
                                    imgSize
                                        ? {
                                              width: imgSize.width * displayScale,
                                              height: imgSize.height * displayScale,
                                              transform: `translate(${(CROP_VIEW_SIZE - imgSize.width * displayScale) / 2 + offset.x}px, ${(CROP_VIEW_SIZE - imgSize.height * displayScale) / 2 + offset.y}px)`,
                                          }
                                        : { opacity: 0 }
                                }
                                className="absolute top-0 left-0 max-w-none pointer-events-none"
                            />
                        )}

                        {loadError && (
                            <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-xs text-red-300">
                                Failed to preview this image. Please choose another file.
                            </div>
                        )}

                        {/* Circular cutout guide matching the Hero avatar */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_999px_rgba(15,23,42,0.55)] border-2 border-white/80"
                        />
                    </div>
                </div>

                {/* Zoom controls */}
                <div className="mt-5 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => handleZoomChange(zoom - 0.15)}
                        disabled={uploading || zoom <= 1}
                        aria-label="Zoom out"
                        className="w-11 h-11 shrink-0 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center transition disabled:opacity-40"
                    >
                        <FaMinus className="text-xs" />
                    </button>

                    <label className="flex-1 flex flex-col">
                        <span className="sr-only">Zoom level</span>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.05"
                            value={zoom}
                            onChange={(e) => handleZoomChange(e.target.value)}
                            disabled={uploading}
                            className="w-full accent-blue-600 cursor-pointer"
                        />
                    </label>

                    <button
                        type="button"
                        onClick={() => handleZoomChange(zoom + 0.15)}
                        disabled={uploading || zoom >= 3}
                        aria-label="Zoom in"
                        className="w-11 h-11 shrink-0 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center transition disabled:opacity-40"
                    >
                        <FaPlus className="text-xs" />
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={uploading}
                        title="Reset position"
                        aria-label="Reset position and zoom"
                        className="w-11 h-11 shrink-0 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center transition disabled:opacity-40"
                    >
                        <FaRedo className="text-xs" />
                    </button>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={uploading}
                        className="min-h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleApply}
                        disabled={uploading || !imgSize}
                        className="min-h-11 px-5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition inline-flex items-center gap-2 disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            "Crop & Upload"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImageCropModal;
