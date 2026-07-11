import { useEffect, useMemo, useState } from "react";
import {
    FaSearch,
    FaEdit,
    FaTrash,
    FaGraduationCap,
    FaCheckCircle,
    FaExclamationCircle,
    FaUniversity,
} from "react-icons/fa";

import educationService from "../../services/educationService";

import PageHeader from "../../components/dashboard/PageHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import FieldLabel from "../../components/dashboard/FieldLabel";

const inputClass = "w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition";

function Education() {
    const emptyForm = {
        institution: "",
        degree: "",
        start_year: "",
        end_year: "",
        description: "",
    };

    const [educationList, setEducationList] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [currentlyStudying, setCurrentlyStudying] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [formError, setFormError] = useState("");

    const fetchEducation = async () => {
        try {
            const response = await educationService.getAll();

            setEducationList(response.data);
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Failed to load education." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function loadEducation() {
            await fetchEducation();
        }

        loadEducation();
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

    const handleCurrentlyStudyingChange = (e) => {
        const checked = e.target.checked;

        setCurrentlyStudying(checked);

        if (checked) {
            setForm((prev) => ({ ...prev, end_year: "" }));
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setCurrentlyStudying(false);
        setFormError("");
    };

    const validateForm = () => {
        if (!form.institution.trim()) return "Institution is required.";
        if (!form.degree.trim()) return "Degree is required.";
        if (!form.start_year) return "Start year is required.";

        if (!currentlyStudying && !form.end_year) {
            return "End year is required, or check \"I currently study here\".";
        }

        const startYear = Number(form.start_year);
        const endYear = form.end_year ? Number(form.end_year) : null;

        if (endYear && endYear < startYear) {
            return "End year cannot be earlier than start year.";
        }

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
            end_year: currentlyStudying ? null : form.end_year,
        };

        try {
            setSaving(true);

            if (editingId) {
                await educationService.update(editingId, payload);

                setFeedback({ type: "success", message: "Education updated successfully." });
            } else {
                await educationService.create(payload);

                setFeedback({ type: "success", message: "Education added successfully." });
            }

            resetForm();

            fetchEducation();
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Something went wrong while saving." });
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormError("");
        setCurrentlyStudying(!item.end_year);

        setForm({
            institution: item.institution,
            degree: item.degree || "",
            start_year: item.start_year || "",
            end_year: item.end_year || "",
            description: item.description || "",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this education entry?");

        if (!confirmDelete) return;

        try {
            await educationService.delete(id);

            setFeedback({ type: "success", message: "Education deleted successfully." });

            fetchEducation();
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Failed to delete education." });
        }
    };

    const filteredEducation = useMemo(() => {
        return educationList.filter((item) =>
            item.institution.toLowerCase().includes(search.toLowerCase()) ||
            (item.degree || "").toLowerCase().includes(search.toLowerCase())
        );
    }, [educationList, search]);

    return (
        <div>

            <PageHeader
                title="Education"
                subtitle="Manage your academic background."
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
                    {editingId ? "Edit Education" : "Add Education"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {formError && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                            <FaExclamationCircle />
                            {formError}
                        </div>
                    )}

                    <div>
                        <FieldLabel htmlFor="institution" required>Institution</FieldLabel>
                        <input
                            id="institution"
                            type="text"
                            name="institution"
                            placeholder="e.g. Universitas Pasundan"
                            value={form.institution}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <FieldLabel htmlFor="degree" required>Degree</FieldLabel>
                        <input
                            id="degree"
                            type="text"
                            name="degree"
                            placeholder="e.g. Bachelor of Informatics Engineering"
                            value={form.degree}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">

                        <div>
                            <FieldLabel htmlFor="start_year" required>Start Year</FieldLabel>
                            <input
                                id="start_year"
                                type="number"
                                name="start_year"
                                placeholder="e.g. 2022"
                                min="1950"
                                max="2100"
                                value={form.start_year}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="end_year" required={!currentlyStudying}>End Year</FieldLabel>
                            <input
                                id="end_year"
                                type="number"
                                name="end_year"
                                placeholder="e.g. 2026"
                                min="1950"
                                max="2100"
                                value={form.end_year}
                                onChange={handleChange}
                                disabled={currentlyStudying}
                                className={`${inputClass} ${currentlyStudying ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}`}
                            />

                            <label className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                                <input
                                    type="checkbox"
                                    checked={currentlyStudying}
                                    onChange={handleCurrentlyStudyingChange}
                                    className="w-4 h-4 accent-blue-600"
                                />
                                I currently study here
                            </label>
                        </div>

                    </div>

                    <div>
                        <FieldLabel htmlFor="description">Description</FieldLabel>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Optional. Notable achievements, GPA, activities, thesis title, etc."
                            rows="4"
                            value={form.description}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">

                        <DashboardButton type="submit" disabled={saving}>
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Education"
                                    : "+ Add Education"}
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
                        Education List
                    </h2>

                    <div className="relative sm:w-72">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

                        <input
                            type="text"
                            placeholder="Search education..."
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

                ) : filteredEducation.length === 0 ? (

                    <div className="flex flex-col items-center py-14 text-slate-400">
                        <FaGraduationCap className="text-4xl mb-3" />
                        <p>No education found.</p>
                    </div>

                ) : (

                    <div className="space-y-3">

                        {filteredEducation.map((item) => (

                            <div
                                key={item.id}
                                className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition"
                            >

                                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                    <FaUniversity />
                                </div>

                                <div className="flex-1 min-w-0">

                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-semibold text-slate-800">
                                            {item.institution}
                                        </h3>

                                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                                            {item.start_year} — {item.end_year || "Present"}
                                        </span>
                                    </div>

                                    <p className="text-sm text-slate-500 mt-0.5">
                                        {item.degree}
                                    </p>

                                    {item.description && (
                                        <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}

                                </div>

                                <div className="flex gap-2 shrink-0">

                                    <button
                                        onClick={() => handleEdit(item)}
                                        title="Edit"
                                        className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition"
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(item.id)}
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

export default Education;
