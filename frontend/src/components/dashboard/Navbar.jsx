import { useEffect, useRef, useState } from "react";
import {
    FaBars,
    FaExternalLinkAlt,
    FaUser,
    FaSignOutAlt,
    FaChevronDown,
    FaChevronRight,
} from "react-icons/fa";
import { HiOutlineHandRaised } from "react-icons/hi2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const pageLabels = {
    "/dashboard": "Dashboard",
    "/dashboard/projects": "Projects",
    "/dashboard/skills": "Skills",
    "/dashboard/experience": "Experience",
    "/dashboard/education": "Education",
    "/dashboard/certificates": "Certificates",
    "/dashboard/messages": "Messages",
    "/dashboard/profile": "Profile",
};

function Navbar({ onMenuClick }) {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef(null);

    const pageLabel = pageLabels[location.pathname] || "Dashboard";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 4);

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
        navigate("/login");
    };

    return (

        <header
            className={`
                h-16 sm:h-20 bg-white/80 backdrop-blur-md px-4 sm:px-8
                flex items-center justify-between gap-4
                sticky top-0 z-20 transition-shadow duration-200
                ${scrolled ? "shadow-sm border-b border-slate-200" : "border-b border-transparent"}
            `}
        >

            <div className="flex items-center gap-3 sm:gap-4 min-w-0">

                <button
                    onClick={onMenuClick}
                    className="text-xl text-slate-600 hover:text-slate-900 lg:hidden shrink-0"
                >
                    <FaBars />
                </button>

                <div className="min-w-0">

                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-0.5">
                        <span>Dashboard</span>
                        {pageLabel !== "Dashboard" && (
                            <>
                                <FaChevronRight className="text-[8px]" />
                                <span className="text-slate-500">{pageLabel}</span>
                            </>
                        )}
                    </div>

                    <p className="text-sm sm:text-base font-semibold text-slate-800 truncate">
                        Welcome back, {user?.username} <HiOutlineHandRaised className="inline-block text-blue-500" />
                    </p>

                </div>

            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">

                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                    View Site
                    <FaExternalLinkAlt className="text-xs" />
                </a>

                <div className="w-px h-8 bg-slate-200 hidden sm:block" />

                <div className="relative" ref={menuRef}>

                    <button
                        onClick={() => setMenuOpen((open) => !open)}
                        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition"
                    >
                        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {user?.username?.charAt(0).toUpperCase() || "?"}
                        </span>

                        <span className="hidden md:inline text-sm font-medium text-slate-700 max-w-[100px] truncate">
                            {user?.username}
                        </span>

                        <FaChevronDown className={`hidden md:inline text-xs text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-2 overflow-hidden">

                            <div className="px-4 py-2 border-b border-slate-100">
                                <p className="text-sm font-semibold text-slate-800 truncate">{user?.username}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>

                            <Link
                                to="/dashboard/profile"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            >
                                <FaUser className="text-xs" />
                                Profile
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <FaSignOutAlt className="text-xs" />
                                Logout
                            </button>

                        </div>
                    )}

                </div>

            </div>

        </header>

    );

}

export default Navbar;
