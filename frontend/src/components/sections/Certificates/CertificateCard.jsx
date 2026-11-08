import { useState } from "react";
import { ExternalLink, FileText } from "lucide-react";
import { isPdfUrl } from "../../../utils/file";
import Reveal from "../../ui/Reveal";

function CertificateCard({ certificate }) {
    const [imageError, setImageError] = useState(false);
    const isPdf = isPdfUrl(certificate.image_url);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
        });
    };

    return (
        <Reveal as="li" className="flex flex-col rounded-xl overflow-hidden bg-white border border-zinc-200 hover:border-zinc-400">

            {/* Certificate image or PDF link */}
            <div className="h-48 bg-zinc-100 border-b border-zinc-200">
                {isPdf ? (
                    <a
                        href={certificate.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-700 hover:text-ink hover:bg-zinc-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-700 transition-colors"
                    >
                        <FileText className="size-9 text-red-700" aria-hidden="true" />
                        <span className="text-sm font-medium">View PDF: {certificate.title}</span>
                    </a>
                ) : certificate.image_url && !imageError ? (
                    <img
                        src={certificate.image_url}
                        alt={certificate.title}
                        width={640}
                        height={384}
                        loading="lazy"
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <p className="w-full h-full flex items-center justify-center text-sm text-zinc-600">
                        No preview image
                    </p>
                )}
            </div>

            <div className="flex flex-col flex-1 p-6">
                <h3 className="font-display text-lg font-bold leading-snug text-ink">
                    {certificate.title}
                </h3>

                {certificate.issuer && (
                    <p className="mt-1 font-medium text-zinc-700">{certificate.issuer}</p>
                )}

                {certificate.issue_date && (
                    <p className="mt-2 text-sm text-zinc-600">
                        Issued {formatDate(certificate.issue_date)}
                    </p>
                )}

                {certificate.credential_url && (
                    <a
                        href={certificate.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            self-start inline-flex items-center gap-2
                            mt-5 min-h-11 px-4 rounded-lg
                            border border-ink text-sm font-medium text-ink
                            hover:bg-zinc-100 active:bg-zinc-200
                            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700
                            transition-colors duration-200
                        "
                    >
                        View credential
                        <ExternalLink aria-hidden="true" className="size-4" />
                    </a>
                )}
            </div>
        </Reveal>
    );
}

export default CertificateCard;
