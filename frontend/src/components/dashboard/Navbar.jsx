import { FaBell } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Navbar() {

    const { user } = useAuth();

    return (

        <header className="h-20 bg-white border-b px-10 flex items-center justify-between">

            <div>

                <h1 className="text-3xl font-bold">

                    Dashboard Overview

                </h1>

                <p className="text-slate-500">

                    Welcome back, {user?.username}

                </p>

            </div>

            <div className="flex items-center gap-6">

                <button className="text-xl">

                    <FaBell />

                </button>

                <div
                    className="
            w-12
            h-12
            rounded-full
            bg-blue-600
            flex
            items-center
            justify-center
            text-white
            font-bold
          "
                >

                    {user?.username?.charAt(0).toUpperCase()}

                </div>

            </div>

        </header>

    );

}

export default Navbar;