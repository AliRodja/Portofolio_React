import { useEffect, useMemo, useState } from "react";
import {
    FaSearch,
    FaEdit,
    FaTrash,
    FaFolderOpen,
    FaCheckCircle,
    FaExclamationCircle,
    FaImage,
} from "react-icons/fa";

import projectService from "../../services/projectService";

import PageHeader from "../../components/dashboard/PageHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";

const inputClass = "w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition";

function Projects() {
    const emptyForm = {
        title: "",
        description: "",
        image_url: "",
        tech_stack: "",
        demo_link: "",
        repo_link: "",
        category: "",
        featured: false,
    };

    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [formError, setFormError] = useState("");

    const fetchProjects = async () => {
        try {
            const response = await projectService.getAll();

            setProjects(response.data);
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Gagal mengambil data project." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function loadProjects() {
            await fetchProjects();
        }

        loadProjects();
    }, []);

    useEffect(() => {
        if (!feedback) return;

        const timer = setTimeout(() => setFeedback(null), 4000);

        return () => clearTimeout(timer);
    }, [feedback]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const resetForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFormError("");
    };

    const validateForm = () => {
        if (!form.title.trim()) return "Title wajib diisi.";
        if (!form.description.trim()) return "Description wajib diisi.";
        if (!form.category.trim()) return "Category wajib diisi.";
        if (!form.tech_stack.trim()) return "Tech Stack wajib diisi.";

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
            tech_stack: form.tech_stack
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
        };

        try {
            setSaving(true);

            if (editingId) {
                await projectService.update(editingId, payload);

                setFeedback({ type: "success", message: "Project berhasil diperbarui." });
            } else {
                await projectService.create(payload);

                setFeedback({ type: "success", message: "Project berhasil ditambahkan." });
            }

            resetForm();

            fetchProjects();
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Terjadi kesalahan saat menyimpan project." });
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (project) => {
        setEditingId(project.id);
        setFormError("");

        setForm({
            ...project,
            tech_stack: Array.isArray(project.tech_stack)
                ? project.tech_stack.join(", ")
                : "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Yakin ingin menghapus project ini?"
        );

        if (!confirmDelete) return;

        try {
            await projectService.delete(id);

            setFeedback({ type: "success", message: "Project berhasil dihapus." });

            fetchProjects();
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Gagal menghapus project." });
        }
    };

    const filteredProjects = useMemo(() => {
        return projects.filter((project) =>
            project.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [projects, search]);

    return (
        <div>

            <PageHeader
                title="Projects"
                subtitle="Manage your portfolio projects."
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
                    {editingId ? "Edit Project" : "Tambah Project"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {formError && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                            <FaExclamationCircle />
                            {formError}
                        </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">

                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={form.title}
                            onChange={handleChange}
                            className={inputClass}
                        />

                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={form.category}
                            onChange={handleChange}
                            className={inputClass}
                        />

                    </div>

                    <textarea
                        name="description"
                        placeholder="Description"
                        rows="4"
                        value={form.description}
                        onChange={handleChange}
                        className={inputClass}
                    />

                    <input
                        type="text"
                        name="image_url"
                        placeholder="Image URL"
                        value={form.image_url}
                        onChange={handleChange}
                        className={inputClass}
                    />

                    <input
                        type="text"
                        name="tech_stack"
                        placeholder="React, Node.js, PostgreSQL"
                        value={form.tech_stack}
                        onChange={handleChange}
                        className={inputClass}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">

                        <input
                            type="text"
                            name="demo_link"
                            placeholder="Demo Link"
                            value={form.demo_link}
                            onChange={handleChange}
                            className={inputClass}
                        />

                        <input
                            type="text"
                            name="repo_link"
                            placeholder="Repository Link"
                            value={form.repo_link}
                            onChange={handleChange}
                            className={inputClass}
                        />

                    </div>

                    <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                            type="checkbox"
                            name="featured"
                            checked={form.featured}
                            onChange={handleChange}
                            className="w-4 h-4 accent-blue-600"
                        />

                        Featured
                    </label>

                    <div className="flex gap-3 pt-2">

                        <DashboardButton type="submit" disabled={saving}>
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Project"
                                    : "+ Tambah Project"}
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
                        Daftar Project
                    </h2>

                    <div className="relative sm:w-72">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

                        <input
                            type="text"
                            placeholder="Cari project..."
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

                ) : filteredProjects.length === 0 ? (

                    <div className="flex flex-col items-center py-14 text-slate-400">
                        <FaFolderOpen className="text-4xl mb-3" />
                        <p>Belum ada project yang ditemukan.</p>
                    </div>

                ) : (

                    <div className="overflow-x-auto -mx-2">

                        <table className="w-full text-sm border-collapse">

                            <thead>

                                <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">

                                    <th className="px-2 py-3 font-semibold">Project</th>
                                    <th className="px-2 py-3 font-semibold">Category</th>
                                    <th className="px-2 py-3 font-semibold">Tech Stack</th>
                                    <th className="px-2 py-3 font-semibold text-center">Featured</th>
                                    <th className="px-2 py-3 font-semibold text-right">Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredProjects.map((project) => (

                                    <tr key={project.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50 transition">

                                        <td className="px-2 py-3">
                                            <div className="flex items-center gap-3 min-w-[180px]">

                                                {project.image_url ? (
                                                    <img
                                                        src={project.image_url}
                                                        alt={project.title}
                                                        className="w-10 h-10 rounded-lg object-cover shrink-0 bg-slate-100"
                                                        onError={(e) => { e.target.style.display = "none"; }}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                                                        <FaImage />
                                                    </div>
                                                )}

                                                <span className="font-semibold text-slate-800 truncate">
                                                    {project.title}
                                                </span>

                                            </div>
                                        </td>

                                        <td className="px-2 py-3">
                                            <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                                                {project.category || "-"}
                                            </span>
                                        </td>

                                        <td className="px-2 py-3">
                                            <div className="flex flex-wrap gap-1 max-w-[240px]">
                                                {Array.isArray(project.tech_stack) && project.tech_stack.length > 0
                                                    ? project.tech_stack.map((tech) => (
                                                        <span key={tech} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">
                                                            {tech}
                                                        </span>
                                                    ))
                                                    : <span className="text-slate-400">-</span>
                                                }
                                            </div>
                                        </td>

                                        <td className="px-2 py-3 text-center">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${project.featured ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                                                {project.featured ? "Yes" : "No"}
                                            </span>
                                        </td>

                                        <td className="px-2 py-3">

                                            <div className="flex justify-end gap-2">

                                                <button
                                                    onClick={() => handleEdit(project)}
                                                    title="Edit"
                                                    className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition"
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    title="Delete"
                                                    className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition"
                                                >
                                                    <FaTrash />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </DashboardCard>

        </div>
    );
}

export default Projects;
