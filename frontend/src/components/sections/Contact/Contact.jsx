import { useEffect, useState } from "react";
import api from "../../../services/api";
import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

import { Mail, Phone, MapPin, Send, CircleCheck, TriangleAlert } from "lucide-react";

import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import Reveal from "../../ui/Reveal";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

// Fields sit on the dark band: zinc-500 borders reach 3.9:1 against ink, and
// the focus ring is the dark-band accent (blue-400).
const FIELD_CLASS = `
    w-full rounded-xl p-4
    bg-zinc-900 border border-zinc-500
    text-white placeholder-zinc-400
    outline-none
    focus:border-blue-400 focus:ring-2 focus:ring-blue-400
    transition-colors duration-200
`;

function Field({ id, label, children }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-2">
                {label}
            </label>
            {children}
        </div>
    );
}

function Contact({ profile = {} }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        if (!feedback) return;

        const timer = setTimeout(() => setFeedback(null), 5000);

        return () => clearTimeout(timer);
    }, [feedback]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await api.post("/messages", form);

            setForm(EMPTY_FORM);
            setFeedback({ type: "success", message: "Message sent. I'll reply by email." });
        } catch (err) {
            console.error(err);
            // The API explains validation errors and rate limits; show that
            // instead of a generic failure when it is available.
            setFeedback({
                type: "error",
                message: err.response?.data?.message || "Failed to send message. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        profile.email && { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
        profile.phone && { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, "")}` },
        profile.location && { icon: MapPin, label: "Location", value: profile.location, href: null },
    ].filter(Boolean);

    const socials = [
        profile.github_url && { icon: FaGithub, label: "GitHub", href: profile.github_url },
        profile.linkedin_url && { icon: FaLinkedin, label: "LinkedIn", href: profile.linkedin_url },
        profile.instagram_url && { icon: FaInstagram, label: "Instagram", href: profile.instagram_url },
    ].filter(Boolean);

    return (
        <section id="contact" className="bg-ink text-white pt-24 md:pt-28 pb-10">

            {/* Toast */}
            {feedback && (
                <div
                    role="status"
                    className={`
                        fixed top-24 right-6 left-6 sm:left-auto z-50
                        flex items-center gap-3
                        px-5 py-4 rounded-xl shadow-lg
                        animate-toast-in text-white
                        ${feedback.type === "success" ? "bg-emerald-700" : "bg-red-700"}
                    `}
                >
                    {feedback.type === "success" ? (
                        <CircleCheck className="size-5 shrink-0" aria-hidden="true" />
                    ) : (
                        <TriangleAlert className="size-5 shrink-0" aria-hidden="true" />
                    )}
                    <span className="text-sm font-medium">{feedback.message}</span>
                </div>
            )}

            <Container>
                <div className="grid lg:grid-cols-[1fr_1.2fr] gap-14 lg:gap-20">

                    {/* Left: how to reach me */}
                    <div>
                        <SectionHeading
                            dark
                            before="Let's build something"
                            highlight="together"
                            intro="I'm open to freelance work, collaborations, internships, and full-time opportunities."
                        />

                        <Reveal variant="group" stagger={140} delay={100}>
                            {contactInfo.length > 0 && (
                                <ul className="mt-10 space-y-5">
                                    {contactInfo.map(({ icon: Icon, label, value, href }) => {
                                        const content = (
                                            <>
                                                <span className="w-11 h-11 shrink-0 rounded-xl border border-zinc-700 flex items-center justify-center text-lg text-blue-400">
                                                    <Icon aria-hidden="true" className="size-4.5" />
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block text-sm text-zinc-400">{label}</span>
                                                    <span className="block font-medium text-white break-words">{value}</span>
                                                </span>
                                            </>
                                        );

                                        return (
                                            <li key={label}>
                                                {href ? (
                                                    <a
                                                        href={href}
                                                        className="flex items-center gap-4 rounded-xl -m-2 p-2 hover:bg-zinc-900 focus-visible:outline-2 focus-visible:outline-blue-400 transition-colors"
                                                    >
                                                        {content}
                                                    </a>
                                                ) : (
                                                    <div className="flex items-center gap-4">{content}</div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}

                            {socials.length > 0 && (
                                <div className="mt-10">
                                    <p className="text-sm text-zinc-400 mb-3">Find me on</p>
                                    <div className="flex gap-3">
                                        {socials.map(({ icon: Icon, label, href }) => (
                                            <a
                                                key={label}
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={label}
                                                className="
                                                    w-11 h-11 rounded-xl
                                                    border border-zinc-700
                                                    flex items-center justify-center
                                                    text-lg text-zinc-300
                                                    hover:text-white hover:border-zinc-400 hover:bg-zinc-900
                                                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400
                                                    transition-colors duration-200
                                                "
                                            >
                                                <Icon aria-hidden="true" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Reveal>
                    </div>

                    {/* Right: form */}
                    <Reveal as="form" delay={150} onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <Field id="contact-name" label="Name">
                                <input
                                    id="contact-name"
                                    type="text"
                                    name="name"
                                    autoComplete="name"
                                    placeholder="Your name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    maxLength={100}
                                    className={FIELD_CLASS}
                                />
                            </Field>

                            <Field id="contact-email" label="Email">
                                <input
                                    id="contact-email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="your@email.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    maxLength={255}
                                    className={FIELD_CLASS}
                                />
                            </Field>
                        </div>

                        <Field id="contact-subject" label="Subject">
                            <input
                                id="contact-subject"
                                type="text"
                                name="subject"
                                placeholder="What's this about?"
                                value={form.subject}
                                onChange={handleChange}
                                required
                                maxLength={150}
                                className={FIELD_CLASS}
                            />
                        </Field>

                        <Field id="contact-message" label="Message">
                            <textarea
                                id="contact-message"
                                name="message"
                                rows={6}
                                placeholder="Your message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                maxLength={5000}
                                className={`${FIELD_CLASS} resize-none`}
                            />
                        </Field>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full sm:w-auto inline-flex items-center justify-center gap-2
                                min-h-12 px-6 rounded-xl
                                bg-white text-ink font-medium
                                hover:bg-zinc-200 active:bg-zinc-300
                                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400
                                disabled:opacity-60
                                transition-colors duration-200
                            "
                        >
                            {loading ? (
                                <>
                                    <span aria-hidden="true" className="w-5 h-5 rounded-full border-2 border-zinc-400 border-t-ink animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Send Message
                                    <Send aria-hidden="true" className="size-4" />
                                </>
                            )}
                        </button>
                    </Reveal>

                </div>

                {/* Footer */}
                <div className="mt-20 pt-6 border-t border-zinc-800">
                    <p className="text-sm text-zinc-400">
                        © {new Date().getFullYear()} {profile.full_name || "Ali Imran Rodja"}
                    </p>
                </div>
            </Container>
        </section>
    );
}

export default Contact;
