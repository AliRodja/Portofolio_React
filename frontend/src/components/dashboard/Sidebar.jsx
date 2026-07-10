import {
    FaHome,
    FaFolderOpen,
    FaCode,
    FaBriefcase,
    FaGraduationCap,
    FaCertificate,
    FaEnvelope,
    FaUser,
    FaSignOutAlt,
    FaTimes,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const sections = [
    {
        label: "Overview",
        items: [
            { icon: FaHome, label: "Dashboard", path: "/dashboard", end: true },
        ],
    },
    {
        label: "Content",
        items: [
            { icon: FaFolderOpen, label: "Projects", path: "/dashboard/projects" },
            { icon: FaCode, label: "Skills", path: "/dashboard/skills" },
            { icon: FaBriefcase, label: "Experience", path: "/dashboard/experience" },
            { icon: FaGraduationCap, label: "Education", path: "/dashboard/education" },
            { icon: FaCertificate, label: "Certificates", path: "/dashboard/certificates" },
        ],
    },
    {
        label: "Inbox",
        items: [
            { icon: FaEnvelope, label: "Messages", path: "/dashboard/messages" },
        ],
    },
    {
        label: "Account",
        items: [
            { icon: FaUser, label: "Profile", path: "/dashboard/profile" },
        ],
    },
];

function Sidebar({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-40 w-72 flex flex-col
                    bg-slate-900 text-white
                    transform transition-transform duration-300 ease-in-out
                    lg:translate-x-0
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >

                <div className="p-6 border-b border-white/10 flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-slate-900">
                            A
                        </div>

                        <div>
                            <h1 className="text-lg font-bold leading-tight">
                                Aurora CMS
                            </h1>

                            <p className="text-slate-400 text-xs">
                                Portfolio Management
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white lg:hidden"
                    >
                        <FaTimes />
                    </button>

                </div>

                <nav className="flex-1 px-4 py-6 overflow-y-auto">

                    {sections.map((section) => (

                        <div key={section.label} className="mb-6">

                            <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                {section.label}
                            </p>

                            {section.items.map((menu) => {

                                const Icon = menu.icon;

                                return (

                                    <NavLink
                                        key={menu.label}
                                        to={menu.path}
                                        end={menu.end}
                                        onClick={onClose}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition
                                            ${isActive
                                                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20"
                                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                                            }`
                                        }
                                    >

                                        <Icon className="shrink-0" />

                                        {menu.label}

                                    </NavLink>

                                );

                            })}

                        </div>

                    ))}

                </nav>

                <div className="border-t border-white/10 p-4">

                    <div className="flex items-center gap-3 px-2 mb-3">

                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-slate-900 font-bold text-sm shrink-0">
                            {user?.username?.charAt(0).toUpperCase() || "?"}
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">
                                {user?.username}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                                {user?.email}
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={handleLogout}
                        className="
                            flex
                            items-center
                            gap-3
                            w-full
                            px-4
                            py-3
                            rounded-xl
                            text-sm
                            font-medium
                            text-slate-300
                            hover:bg-red-500/10
                            hover:text-red-400
                            transition
                        "
                    >

                        <FaSignOutAlt />

                        Logout

                    </button>

                </div>

            </aside>
        </>
    );
}

export default Sidebar;
