import { useEffect, useMemo, useRef, useState } from "react";
import {
    FaSearch,
    FaEdit,
    FaTrash,
    FaBriefcase,
    FaCheckCircle,
    FaExclamationCircle,
    FaBuilding,
    FaUpload,
    FaSpinner,
    FaTimes,
} from "react-icons/fa";

import experienceService from "../../services/experienceService";
import uploadService from "../../services/uploadService";

import PageHeader from "../../components/dashboard/PageHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import FieldLabel from "../../components/dashboard/FieldLabel";

const inputClass = "w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition";

function formatMonthYear(dateString) {
    if (!dateString) return "Present";

    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}

function Experience() {
    const emptyForm = {
        position: "",
        organization: "",
        start_date: "",
        end_date: "",
        description: "",
        image_url: "",
    };

    const [experiences, setExperiences] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [currentlyWorking, setCurrentlyWorking] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const [search, setSearch] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [formError, setFormError] = useState("");

    const fetchExperiences = async () => {
        try {
            const response = await experienceService.getAll();

            setExperiences(response.data);
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Failed to load experiences." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function loadExperiences() {
            await fetchExperiences();
        }

        loadExperiences();
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

    const handleCurrentlyWorkingChange = (e) => {
        const checked = e.target.checked;

        setCurrentlyWorking(checked);

        if (checked) {
            setForm((prev) => ({ ...prev, end_date: "" }));
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setCurrentlyWorking(false);
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
        if (!form.position.trim()) return "Position is required.";
        if (!form.organization.trim()) return "Organization is required.";
        if (!form.start_date) return "Start date is required.";
        if (!currentlyWorking && !form.end_date) return "End date is required, or check \"I currently work here\".";

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

        const payload = {
            ...form,
            end_date: currentlyWorking ? null : form.end_date,
        };

        try {
            setSaving(true);

            if (editingId) {
                await experienceService.update(editingId, payload);

                setFeedback({ type: "success", message: "Experience updated successfully." });
            } else {
                await experienceService.create(payload);

                setFeedback({ type: "success", message: "Experience added successfully." });
            }

            resetForm();

            fetchExperiences();
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Something went wrong while saving." });
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (experience) => {
        setEditingId(experience.id);
        setFormError("");
        setCurrentlyWorking(!experience.end_date);

        setForm({
            position: experience.position,
            organization: experience.organization,
            start_date: experience.start_date ? experience.start_date.slice(0, 10) : "",
            end_date: experience.end_date ? experience.end_date.slice(0, 10) : "",
            description: experience.description || "",
            image_url: experience.image_url || "",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this experience?");

        if (!confirmDelete) return;

        try {
            await experienceService.delete(id);

            setFeedback({ type: "success", message: "Experience deleted successfully." });

            fetchExperiences();
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Failed to delete experience." });
        }
    };

    const filteredExperiences = useMemo(() => {
        return experiences.filter((experience) =>
            experience.position.toLowerCase().includes(search.toLowerCase()) ||
            experience.organization.toLowerCase().includes(search.toLowerCase())
        );
    }, [experiences, search]);

    return (
        <div>

            <PageHeader
                title="Experience"
                subtitle="Manage your leadership and organizational experience."
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
                    {editingId ? "Edit Experience" : "Add Experience"}
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
                            <FieldLabel htmlFor="position" required>Position / Role</FieldLabel>
                            <input
                                id="position"
                                type="text"
                                name="position"
                                placeholder="e.g. Head of Frontend Division"
                                value={form.position}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="organization" required>Organization</FieldLabel>
                            <input
                                id="organization"
                                type="text"
                                name="organization"
                                placeholder="e.g. Student Executive Board"
                                value={form.organization}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">

                        <div>
                            <FieldLabel htmlFor="start_date" required>Start Date</FieldLabel>
                            <input
                                id="start_date"
                                type="date"
                                name="start_date"
                                value={form.start_date}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="end_date" required={!currentlyWorking}>End Date</FieldLabel>
                            <input
                                id="end_date"
                                type="date"
                                name="end_date"
                                value={form.end_date}
                                onChange={handleChange}
                                disabled={currentlyWorking}
                                className={`${inputClass} ${currentlyWorking ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}`}
                            />

                            <label className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                                <input
                                    type="checkbox"
                                    checked={currentlyWorking}
                                    onChange={handleCurrentlyWorkingChange}
                                    className="w-4 h-4 accent-blue-600"
                                />
                                I currently work here
                            </label>
                        </div>

                    </div>

                    <div>
                        <FieldLabel>Organization Logo / Photo</FieldLabel>

                        {form.image_url ? (

                            <div className="relative w-24 h-24">
                                <img
                                    src={form.image_url}
                                    alt="Preview"
                                    className="w-24 h-24 object-cover rounded-xl border border-slate-200 bg-slate-100"
                                />

                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    title="Remove image"
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition"
                                >
                                    <FaTimes className="text-xs" />
                                </button>
                            </div>

                        ) : (

                            <label
                                className={`
                                    flex flex-col items-center justify-center gap-1.5
                                    w-24 h-24 rounded-xl border-2 border-dashed
                                    text-xs text-slate-400 transition
                                    ${uploading
                                        ? "border-blue-300 bg-blue-50 cursor-wait"
                                        : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer"
                                    }
                                `}
                            >
                                {uploading ? (
                                    <FaSpinner className="animate-spin text-base text-blue-500" />
                                ) : (
                                    <>
                                        <FaUpload className="text-base" />
                                        Upload
                                    </>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={uploading}
                                    className="hidden"
                                />
                            </label>

                        )}

                        <p className="text-xs text-slate-400 mt-2">Optional. Shown next to this experience on your portfolio.</p>

                    </div>

                    <div>
                        <FieldLabel htmlFor="description">Description</FieldLabel>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Briefly describe your responsibilities and achievements in this role..."
                            rows="4"
                            value={form.description}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">

                        <DashboardButton type="submit" disabled={saving || uploading}>
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Experience"
                                    : "+ Add Experience"}
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
                        Experience List
                    </h2>

                    <div className="relative sm:w-72">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

                        <input
                            type="text"
                            placeholder="Search experience..."
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

                ) : filteredExperiences.length === 0 ? (

                    <div className="flex flex-col items-center py-14 text-slate-400">
                        <FaBriefcase className="text-4xl mb-3" />
                        <p>No experience found.</p>
                    </div>

                ) : (

                    <div className="space-y-3">

                        {filteredExperiences.map((experience) => (

                            <div
                                key={experience.id}
                                className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition"
                            >

                                {experience.image_url ? (
                                    <img
                                        src={experience.image_url}
                                        alt={experience.organization}
                                        className="w-11 h-11 rounded-xl object-cover shrink-0 bg-slate-100"
                                        onError={(e) => { e.target.style.display = "none"; }}
                                    />
                                ) : (
                                    <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                                        <FaBuilding />
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">

                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-semibold text-slate-800">
                                            {experience.position}
                                        </h3>

                                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                                            {formatMonthYear(experience.start_date)} — {formatMonthYear(experience.end_date)}
                                        </span>
                                    </div>

                                    <p className="text-sm text-slate-500 mt-0.5">
                                        {experience.organization}
                                    </p>

                                    {experience.description && (
                                        <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                                            {experience.description}
                                        </p>
                                    )}

                                </div>

                                <div className="flex gap-2 shrink-0">

                                    <button
                                        onClick={() => handleEdit(experience)}
                                        title="Edit"
                                        className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition"
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(experience.id)}
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

export default Experience;
