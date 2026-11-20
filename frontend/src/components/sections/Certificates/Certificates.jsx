import { useMemo, useState } from "react";
import { ChevronDown, TriangleAlert } from "lucide-react";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";
import CertificateCard from "./CertificateCard";

const INITIAL_VISIBLE = 6;
const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";

function CertificatesShell({ children }) {
    return (
        <section id="certificates" className="bg-white py-16 md:py-24 lg:py-28">
            <Container>
                <SectionHeading
                    className="mb-8 md:mb-10"
                    before="Continuous"
                    highlight="learning"
                    intro="Professional certifications and courses I've completed, most recent first."
                />
                {children}
            </Container>
        </section>
    );
}

// Data comes from Home (useCertificates there), because the navbar also needs
// to know whether this section exists. Nothing renders while loading or when
// there are no certificates yet: an empty "coming soon" section only filled a
// template (audit #24), and the navbar hides its link in the same cases.
function Certificates({ certificates, loading, error }) {
    const [selectedIssuer, setSelectedIssuer] = useState("All");
    const [showAll, setShowAll] = useState(false);

    const issuers = useMemo(() => {
        const counts = new Map();
        for (const cert of certificates) {
            const name = (cert.issuer || "").trim();
            if (!name) continue;
            counts.set(name, (counts.get(name) || 0) + 1);
        }
        return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
    }, [certificates]);

    const filtered = useMemo(() => {
        if (selectedIssuer === "All") return certificates;
        return certificates.filter((cert) => (cert.issuer || "").trim() === selectedIssuer);
    }, [certificates, selectedIssuer]);

    if (loading) return null;

    if (error) {
        return (
            <CertificatesShell>
                <p className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    <TriangleAlert aria-hidden="true" className="size-4 shrink-0" />
                    {error}
                </p>
            </CertificatesShell>
        );
    }

    if (certificates.length === 0) return null;

    const canCollapse = selectedIssuer === "All" && filtered.length > INITIAL_VISIBLE;
    const visible = canCollapse && !showAll ? filtered.slice(0, INITIAL_VISIBLE) : filtered;

    return (
        <CertificatesShell>
            {issuers.length > 1 && (
                <div className="flex flex-wrap items-center gap-2 mb-8" role="group" aria-label="Filter certificates by issuer">
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedIssuer("All");
                            setShowAll(false);
                        }}
                        aria-pressed={selectedIssuer === "All"}
                        className={`
                            min-h-11 px-4 rounded-xl text-sm font-medium transition-colors duration-200 ${FOCUS_RING}
                            ${selectedIssuer === "All"
                                ? "bg-ink text-white"
                                : "border border-zinc-300 bg-white text-zinc-700 hover:border-ink hover:text-ink"
                            }
                        `}
                    >
                        All ({certificates.length})
                    </button>

                    {issuers.map(({ name, count }) => {
                        const active = selectedIssuer === name;
                        return (
                            <button
                                key={name}
                                type="button"
                                onClick={() => {
                                    setSelectedIssuer(name);
                                    setShowAll(true);
                                }}
                                aria-pressed={active}
                                className={`
                                    min-h-11 px-4 rounded-xl text-sm font-medium transition-colors duration-200 ${FOCUS_RING}
                                    ${active
                                        ? "bg-ink text-white"
                                        : "border border-zinc-300 bg-white text-zinc-700 hover:border-ink hover:text-ink"
                                    }
                                `}
                            >
                                {name} ({count})
                            </button>
                        );
                    })}
                </div>
            )}

            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {visible.map((certificate) => (
                    <CertificateCard key={certificate.id} certificate={certificate} />
                ))}
            </ul>

            {canCollapse && (
                <div className="mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setShowAll((prev) => !prev)}
                        aria-expanded={showAll}
                        className={`
                            inline-flex items-center gap-2
                            min-h-11 px-5 rounded-xl
                            border border-zinc-300 bg-white
                            text-sm font-medium text-ink
                            hover:border-ink hover:bg-zinc-100 active:bg-zinc-200
                            transition-colors duration-200 ${FOCUS_RING}
                        `}
                    >
                        <span>{showAll ? "Show fewer certificates" : `Show all ${filtered.length} certificates`}</span>
                        <ChevronDown
                            aria-hidden="true"
                            className={`size-4 transition-transform duration-200 ${showAll ? "rotate-180" : ""}`}
                        />
                    </button>
                </div>
            )}
        </CertificatesShell>
    );
}

export default Certificates;
