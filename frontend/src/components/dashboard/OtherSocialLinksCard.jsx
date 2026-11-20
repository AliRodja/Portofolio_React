import { useEffect, useState } from "react";
import { FaEdit, FaExclamationCircle, FaLink, FaTrash } from "react-icons/fa";

import socialLinkService from "../../services/socialLinkService";
import { useToast } from "../../context/ToastContext";
import { EXTRA_SOCIAL_PLATFORMS, getSocialPlatform } from "../../constants/socialPlatforms";

import DashboardCard from "./DashboardCard";
import DashboardButton from "./DashboardButton";
import FieldLabel from "./FieldLabel";

const inputClass = "w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition";

function OtherSocialLinksCard() {
    const defaultKey = EXTRA_SOCIAL_PLATFORMS[0].key;
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [platformKey, setPlatformKey] = useState(defaultKey);
    const [url, setUrl] = useState("");
    const [formError, setFormError] = useState("");

    const toast = useToast();

    const fetchLinks = async () => {
        try {
            const response = await socialLinkService.getAll();
            setLinks(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load additional social links.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function loadLinks() {
            try {
                const response = await socialLinkService.getAll();
                setLinks(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load additional social links.");
            } finally {
                setLoading(false);
            }
        }

        loadLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selectedPlatform = getSocialPlatform(platformKey);
    const SelectedIcon = selectedPlatform.icon;

    const resetForm = () => {
        setEditingId(null);
        setPlatformKey(defaultKey);
        setUrl("");
        setFormError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedUrl = url.trim();
        if (!trimmedUrl) {
            setFormError("URL is required.");
            return;
        }

        try {
            const parsed = new URL(trimmedUrl);
            if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
                setFormError("URL must start with http:// or https://.");
                return;
            }
        } catch {
            setFormError("Please enter a valid URL.");
            return;
        }

        setFormError("");

        const payload = {
            platform: selectedPlatform.label,
            url: trimmedUrl,
            icon_name: selectedPlatform.key,
            order_index: editingId
                ? (links.find((l) => l.id === editingId)?.order_index ?? 0)
                : links.length,
        };

        try {
            setSaving(true);

            if (editingId) {
                await socialLinkService.update(editingId, payload);
                toast.success("Social link updated.");
            } else {
                await socialLinkService.create(payload);
                toast.success("Social link added.");
            }

            resetForm();
            fetchLinks();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to save social link.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        const meta = getSocialPlatform(item.icon_name || item.platform);
        setEditingId(item.id);
        setPlatformKey(meta.key);
        setUrl(item.url || "");
        setFormError("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this social media link?")) return;

        try {
            await socialLinkService.delete(id);
            toast.success("Social link removed.");
            if (editingId === id) resetForm();
            fetchLinks();
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove social link.");
        }
    };

    return (
        <DashboardCard className="mt-6">
            <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-800">Other Social Media</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                    Add extra platforms (YouTube, X, TikTok, Dribbble, etc.) to display on your homepage and contact section.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                        <FaExclamationCircle />
                        {formError}
                    </div>
                )}

                <div className="grid sm:grid-cols-[220px_1fr] gap-4">
                    <div>
                        <FieldLabel htmlFor="extra-social-platform" required>Platform</FieldLabel>
                        <div className="relative flex items-center">
                            <span
                                aria-hidden="true"
                                style={{ color: selectedPlatform.brandColor }}
                                className="absolute left-3.5 text-base pointer-events-none"
                            >
                                <SelectedIcon />
                            </span>
                            <select
                                id="extra-social-platform"
                                value={platformKey}
                                onChange={(e) => setPlatformKey(e.target.value)}
                                className={`${inputClass} pl-10 bg-white`}
                            >
                                {EXTRA_SOCIAL_PLATFORMS.map((platform) => (
                                    <option key={platform.key} value={platform.key}>
                                        {platform.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <FieldLabel htmlFor="extra-social-url" required>Profile URL</FieldLabel>
                        <input
                            id="extra-social-url"
                            type="url"
                            placeholder={selectedPlatform.placeholder}
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <DashboardButton type="submit" disabled={saving}>
                        {saving
                            ? "Saving..."
                            : editingId
                                ? "Update Social Link"
                                : "+ Add Social Link"}
                    </DashboardButton>

                    {editingId && (
                        <DashboardButton type="button" variant="secondary" onClick={resetForm}>
                            Cancel
                        </DashboardButton>
                    )}
                </div>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100">
                {loading ? (
                    <div className="space-y-2.5">
                        <div className="h-14 bg-slate-100 rounded-xl animate-pulse" />
                        <div className="h-14 bg-slate-100 rounded-xl animate-pulse" />
                    </div>
                ) : links.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-slate-400 text-sm">
                        <FaLink className="text-2xl mb-2" />
                        <p>No additional social links yet.</p>
                    </div>
                ) : (
                    <ul className="space-y-2.5">
                        {links.map((item) => {
                            const meta = getSocialPlatform(item.icon_name || item.platform);
                            const Icon = meta.icon;

                            return (
                                <li
                                    key={item.id}
                                    className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition"
                                >
                                    <span
                                        style={{ color: meta.brandColor, backgroundColor: meta.brandBg }}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                                    >
                                        <Icon aria-hidden="true" />
                                    </span>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800">
                                            {item.platform || meta.label}
                                        </p>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 hover:underline truncate block"
                                        >
                                            {item.url}
                                        </a>
                                    </div>

                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(item)}
                                            title="Edit"
                                            aria-label={`Edit ${item.platform || meta.label}`}
                                            className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition"
                                        >
                                            <FaEdit />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item.id)}
                                            title="Delete"
                                            aria-label={`Delete ${item.platform || meta.label}`}
                                            className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </DashboardCard>
    );
}

export default OtherSocialLinksCard;
