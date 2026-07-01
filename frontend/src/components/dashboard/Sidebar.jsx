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
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const menus = [
    {
        icon: FaHome,
        label: "Dashboard",
        path: "/dashboard",
    },
    {
        icon: FaFolderOpen,
        label: "Projects",
        path: "/dashboard/projects",
    },
    {
        icon: FaCode,
        label: "Skills",
        path: "/dashboard/skills",
    },
    {
        icon: FaBriefcase,
        label: "Experience",
        path: "/dashboard/experience",
    },
    {
        icon: FaGraduationCap,
        label: "Education",
        path: "/dashboard/education",
    },
    {
        icon: FaCertificate,
        label: "Certificates",
        path: "/dashboard/certificates",
    },
    {
        icon: FaEnvelope,
        label: "Messages",
        path: "/dashboard/messages",
    },
    {
        icon: FaUser,
        label: "Profile",
        path: "/dashboard/profile",
    },
];

function Sidebar() {
    return (
        <aside className="w-72 bg-slate-900 text-white flex flex-col">

            <div className="p-8 border-b border-slate-800">

                <h1 className="text-3xl font-bold">
                    Aurora CMS
                </h1>

                <p className="text-slate-400 text-sm mt-2">
                    Portfolio Management
                </p>

            </div>

            <nav className="flex-1 px-4 py-6">

                {menus.map((menu) => {

                    const Icon = menu.icon;

                    return (

                        <NavLink
                            key={menu.label}
                            to={menu.path}
                            end={menu.path === "/dashboard"}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-5 py-4 rounded-xl mb-2 transition
                ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-300 hover:bg-slate-800"
                                }`
                            }
                        >

                            <Icon />

                            {menu.label}

                        </NavLink>

                    );

                })}

            </nav>

            <div className="border-t border-slate-800 p-4">

                <button
                    className="
            flex
            items-center
            gap-4
            w-full
            px-5
            py-4
            rounded-xl
            hover:bg-red-600
            transition
          "
                >

                    <FaSignOutAlt />

                    Logout

                </button>

            </div>

        </aside>
    );
}

export default Sidebar;