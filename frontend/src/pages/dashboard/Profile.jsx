import { useEffect, useRef, useState } from "react";
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaUpload,
    FaSpinner,
    FaTimes,
    FaFilePdf,
    FaUser,
    FaGithub,
    FaLinkedin,
    FaInstagram,
} from "react-icons/fa";

import profileService from "../../services/profileService";
import uploadService from "../../services/uploadService";

import PageHeader from "../../components/dashboard/PageHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import FieldLabel from "../../components/dashboard/FieldLabel";

const inputClass = "w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition";

function Profile() {
    const emptyForm = {
        full_name: "",
        headline: "",
        about: "",
        short_bio: "",
        email: "",
        phone: "",
        location: "",
        github_url: "",
        linkedin_url: "",
        instagram_url: "",
        profile_image: "",
        resume_url: "",
    };

    const [form, setForm] = useState(emptyForm);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);

    const [feedback, setFeedback] = useState(null);
    const [formError, setFormError] = useState("");

    const imageInputRef = useRef(null);
    const resumeInputRef = useRef(null);

    const loadProfile = async () => {
        try {
            const data = await profileService.getProfile();

            const sanitized = Object.fromEntries(
                Object.entries(data).map(([key, value]) => [key, value ?? ""])
            );

            setForm({ ...emptyForm, ...sanitized });
        } catch (err) {
            console.error(err);

            setFeedback({ type: "error", message: "Failed to load profile." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function load() {
            await loadProfile();
        }

        load();
    }, []);

    useEffect(() => {
        if (!feedback) return;

        const timer = setTimeout(() => setFeedback(null), 4000);

        return () => clearTimeout(timer);
    }, [feedback]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        try {
            setUploadingImage(true);
            setFormError("");

            const response = await uploadService.uploadImage(file);

            setForm((prev) => ({ ...prev, profile_image: response.data.image_url }));
        } catch (error) {
            console.error(error);

            setFormError(error.response?.data?.message || "Failed to upload image.");
        } finally {
            setUploadingImage(false);

            if (imageInputRef.current) imageInputRef.current.value = "";
        }
    };

    const handleResumeChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        try {
            setUploadingResume(true);
            setFormError("");

            const response = await uploadService.uploadImage(file);

            setForm((prev) => ({ ...prev, resume_url: response.data.image_url }));
        } catch (error) {
            console.error(error);

            setFormError(error.response?.data?.message || "Failed to upload resume.");
        } finally {
            setUploadingResume(false);

            if (resumeInputRef.current) resumeInputRef.current.value = "";
        }
    };

    const validateForm = () => {
        if (!form.full_name.trim()) return "Full name is required.";
        if (!form.headline.trim()) return "Headline is required.";
        if (!form.email.trim()) return "Email is required.";
        if (!form.about.trim()) return "About is required.";
        if (!form.short_bio.trim()) return "Hero introduction is required.";

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

            await profileService.updateProfile(form);

            setFeedback({ type: "success", message: "Profile updated successfully." });
        } catch (err) {
            console.error(err);

            setFeedback({ type: "error", message: "Failed to update profile." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div>
                <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse mb-8" />
                <div className="h-96 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            </div>
        );
    }

    return (
        <div>

            <PageHeader
                title="Profile"
                subtitle="This information is shown publicly on your portfolio."
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

            <DashboardCard>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {formError && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                            <FaExclamationCircle />
                            {formError}
                        </div>
                    )}

                    {/* Profile picture */}
                    <div className="flex items-center gap-5">

                        {form.profile_image ? (
                            <div className="relative w-24 h-24 shrink-0">
                                <img
                                    src={form.profile_image}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border border-slate-200 bg-slate-100"
                                />

                                <button
                                    type="button"
                                    onClick={() => setForm((prev) => ({ ...prev, profile_image: "" }))}
                                    title="Remove image"
                                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition"
                                >
                                    <FaTimes className="text-xs" />
                                </button>
                            </div>
                        ) : (
                            <label
                                className={`
                                    flex items-center justify-center
                                    w-24 h-24 rounded-full border-2 border-dashed shrink-0
                                    text-slate-400 transition
                                    ${uploadingImage
                                        ? "border-blue-300 bg-blue-50 cursor-wait"
                                        : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer"
                                    }
                                `}
                            >
                                {uploadingImage ? (
                                    <FaSpinner className="animate-spin text-lg text-blue-500" />
                                ) : (
                                    <FaUser className="text-2xl" />
                                )}

                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={uploadingImage}
                                    className="hidden"
                                />
                            </label>
                        )}

                        <div>
                            <label
                                className={`
                                    inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition
                                    ${uploadingImage ? "bg-slate-100 text-slate-400 cursor-wait" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}
                                `}
                            >
                                <FaUpload className="text-xs" />
                                {form.profile_image ? "Change Photo" : "Upload Photo"}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={uploadingImage}
                                    className="hidden"
                                />
                            </label>

                            <p className="text-xs text-slate-400 mt-2">Shown on your Hero and About sections.</p>
                        </div>

                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">

                        <div>
                            <FieldLabel htmlFor="full_name" required>Full Name</FieldLabel>
                            <input
                                id="full_name"
                                type="text"
                                name="full_name"
                                placeholder="e.g. Ali Imran Rodja"
                                value={form.full_name}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="headline" required>Headline</FieldLabel>
                            <input
                                id="headline"
                                type="text"
                                name="headline"
                                placeholder="e.g. Full Stack Developer"
                                value={form.headline}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">

                        <div>
                            <FieldLabel htmlFor="email" required>Email</FieldLabel>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor="phone">Phone</FieldLabel>
                            <input
                                id="phone"
                                type="text"
                                name="phone"
                                placeholder="e.g. +62 812 3456 7890"
                                value={form.phone}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                    </div>

                    <div>
                        <FieldLabel htmlFor="location">Location</FieldLabel>
                        <input
                            id="location"
                            type="text"
                            name="location"
                            placeholder="e.g. Gorontalo, Indonesia"
                            value={form.location}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <FieldLabel htmlFor="short_bio" required>Hero Introduction</FieldLabel>
                        <textarea
                            id="short_bio"
                            name="short_bio"
                            placeholder="A short 1-2 sentence intro shown at the top of your homepage (Hero section)..."
                            rows="3"
                            value={form.short_bio}
                            onChange={handleChange}
                            className={inputClass}
                        />
                        <p className="text-xs text-slate-400 mt-2">Shown only in the Hero section, at the very top of your homepage.</p>
                    </div>

                    <div>
                        <FieldLabel htmlFor="about" required>About</FieldLabel>
                        <textarea
                            id="about"
                            name="about"
                            placeholder="A longer story about yourself shown in the About section..."
                            rows="5"
                            value={form.about}
                            onChange={handleChange}
                            className={inputClass}
                        />
                        <p className="text-xs text-slate-400 mt-2">Shown in the About section, further down your homepage.</p>
                    </div>

                    <div className="border-t border-slate-100 pt-6">

                        <h3 className="text-sm font-semibold text-slate-700 mb-4">Social Links</h3>

                        <div className="grid sm:grid-cols-3 gap-4">

                            <div>
                                <FieldLabel htmlFor="github_url">
                                    <span className="inline-flex items-center gap-1.5"><FaGithub /> GitHub</span>
                                </FieldLabel>
                                <input
                                    id="github_url"
                                    type="text"
                                    name="github_url"
                                    placeholder="https://github.com/username"
                                    value={form.github_url}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <FieldLabel htmlFor="linkedin_url">
                                    <span className="inline-flex items-center gap-1.5"><FaLinkedin /> LinkedIn</span>
                                </FieldLabel>
                                <input
                                    id="linkedin_url"
                                    type="text"
                                    name="linkedin_url"
                                    placeholder="https://linkedin.com/in/username"
                                    value={form.linkedin_url}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <FieldLabel htmlFor="instagram_url">
                                    <span className="inline-flex items-center gap-1.5"><FaInstagram /> Instagram</span>
                                </FieldLabel>
                                <input
                                    id="instagram_url"
                                    type="text"
                                    name="instagram_url"
                                    placeholder="https://instagram.com/username"
                                    value={form.instagram_url}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                        </div>

                    </div>

                    <div className="border-t border-slate-100 pt-6">

                        <FieldLabel>Resume / CV</FieldLabel>

                        {form.resume_url ? (

                            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 w-full sm:w-80">

                                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                    <FaFilePdf />
                                </div>

                                <a
                                    href={form.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium truncate flex-1"
                                >
                                    View current resume
                                </a>

                                <button
                                    type="button"
                                    onClick={() => setForm((prev) => ({ ...prev, resume_url: "" }))}
                                    title="Remove resume"
                                    className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center shrink-0 transition"
                                >
                                    <FaTimes className="text-xs" />
                                </button>

                            </div>

                        ) : (

                            <label
                                className={`
                                    inline-flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed
                                    text-sm text-slate-400 transition
                                    ${uploadingResume
                                        ? "border-blue-300 bg-blue-50 cursor-wait"
                                        : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer"
                                    }
                                `}
                            >
                                {uploadingResume ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <FaUpload />
                                        Upload PDF
                                    </>
                                )}

                                <input
                                    ref={resumeInputRef}
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleResumeChange}
                                    disabled={uploadingResume}
                                    className="hidden"
                                />
                            </label>

                        )}

                    </div>

                    <div className="pt-2">

                        <DashboardButton type="submit" disabled={saving || uploadingImage || uploadingResume}>
                            {saving ? "Saving..." : "Save Profile"}
                        </DashboardButton>

                    </div>

                </form>

            </DashboardCard>

        </div>
    );
}

export default Profile;
