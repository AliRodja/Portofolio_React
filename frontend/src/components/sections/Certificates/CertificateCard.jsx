import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";

function CertificateCard({ certificate }) {

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div
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
            <div className="relative overflow-hidden">
                <img
                    src={certificate.image_url}
                    alt={certificate.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Dark overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
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