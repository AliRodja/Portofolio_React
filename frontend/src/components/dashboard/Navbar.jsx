import { useEffect, useRef, useState } from "react";
import { FaBars, FaExternalLinkAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar({ onMenuClick }) {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
        navigate("/login");
    };

    return (

        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">

            <div className="flex items-center gap-4 min-w-0">

                <button
                    onClick={onMenuClick}
                    className="text-xl text-slate-600 hover:text-slate-900 lg:hidden shrink-0"
                >
                    <FaBars />
                </button>

                <div className="min-w-0">
                    <p className="text-sm text-slate-500 truncate">
                        Welcome back, <span className="font-semibold text-slate-800">{user?.username}</span> 👋
                    </p>
                </div>

            </div>

            <div className="flex items-center gap-3 shrink-0">

                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                    View Site
                    <FaExternalLinkAlt className="text-xs" />
                </a>

                <div className="relative" ref={menuRef}>

                    <button
                        onClick={() => setMenuOpen((open) => !open)}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold hover:shadow-lg hover:shadow-blue-500/20 transition"
                    >
                        {user?.username?.charAt(0).toUpperCase() || "?"}
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
