import { useState } from "react";
import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import { FaCertificate, FaFilePdf } from "react-icons/fa";
import { isPdfUrl } from "../../../utils/file";

function CertificateCard({ certificate, index = 0 }) {
    const [imageError, setImageError] = useState(false);
    const isPdf = isPdfUrl(certificate.image_url);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div
            data-aos="fade-up"
            data-aos-delay={(index % 3) * 100}
            className="
                group relative
                rounded-2xl overflow-hidden
                bg-white/[0.03] border border-white/[0.06]
                backdrop-blur-sm
                hover:bg-white/[0.06] hover:border-white/10
                hover:-translate-y-2
                transition-all duration-300
            "
        >

            {/* Certificate image */}
            <div className="relative overflow-hidden h-48">
                {isPdf ? (
                    <a
                        href={certificate.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full bg-gradient-to-br from-red-500/15 via-slate-800 to-slate-900 flex flex-col items-center justify-center gap-2 group/pdf"
                    >
                        <FaFilePdf className="text-5xl text-red-400/70 group-hover/pdf:text-red-400 transition-colors" />
                        <span className="text-xs font-medium text-slate-400 group-hover/pdf:text-slate-300 transition-colors">View PDF</span>
                    </a>
                ) : certificate.image_url && !imageError ? (
                    <img
                        src={certificate.image_url}
                        alt={certificate.title}
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-cyan-500/20 flex items-center justify-center">
                        <FaCertificate className="text-4xl text-blue-300/40" />
                    </div>
                )}
                {/* Dark overlay gradient */}
                {!isPdf && <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />}
            </div>

            {/* Content */}
            <div className="p-6">

                {/* Title */}
                <h3 className="text-lg font-bold text-white leading-snug group-hover:text-blue-300 transition-colors duration-300">
                    {certificate.title}
                </h3>

                {/* Issuer */}
                <p className="mt-2 text-slate-400 font-medium">
                    {certificate.issuer}
                </p>

                {/* Date */}
                <p className="mt-3 text-sm text-blue-400 font-medium">
                    Issued {formatDate(certificate.issue_date)}
                </p>

                {/* View credential button */}
                {certificate.credential_url && (
                    <a
                        href={certificate.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            inline-flex items-center gap-2
                            mt-5 px-5 py-3
                            rounded-xl
                            bg-gradient-to-r from-blue-500 to-cyan-500
                            text-white text-sm font-semibold
                            shadow-lg shadow-blue-500/20
                            hover:shadow-blue-400/30
                            hover:from-blue-400 hover:to-cyan-400
                            hover:-translate-y-0.5
                            transition-all duration-300
                        "
                    >
                        View Credential
                        <HiOutlineArrowTopRightOnSquare className="text-base" />
                    </a>
                )}

            </div>

            {/* Bottom accent line on hover */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-16 h-[2px] bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-300" />

        </div>
    );
}

export default CertificateCard;