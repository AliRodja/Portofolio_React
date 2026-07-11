import { useEffect, useMemo, useState } from "react";
import {
    FaSearch,
    FaEdit,
    FaTrash,
    FaCode,
    FaCheckCircle,
    FaExclamationCircle,
} from "react-icons/fa";

import skillService from "../../services/skillService";
import { getSkillIcon } from "../../constants/skillIcons";

import PageHeader from "../../components/dashboard/PageHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import IconPicker from "../../components/dashboard/IconPicker";
import FieldLabel from "../../components/dashboard/FieldLabel";

const inputClass = "w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition";

function Skills() {
    const emptyForm = {
        name: "",
        category: "",
        icon_name: "",
        order_index: 0,
    };

    const [skills, setSkills] = useState([]);
    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [formError, setFormError] = useState("");

    const fetchSkills = async () => {
        try {
            const response = await skillService.getAll();

            setSkills(response.data);
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Failed to load skills." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function loadSkills() {
            await fetchSkills();
        }

        loadSkills();
    }, []);

    useEffect(() => {
        if (!feedback) return;

        const timer = setTimeout(() => setFeedback(null), 4000);

        return () => clearTimeout(timer);
    }, [feedback]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "order_index" ? Number(value) : value,
        }));
    };

    const resetForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFormError("");
    };

    const validateForm = () => {
        if (!form.name.trim()) return "Name is required.";
        if (!form.category.trim()) return "Category is required.";
        if (!form.icon_name) return "Icon is required.";

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
                await skillService.update(editingId, form);

                setFeedback({ type: "success", message: "Skill updated successfully." });
            } else {
                await skillService.create(form);

                setFeedback({ type: "success", message: "Skill added successfully." });
            }

            resetForm();

            fetchSkills();
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Something went wrong while saving." });
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (skill) => {
        setEditingId(skill.id);
        setFormError("");

        setForm({
            name: skill.name,
            category: skill.category || "",
            icon_name: skill.icon_name || "",
            order_index: skill.order_index || 0,
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this skill?");

        if (!confirmDelete) return;

        try {
            await skillService.delete(id);

            setFeedback({ type: "success", message: "Skill deleted successfully." });

            fetchSkills();
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Failed to delete skill." });
        }
    };

    const filteredSkills = useMemo(() => {
        return skills.filter((skill) =>
            skill.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [skills, search]);

    return (
        <div>

            <PageHeader
                title="Skills"
                subtitle="Manage the technologies shown on your portfolio."
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
                    {editingId ? "Edit Skill" : "Add Skill"}
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
                            <FieldLabel htmlFor="name" required>Name</FieldLabel>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="e.g. React"
                                value={form.name}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="category" required>Category</FieldLabel>
                            <input
                                id="category"
                                type="text"
                                name="category"
                                placeholder="e.g. Frontend"
                                value={form.category}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">

                        <div>
                            <FieldLabel required>Icon</FieldLabel>

                            <IconPicker
                                value={form.icon_name}
                                onChange={(key) => setForm((prev) => ({ ...prev, icon_name: key }))}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="order_index">Order</FieldLabel>

                            <input
                                id="order_index"
                                type="number"
                                name="order_index"
                                placeholder="0"
                                value={form.order_index}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                    </div>

                    <div className="flex gap-3 pt-2">

                        <DashboardButton type="submit" disabled={saving}>
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Skill"
                                    : "+ Add Skill"}
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
                        Skill List
                    </h2>

                    <div className="relative sm:w-72">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

                        <input
                            type="text"
                            placeholder="Search skills..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`${inputClass} pl-9`}
                        />
                    </div>

                </div>

                {loading ? (

                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                        ))}
                    </div>

                ) : filteredSkills.length === 0 ? (

                    <div className="flex flex-col items-center py-14 text-slate-400">
                        <FaCode className="text-4xl mb-3" />
                        <p>No skills found.</p>
                    </div>

                ) : (

                    <div className="overflow-x-auto -mx-2">

                        <table className="w-full text-sm border-collapse">

                            <thead>

                                <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">

                                    <th className="px-2 py-3 font-semibold">Skill</th>
                                    <th className="px-2 py-3 font-semibold">Category</th>
                                    <th className="px-2 py-3 font-semibold text-center">Order</th>
                                    <th className="px-2 py-3 font-semibold text-right">Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredSkills.map((skill) => {
                                    const Icon = getSkillIcon(skill.icon_name);

                                    return (

                                        <tr key={skill.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50 transition">

                                            <td className="px-2 py-3">
                                                <div className="flex items-center gap-3">

                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                                        {Icon ? <Icon className="text-lg" /> : <FaCode className="text-lg" />}
                                                    </div>

                                                    <span className="font-semibold text-slate-800 truncate">
                                                        {skill.name}
                                                    </span>

                                                </div>
                                            </td>

                                            <td className="px-2 py-3">
                                                <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                                                    {skill.category || "-"}
                                                </span>
                                            </td>

                                            <td className="px-2 py-3 text-center text-slate-500">
                                                {skill.order_index}
                                            </td>

                                            <td className="px-2 py-3">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        onClick={() => handleEdit(skill)}
                                                        title="Edit"
                                                        className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition"
                                                    >
                                                        <FaEdit />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(skill.id)}
                                                        title="Delete"
                                                        className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition"
                                                    >
                                                        <FaTrash />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    );
                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </DashboardCard>

        </div>
    );
}

export default Skills;
