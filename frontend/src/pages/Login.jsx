import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineHandRaised } from "react-icons/hi2";

import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

function Login() {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const user = await authService.login(
                form.email,
                form.password
            );

            login(user);

            navigate("/dashboard");

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Login failed."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex">

            {/* LEFT */}

            <div className="hidden lg:flex flex-1 bg-slate-900 items-center justify-center">

                <div className="max-w-md">

                    <h1 className="text-5xl font-bold text-white">

                        Aurora CMS

                    </h1>

                    <p className="text-slate-400 mt-6 leading-8">

                        Welcome to Portfolio Management System.

                        Manage your portfolio with one dashboard.

                    </p>

                </div>

            </div>

            {/* RIGHT */}

            <div className="flex-1 flex items-center justify-center">

                <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">

                    <h2 className="text-3xl font-bold inline-flex items-center gap-2">

                        Welcome Back <HiOutlineHandRaised className="text-blue-500" />

                    </h2>

                    <p className="text-slate-500 mt-2">

                        Login to continue.

                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-10 space-y-6"
                    >

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="
                w-full
                border
                rounded-xl
                p-4
                outline-none
                focus:border-blue-600
              "
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="
                w-full
                border
                rounded-xl
                p-4
                outline-none
                focus:border-blue-600
              "
                        />

                        {error && (

                            <p className="text-red-500">

                                {error}

                            </p>

                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                w-full
                bg-blue-600
                hover:bg-blue-700
                text-white
                py-4
                rounded-xl
                font-semibold
                transition
              "
                        >

                            {

                                loading

                                    ?

                                    "Signing In..."

                                    :

                                    "Sign In"

                            }

                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Login;