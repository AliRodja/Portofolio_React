import { useEffect, useMemo, useRef, useState } from "react";
import {
    FaSearch,
    FaEdit,
    FaTrash,
    FaCertificate,
    FaCheckCircle,
    FaExclamationCircle,
    FaUpload,
    FaSpinner,
    FaTimes,
    FaExternalLinkAlt,
    FaFilePdf,
} from "react-icons/fa";

import certificateService from "../../services/certificateService";
import uploadService from "../../services/uploadService";
import { isPdfUrl } from "../../utils/file";

import PageHeader from "../../components/dashboard/PageHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import FieldLabel from "../../components/dashboard/FieldLabel";

const inputClass = "w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition";

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
}

function Certificates() {
    const emptyForm = {
        title: "",
        issuer: "",
        issue_date: "",
        image_url: "",
        credential_url: "",
    };

    const [certificates, setCertificates] = useState([]);
    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const [search, setSearch] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [formError, setFormError] = useState("");

    const fetchCertificates = async () => {
        try {
            const response = await certificateService.getAll();

            setCertificates(response.data);
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Failed to load certificates." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function loadCertificates() {
            await fetchCertificates();
        }

        loadCertificates();
    }, []);

    useEffect(() => {
        if (!feedback) return;

        const timer = setTimeout(() => setFeedback(null), 4000);

        return () => clearTimeout(timer);
    }, [feedback]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFormError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        try {
            setUploading(true);
            setFormError("");

            const response = await uploadService.uploadImage(file);

            setForm((prev) => ({ ...prev, image_url: response.data.image_url }));
        } catch (error) {
            console.error(error);

            setFormError(error.response?.data?.message || "Failed to upload image.");
        } finally {
            setUploading(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveImage = () => {
        setForm((prev) => ({ ...prev, image_url: "" }));

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validateForm = () => {
        if (!form.title.trim()) return "Title is required.";
        if (!form.issuer.trim()) return "Issuer is required.";
        if (!form.issue_date) return "Issue date is required.";
        if (!form.image_url) return "Certificate image is required.";

        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validateForm();

        if (error) {
            setFormError(error);
            return;
        }

        setFormError("");

        try {
            setSaving(true);

            if (editingId) {
                await certificateService.update(editingId, form);

                setFeedback({ type: "success", message: "Certificate updated successfully." });
            } else {
                await certificateService.create(form);

                setFeedback({ type: "success", message: "Certificate added successfully." });
            }

            resetForm();

            fetchCertificates();
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Something went wrong while saving." });
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (certificate) => {
        setEditingId(certificate.id);
        setFormError("");

        setForm({
            title: certificate.title,
            issuer: certificate.issuer || "",
            issue_date: certificate.issue_date ? certificate.issue_date.slice(0, 10) : "",
            image_url: certificate.image_url || "",
            credential_url: certificate.credential_url || "",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this certificate?");

        if (!confirmDelete) return;

        try {
            await certificateService.delete(id);

            setFeedback({ type: "success", message: "Certificate deleted successfully." });

            fetchCertificates();
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Failed to delete certificate." });
        }
    };

    const filteredCertificates = useMemo(() => {
        return certificates.filter((certificate) =>
            certificate.title.toLowerCase().includes(search.toLowerCase()) ||
            (certificate.issuer || "").toLowerCase().includes(search.toLowerCase())
        );
    }, [certificates, search]);

    return (
        <div>

            <PageHeader
                title="Certificates"
                subtitle="Manage the certificates shown on your portfolio."
            />

            {feedback && (
                <div
                    className={`
                        flex items-center gap-2 mb-6 px-4 py-3 rounded-xl text-sm font-medium
                        ${feedback.type === "success"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }
                    `}
                >
                    {feedback.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
                    {feedback.message}
                </div>
            )}

            <DashboardCard className="mb-6">

                <h2 className="text-lg font-bold mb-5">
                    {editingId ? "Edit Certificate" : "Add Certificate"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {formError && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                            <FaExclamationCircle />
                            {formError}
                        </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">

                        <div>
                            <FieldLabel htmlFor="title" required>Title</FieldLabel>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                placeholder="e.g. Certified React Developer"
                                value={form.title}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="issuer" required>Issuer</FieldLabel>
                            <input
                                id="issuer"
                                type="text"
                                name="issuer"
                                placeholder="e.g. Dicoding Indonesia"
                                value={form.issuer}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">

                        <div>
                            <FieldLabel htmlFor="issue_date" required>Issue Date</FieldLabel>
                            <input
                                id="issue_date"
                                type="date"
                                name="issue_date"
                                value={form.issue_date}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="credential_url">Credential URL</FieldLabel>
                            <input
                                id="credential_url"
                                type="text"
                                name="credential_url"
                                placeholder="Optional. Link to verify this credential."
                                value={form.credential_url}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                    </div>

                    <div>
                        <FieldLabel required>Certificate File</FieldLabel>

                        {form.image_url ? (

                            isPdfUrl(form.image_url) ? (

                                <div className="relative flex items-center gap-3 w-full sm:w-56 h-36 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="w-11 h-11 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                        <FaFilePdf className="text-lg" />
                                    </div>

                                    <a
                                        href={form.image_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium truncate"
                                    >
                                        View PDF
                                    </a>

                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        title="Remove file"
                                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition"
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>
                                </div>

                            ) : (

                                <div className="relative w-full sm:w-56">
                                    <img
                                        src={form.image_url}
                                        alt="Preview"
                                        className="w-full h-36 object-cover rounded-xl border border-slate-200 bg-slate-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        title="Remove image"
                                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition"
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>
                                </div>

                            )

                        ) : (

                            <label
                                className={`
                                    flex flex-col items-center justify-center gap-2
                                    w-full sm:w-56 h-36 rounded-xl border-2 border-dashed
                                    text-sm text-slate-400 transition
                                    ${uploading
                                        ? "border-blue-300 bg-blue-50 cursor-wait"
                                        : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer"
                                    }
                                `}
                            >
                                {uploading ? (
                                    <>
                                        <FaSpinner className="animate-spin text-lg text-blue-500" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <FaUpload className="text-lg" />
                                        Upload image or PDF
                                    </>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={handleImageChange}
                                    disabled={uploading}
                                    className="hidden"
                                />
                            </label>

                        )}

                    </div>

                    <div className="flex gap-3 pt-2">

                        <DashboardButton type="submit" disabled={saving || uploading}>
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Certificate"
                                    : "+ Add Certificate"}
                        </DashboardButton>

                        {editingId && (
                            <DashboardButton type="button" variant="secondary" onClick={resetForm}>
                                Cancel
                            </DashboardButton>
                        )}
                    </div>

                </form>

            </DashboardCard>

            <DashboardCard>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">

                    <h2 className="text-lg font-bold">
                        Certificate List
                    </h2>

                    <div className="relative sm:w-72">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

                        <input
                            type="text"
                            placeholder="Search certificates..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`${inputClass} pl-9`}
                        />
                    </div>

                </div>

                {loading ? (

                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
                        ))}
                    </div>

                ) : filteredCertificates.length === 0 ? (

                    <div className="flex flex-col items-center py-14 text-slate-400">
                        <FaCertificate className="text-4xl mb-3" />
                        <p>No certificates found.</p>
                    </div>

                ) : (

                    <div className="space-y-3">

                        {filteredCertificates.map((certificate) => (

                            <div
                                key={certificate.id}
                                className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition"
                            >

                                {certificate.image_url && isPdfUrl(certificate.image_url) ? (
                                    <a
                                        href={certificate.image_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="View PDF"
                                        className="w-16 h-11 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0 hover:bg-red-100 transition"
                                    >
                                        <FaFilePdf />
                                    </a>
                                ) : certificate.image_url ? (
                                    <img
                                        src={certificate.image_url}
                                        alt={certificate.title}
                                        className="w-16 h-11 rounded-lg object-cover shrink-0 bg-slate-100"
                                        onError={(e) => { e.target.style.display = "none"; }}
                                    />
                                ) : (
                                    <div className="w-16 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <FaCertificate />
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">

                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-semibold text-slate-800">
                                            {certificate.title}
                                        </h3>

                                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                                            {formatDate(certificate.issue_date)}
                                        </span>
                                    </div>

                                    <p className="text-sm text-slate-500 mt-0.5">
                                        {certificate.issuer}
                                    </p>

                                    {certificate.credential_url && (
                                        <a
                                            href={certificate.credential_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 mt-2"
                                        >
                                            View credential
                                            <FaExternalLinkAlt className="text-[10px]" />
                                        </a>
                                    )}

                                </div>

                                <div className="flex gap-2 shrink-0">

                                    <button
                                        onClick={() => handleEdit(certificate)}
                                        title="Edit"
                                        className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition"
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(certificate.id)}
                                        title="Delete"
                                        className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition"
                                    >
                                        <FaTrash />
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </DashboardCard>

        </div>
    );
}

export default Certificates;
