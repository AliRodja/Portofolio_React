import { useEffect, useMemo, useState } from "react";
import projectService from "../../services/projectService";

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

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);

            const response = await projectService.getAll();

            setProjects(response.data);
        } catch (error) {
            console.error(error);

            alert("Gagal mengambil data project.");
        } finally {
            setLoading(false);
        }
    };

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
    };

    const validateForm = () => {
        if (!form.title.trim()) {
            alert("Title wajib diisi.");
            return false;
        }

        if (!form.description.trim()) {
            alert("Description wajib diisi.");
            return false;
        }

        if (!form.category.trim()) {
            alert("Category wajib diisi.");
            return false;
        }

        if (!form.tech_stack.trim()) {
            alert("Tech Stack wajib diisi.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

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

                alert("Project berhasil diperbarui.");
            } else {
                await projectService.create(payload);

                alert("Project berhasil ditambahkan.");
            }

            resetForm();

            fetchProjects();
        } catch (error) {
            console.error(error);

            alert("Terjadi kesalahan.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (project) => {
        setEditingId(project.id);

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

            alert("Project berhasil dihapus.");

            fetchProjects();
        } catch (error) {
            console.error(error);

            alert("Gagal menghapus project.");
        }
    };

    const filteredProjects = useMemo(() => {
        return projects.filter((project) =>
            project.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [projects, search]);

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-2">
                Projects Management
            </h1>

            <p className="text-gray-500 mb-6">
                Manage your portfolio projects.
            </p>

            <div className="border rounded-lg p-5 mb-8">

                <h2 className="text-xl font-semibold mb-4">
                    {editingId ? "Edit Project" : "Tambah Project"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border rounded p-3"
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        rows="4"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border rounded p-3"
                    />

                    <input
                        type="text"
                        name="image_url"
                        placeholder="Image URL"
                        value={form.image_url}
                        onChange={handleChange}
                        className="w-full border rounded p-3"
                    />

                    <input
                        type="text"
                        name="tech_stack"
                        placeholder="React, Node.js, PostgreSQL"
                        value={form.tech_stack}
                        onChange={handleChange}
                        className="w-full border rounded p-3"
                    />

                    <input
                        type="text"
                        name="demo_link"
                        placeholder="Demo Link"
                        value={form.demo_link}
                        onChange={handleChange}
                        className="w-full border rounded p-3"
                    />

                    <input
                        type="text"
                        name="repo_link"
                        placeholder="Repository Link"
                        value={form.repo_link}
                        onChange={handleChange}
                        className="w-full border rounded p-3"
                    />

                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full border rounded p-3"
                    />

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="featured"
                            checked={form.featured}
                            onChange={handleChange}
                        />

                        Featured
                    </label>

                    <div className="flex gap-3">

                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-5 py-2 rounded"
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Project"
                                    : "Tambah Project"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-5 py-2 rounded"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                </form>

            </div>

            <div className="border rounded-lg p-5">

                <div className="flex items-center justify-between mb-4">

                    <h2 className="text-xl font-semibold">
                        Daftar Project
                    </h2>

                    <input
                        type="text"
                        placeholder="Cari project..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded p-2 w-72"
                    />

                </div>

                {loading ? (

                    <p className="text-center py-6">
                        Loading...
                    </p>

                ) : filteredProjects.length === 0 ? (

                    <div className="text-center py-10 text-gray-500">
                        Belum ada project yang ditemukan.
                    </div>

                ) : (

                    <table className="w-full border-collapse border">

                        <thead>

                            <tr className="bg-gray-100">

                                <th className="border p-3 text-left">
                                    Title
                                </th>

                                <th className="border p-3 text-left">
                                    Category
                                </th>

                                <th className="border p-3 text-center">
                                    Featured
                                </th>

                                <th className="border p-3">
                                    Tech Stack
                                </th>

                                <th className="border p-3 text-center">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredProjects.map((project) => (

                                <tr key={project.id}>

                                    <td className="border p-3">
                                        {project.title}
                                    </td>

                                    <td className="border p-3">
                                        {project.category}
                                    </td>

                                    <td className="border p-3 text-center">
                                        {project.featured ? "Yes" : "No"}
                                    </td>

                                    <td className="border p-3">
                                        {Array.isArray(project.tech_stack)
                                            ? project.tech_stack.join(", ")
                                            : "-"}
                                    </td>

                                    <td className="border p-3">

                                        <div className="flex justify-center gap-2">

                                            <button
                                                onClick={() => handleEdit(project)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
}

export default Projects;