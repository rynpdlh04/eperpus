import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // simpan token
            localStorage.setItem(
                "token",
                data.token
            );

            // simpan data user
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // pindah ke halaman utama
            navigate("/");


        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-sky-50 px-6 py-10">
            <div className='w-full max-w-md'>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className='text-center'>
                        <h1 className="font-bold text-2xl">
                            Login
                        </h1>
                        <p className="pt-2 text-sm text-gray-500">
                            Masuk ke akun HOKLibrary
                        </p>
                    </div>

                    <form action=""
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-4"
                    >
                        {/* email */}
                        <div>
                            <label htmlFor=""
                                className="mb-2 block text-sm font-medium"
                            >Email</label>

                            <input type="text"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="Masukkan email"
                                className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-black"
                                required
                            />
                        </div>

                        {/* password */}
                        <div>
                            <label htmlFor=""
                                className="mb-2 block text-sm font-medium"
                            >
                                Password
                            </label>

                            <input type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Masukkan password"
                                className="w-full mb-6 rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-black"
                            />

                            {/* error */}
                            {error && (
                                <div className="rounded-xl mb-4 bg-red-50 p-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-sky-500 text-white font-medium text-center w-full px-6 py-3 transition hover:bg-sky-400 disabled:opacity-50">
                                {loading ? "Memproses..." : "Login"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-4 text-center p-3 text-gray-500">
                        Belum punya akun? {" "}
                        <Link
                            to={"/register"}
                            className="text-black hover:underline"
                        >
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>

        </div>
    )
}