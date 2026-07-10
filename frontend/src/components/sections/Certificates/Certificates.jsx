import Container from "../../ui/Container";
import useCertificates from "../../../hooks/useCertificates";
import CertificateCard from "./CertificateCard";

function Certificates() {

    const {
        certificates,
        loading,
        error,
    } = useCertificates();

    if (loading) {
        return (
            <section className="relative py-32 bg-slate-900 overflow-hidden">
                <Container className="relative z-10">

                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-sm text-amber-300 font-medium tracking-wider uppercase">
                                Loading Certificates
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden animate-pulse"
                            >
                                <div className="h-48 bg-white/[0.05]" />
                                <div className="p-6 space-y-4">
                                    <div className="h-5 w-3/4 bg-white/[0.05] rounded-lg" />
                                    <div className="h-4 w-1/2 bg-white/[0.04] rounded-lg" />
                                    <div className="h-4 w-1/3 bg-white/[0.04] rounded-lg" />
                                    <div className="h-10 w-full bg-white/[0.04] rounded-xl mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>

                </Container>
            </section>
        );
    }

    if (error) {
        return (
            <section className="relative py-32 bg-slate-900 overflow-hidden">
                <Container className="relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                            <span className="text-red-400">⚠️</span>
                            <span className="text-red-300 text-sm font-medium">{error}</span>
                        </div>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section
            id="certificates"
            className="relative py-32 bg-slate-900 overflow-hidden"
        >

            {/* ── Background decorations ── */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 -right-32 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[140px]" />
                <div className="absolute bottom-20 -left-32 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[120px]" />
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
                <div className="text-center mb-20">

                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-sm text-amber-300 font-medium tracking-wider uppercase">
                            Certificates
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Continuous
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            {" "}Learning
                        </span>
                    </h2>

                    <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
                        Professional certifications and courses I've completed.
                    </p>

                </div>

                {/* ── Certificates count badge ── */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm text-slate-400">
                        <span className="font-bold text-white">{certificates.length}</span>
                        <span>certificates earned</span>
                    </div>
                </div>

                {/* ── Certificates Grid ── */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {certificates.map((certificate) => (
                        <CertificateCard
                            key={certificate.id}
                            certificate={certificate}
                        />
                    ))}

                </div>

                {/* ── Empty state ── */}
                {certificates.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-6">🏆</div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                            No Certificates Yet
                        </h3>
                        <p className="text-slate-400 max-w-md mx-auto">
                            Certificates are coming soon. Stay tuned!
                        </p>
                    </div>
                )}

            </Container>

        </section>
    );
}

export default Certificates;