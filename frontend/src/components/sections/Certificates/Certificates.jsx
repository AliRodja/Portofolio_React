import { TriangleAlert } from "lucide-react";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";
import CertificateCard from "./CertificateCard";

function CertificatesShell({ children }) {
    return (
        <section id="certificates" className="bg-white py-24 md:py-28">
            <Container>
                <SectionHeading
                    className="mb-12"
                    before="Continuous"
                    highlight="learning"
                    intro="Professional certifications and courses I've completed."
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

    return (
        <CertificatesShell>
            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((certificate) => (
                    <CertificateCard key={certificate.id} certificate={certificate} />
                ))}
            </ul>
        </CertificatesShell>
    );
}

export default Certificates;
