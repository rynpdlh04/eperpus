import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();

    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                "http://localhost:3000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nama,
                        email,
                        password
                    })
                }
            );

            console.log(response);

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                throw new Error(data.message);
            }

            setSuccess("Registrasi berhasil, silakan login.");

            setNama("");
            setEmail("");
            setPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 1500)
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-sky-50 px-6 py-10">
            <div className="w-full max-w-md">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">
                            Buat Akun
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Daftar untuk menggunakan HOKLibrary
                        </p>
                    </div>

                    <form action=""
                        onSubmit={handleSubmit}
                        className='mt-6 space-y-4'
                    >
                        {/* nama */}
                        <div>
                            <label htmlFor="" className="mb-2 block text-sm font-medium">
                                Nama
                            </label>

                            <input type="text"
                                placeholder="Masukkan nama"
                                value={nama}
                                onChange={(event) => 
                                    setNama(event.target.value)
                                }
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                required
                            />
                        </div>

                        {/* email */}
                        <div>
                            <label htmlFor="" className="mb-2 block text-sm font-medium">
                                Email
                            </label>
                                
                            <input type="text"
                                placeholder="Masukkan email"
                                value={email}
                                onChange={(event) => 
                                    setEmail(event.target.value)
                                }
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                required
                            />
                        </div>
                        
                        {/* password */}
                        <div>
                            <label htmlFor="" className="mb-2 block text-sm font-medium">
                                Password
                            </label>
                                
                            <input type="password"
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(event) => 
                                    setPassword(event.target.value)
                                }
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                required
                            />
                        </div>

                        {/* error */}

                        {error && (
                            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* success */}
                        {success && (
                            <div className="rounded-xl bg-green-50 p-3 text-sm text-green-600">
                                {success}
                            </div>
                        )}

                        {/* button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-sky-500 block mx-auto w-sm text-white rounded-xl px-6 py-2 font-medium hover:bg-sky-400" transition disabled:opacity-50
                        >
                            {loading ? "Mendaftarkan..." : "Daftar"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Sudah punya akun? {" "}

                        <Link
                            to={"/login"}
                            className='font-medium text-black hover:underline'
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register;