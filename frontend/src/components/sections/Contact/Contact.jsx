import { useEffect, useState } from "react";
import api from "../../../services/api";
import Container from "../../ui/Container";

import {
    HiOutlineEnvelope,
    HiOutlinePhone,
    HiOutlineMapPin,
    HiOutlinePaperAirplane,
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
} from "react-icons/hi2";

import {
    FaGithub,
    FaLinkedin,
    FaInstagram,
} from "react-icons/fa";

function Contact({ profile = {} }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        if (!feedback) return;

        const timer = setTimeout(() => setFeedback(null), 4000);

        return () => clearTimeout(timer);
    }, [feedback]);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await api.post("/messages", form);

            setForm({
                name: "",
                email: "",
                subject: "",
                message: "",
            });

            setFeedback({ type: "success", message: "Message sent successfully!" });

        } catch (err) {
            console.error(err);
            setFeedback({ type: "error", message: "Failed to send message. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        profile.email && {
            icon: <HiOutlineEnvelope />,
            label: "Email",
            value: profile.email,
            href: `mailto:${profile.email}`,
            color: "text-blue-400",
            bgColor: "from-blue-500/10 to-blue-500/5",
            borderColor: "border-blue-500/10",
        },
        profile.phone && {
            icon: <HiOutlinePhone />,
            label: "Phone",
            value: profile.phone,
            href: `tel:${profile.phone.replace(/\s+/g, "")}`,
            color: "text-emerald-400",
            bgColor: "from-emerald-500/10 to-emerald-500/5",
            borderColor: "border-emerald-500/10",
        },
        profile.location && {
            icon: <HiOutlineMapPin />,
            label: "Location",
            value: profile.location,
            href: null,
            color: "text-amber-400",
            bgColor: "from-amber-500/10 to-amber-500/5",
            borderColor: "border-amber-500/10",
        },
    ].filter(Boolean);

    const socials = [
        profile.github_url && {
            icon: <FaGithub />,
            label: "GitHub",
            href: profile.github_url,
            hoverColor: "hover:text-white hover:bg-white/10 hover:border-white/20",
        },
        profile.linkedin_url && {
            icon: <FaLinkedin />,
            label: "LinkedIn",
            href: profile.linkedin_url,
            hoverColor: "hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30",
        },
        profile.instagram_url && {
            icon: <FaInstagram />,
            label: "Instagram",
            href: profile.instagram_url,
            hoverColor: "hover:text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/30",
        },
    ].filter(Boolean);

    return (
        <section
            id="contact"
            className="relative pt-32 pb-10 bg-slate-900 overflow-hidden"
        >

            {/* ── Toast notification ── */}
            {feedback && (
                <div
                    className={`
                        fixed top-24 right-6 z-50
                        flex items-center gap-3
                        px-5 py-4 rounded-2xl
                        backdrop-blur-md border shadow-2xl
                        animate-toast-in
                        ${feedback.type === "success"
                            ? "bg-emerald-500/95 border-emerald-400/30 text-white"
                            : "bg-red-500/95 border-red-400/30 text-white"
                        }
                    `}
                >
                    {feedback.type === "success" ? (
                        <HiOutlineCheckCircle className="text-xl shrink-0" />
                    ) : (
                        <HiOutlineExclamationTriangle className="text-xl shrink-0" />
                    )}
                    <span className="text-sm font-medium">{feedback.message}</span>
                </div>
            )}

            {/* ── Background decorations ── */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 -left-32 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[140px]" />
                <div className="absolute bottom-20 -right-32 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-indigo-500/3 blur-[180px]" />
            </div>

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <Container className="relative z-10">

                {/* ── Section Header ── */}
                <div data-aos="fade-up" className="text-center mb-20">

                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-sm text-blue-300 font-medium tracking-wider uppercase">
                            Get In Touch
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Let's Build Something
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            {" "}Together
                        </span>
                    </h2>

                    <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                        I'm open to freelance work, collaborations, internships, and full-time opportunities.
                    </p>

                </div>

                <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">

                    {/* ── LEFT — Info ── */}
                    <div data-aos="fade-right" className="lg:col-span-2 space-y-6">

                        {/* Contact info cards */}
                        {contactInfo.map((info, i) => {
                            const cardClassName = `
                                group
                                flex items-center gap-5
                                rounded-2xl p-5
                                bg-white/[0.03] border border-white/[0.06]
                                backdrop-blur-sm
                                hover:bg-white/[0.06] hover:border-white/10
                                transition-all duration-300
                            `;

                            const cardContent = (
                                <>
                                    <div
                                        className={`
                                            w-12 h-12 shrink-0
                                            rounded-2xl
                                            bg-gradient-to-br ${info.bgColor}
                                            border ${info.borderColor}
                                            flex items-center justify-center
                                            text-xl ${info.color}
                                            transition-all duration-300
                                        `}
                                    >
                                        {info.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm text-slate-500 font-medium">
                                            {info.label}
                                        </p>
                                        <p className="text-white font-semibold mt-0.5 break-words">
                                            {info.value}
                                        </p>
                                    </div>
                                </>
                            );

                            return info.href ? (
                                <a
                                    key={info.label}
                                    href={info.href}
                                    data-aos="fade-up"
                                    data-aos-delay={i * 100}
                                    className={cardClassName}
                                >
                                    {cardContent}
                                </a>
                            ) : (
                                <div
                                    key={info.label}
                                    data-aos="fade-up"
                                    data-aos-delay={i * 100}
                                    className={cardClassName}
                                >
                                    {cardContent}
                                </div>
                            );
                        })}

                        {/* Social links */}
                        {socials.length > 0 && (
                            <div data-aos="fade-up" className="pt-4">
                                <p className="text-sm text-slate-500 font-medium mb-4 tracking-wider uppercase">
                                    Find me on
                                </p>
                                <div className="flex gap-3">
                                    {socials.map((social) => (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                            className={`
                                                w-12 h-12 rounded-xl
                                                bg-white/5 border border-white/10
                                                flex items-center justify-center
                                                text-xl text-slate-400
                                                hover:-translate-y-1
                                                transition-all duration-300
                                                ${social.hoverColor}
                                            `}
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* ── RIGHT — Form ── */}
                    <div data-aos="fade-left" className="lg:col-span-3">

                        <div
                            className="
                                rounded-2xl p-8 md:p-10
                                bg-white/[0.03] border border-white/[0.06]
                                backdrop-blur-sm
                                relative overflow-hidden
                            "
                        >

                            {/* Top accent line */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/50 via-cyan-500/30 to-transparent" />

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm text-slate-400 font-medium mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Your Name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            className="
                                                w-full rounded-xl p-4
                                                bg-white/[0.05] border border-white/10
                                                text-white placeholder-slate-600
                                                outline-none
                                                focus:border-blue-500/50 focus:bg-white/[0.08]
                                                transition-all duration-300
                                            "
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-slate-400 font-medium mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="your@email.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            className="
                                                w-full rounded-xl p-4
                                                bg-white/[0.05] border border-white/10
                                                text-white placeholder-slate-600
                                                outline-none
                                                focus:border-blue-500/50 focus:bg-white/[0.08]
                                                transition-all duration-300
                                            "
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 font-medium mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        placeholder="What's this about?"
                                        value={form.subject}
                                        onChange={handleChange}
                                        required
                                        className="
                                            w-full rounded-xl p-4
                                            bg-white/[0.05] border border-white/10
                                            text-white placeholder-slate-600
                                            outline-none
                                            focus:border-blue-500/50 focus:bg-white/[0.08]
                                            transition-all duration-300
                                        "
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 font-medium mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        rows="5"
                                        name="message"
                                        placeholder="Your message..."
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        className="
                                            w-full rounded-xl p-4
                                            bg-white/[0.05] border border-white/10
                                            text-white placeholder-slate-600
                                            outline-none resize-none
                                            focus:border-blue-500/50 focus:bg-white/[0.08]
                                            transition-all duration-300
                                        "
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                                        w-full
                                        inline-flex items-center justify-center gap-3
                                        px-8 py-4
                                        rounded-xl
                                        bg-gradient-to-r from-blue-500 to-cyan-500
                                        text-white font-semibold
                                        shadow-lg shadow-blue-500/20
                                        hover:shadow-blue-400/30
                                        hover:from-blue-400 hover:to-cyan-400
                                        hover:-translate-y-0.5
                                        transition-all duration-300
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                                    "
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <HiOutlinePaperAirplane className="text-lg" />
                                        </>
                                    )}
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

                {/* ── Footer credits ── */}
                <div className="mt-16 pt-6 border-t border-white/5 text-center">
                    <p className="text-slate-600 text-sm">
                        © {new Date().getFullYear()} {profile.full_name || "Ali Imran Rodja"}. Built with
                        <span className="text-blue-400"> React</span> &
                        <span className="text-cyan-400"> Node.js</span>
                    </p>
                </div>

            </Container>

        </section>
    );
}

export default Contact;