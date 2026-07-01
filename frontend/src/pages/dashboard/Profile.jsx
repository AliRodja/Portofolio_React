import { useEffect, useState } from "react";
import profileService from "../../services/profileService";

function Profile() {
    const [form, setForm] = useState({
        full_name: "",
        headline: "",
        about: "",
        email: "",
        phone: "",
        location: "",
        github_url: "",
        linkedin_url: "",
        instagram_url: "",
        profile_image: "",
        resume_url: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await profileService.getProfile();
            setForm(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            await profileService.updateProfile(form);

            alert("Profile updated successfully.");

        } catch (err) {

            console.error(err);

            alert("Failed to update profile.");

        } finally {

            setSaving(false);

        }
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="max-w-5xl">

            <h1 className="text-4xl font-bold mb-8">
                Edit Profile
            </h1>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-6"
            >

                <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="border rounded-xl p-4"
                />

                <input
                    name="headline"
                    value={form.headline}
                    onChange={handleChange}
                    placeholder="Headline"
                    className="border rounded-xl p-4"
                />

                <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="border rounded-xl p-4"
                />

                <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="border rounded-xl p-4"
                />

                <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="border rounded-xl p-4"
                />

                <input
                    name="github_url"
                    value={form.github_url}
                    onChange={handleChange}
                    placeholder="Github URL"
                    className="border rounded-xl p-4"
                />

                <input
                    name="linkedin_url"
                    value={form.linkedin_url}
                    onChange={handleChange}
                    placeholder="LinkedIn URL"
                    className="border rounded-xl p-4"
                />

                <input
                    name="instagram_url"
                    value={form.instagram_url}
                    onChange={handleChange}
                    placeholder="Instagram URL"
                    className="border rounded-xl p-4"
                />

                <input
                    name="profile_image"
                    value={form.profile_image}
                    onChange={handleChange}
                    placeholder="Profile Image URL"
                    className="border rounded-xl p-4 col-span-2"
                />

                <input
                    name="resume_url"
                    value={form.resume_url}
                    onChange={handleChange}
                    placeholder="Resume URL"
                    className="border rounded-xl p-4 col-span-2"
                />

                <textarea
                    name="about"
                    value={form.about}
                    onChange={handleChange}
                    placeholder="About"
                    rows="6"
                    className="border rounded-xl p-4 col-span-2"
                />

                <button
                    type="submit"
                    disabled={saving}
                    className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            py-4
            rounded-xl
            col-span-2
          "
                >
                    {saving ? "Saving..." : "Save Profile"}
                </button>

            </form>

        </div>
    );
}

export default Profile;