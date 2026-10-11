import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPage, setShowPage] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const timer = setTimeout(() => setShowPage(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                `${API_URL}/api/auth/register`,
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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setSuccess("Registrasi berhasil, silakan login.");
            setNama("");
            setEmail("");
            setPassword("");

            setTimeout(() => navigate("/login"), 1500);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const itemClass = () =>
        `transition-all duration-700 ease-out ${showPage ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`;

    return (
        <div className="page-enter relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eef7ff] px-4 py-6 font-sans sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute -right-20 -top-28 h-[260px] w-[260px] rounded-full border border-[#5b8fbd]/10" />
            <div className="pointer-events-none absolute -bottom-20 left-[5%] h-[180px] w-[180px] rounded-full bg-[#5b8fbd]/5" />

            <div className="relative z-10 w-full max-w-[1080px]">
                <div
                    className={`grid min-h-[650px] overflow-hidden rounded-[34px] border border-[#d5e3f1] bg-white shadow-[0_40px_90px_rgba(54,105,145,.15),0_10px_35px_rgba(54,105,145,.07)] transition-all duration-700 ease-out ${
                        showPage
                            ? "translate-y-0 scale-100 opacity-100"
                            : "translate-y-6 scale-[.98] opacity-0"
                    } lg:grid-cols-2`}
                >
                    <div className="relative hidden min-h-[650px] overflow-hidden bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,.95),transparent_40%),radial-gradient(circle_at_15%_85%,rgba(91,143,189,.12),transparent_30%),linear-gradient(145deg,#f0f8ff,#deeffb)] lg:flex lg:flex-col lg:items-center lg:justify-center">
                        <div className="absolute -left-[100px] -top-[110px] h-[260px] w-[260px] rounded-full bg-[#5b8fbd]/[0.08] transition-transform duration-[8000ms] ease-in-out hover:translate-x-5 hover:translate-y-4" />
                        <div className="absolute -bottom-20 right-[30px] h-[180px] w-[180px] rounded-full bg-[#5b8fbd]/[0.07] transition-transform duration-[8000ms] ease-in-out hover:-translate-x-4 hover:-translate-y-4" />
                        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#5b8fbd]/[0.09]" />
                        <div className="absolute -right-[90px] top-[-10%] z-[3] h-[120%] w-[180px] rounded-[50%] bg-white" />

                        <div
                            className={`relative z-[4] w-[82%] max-w-[500px] transition-all duration-1000 ease-out ${
                                showPage
                                    ? "translate-x-0 scale-100 opacity-100"
                                    : "-translate-x-8 scale-95 opacity-0"
                            }`}
                        >
                            <img src="/login-library-left.png" alt="Library" className="block h-auto w-full mix-blend-multiply saturate-[.88] transition-all duration-500 hover:scale-[1.02] hover:rotate-[-1deg] hover:saturate-100"/>
                        </div>

                        <div className={`absolute bottom-[38px] left-[48px] z-[5] text-[9px] font-bold tracking-[2px] text-[#87645b] transition-all duration-700 ${showPage ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                           HOKLIBRARY <span className="mx-2 text-[#8db5d8]">•</span> READ <span className="mx-2 text-[#8db5d8]">•</span> DISCOVER <span className="mx-2 text-[#8db5d8]">•</span> GROW
                        </div>
                    </div>

                    <div className="relative z-[4] min-h-[650px] overflow-hidden bg-white">
                        <div className="absolute -right-[100px] -top-[100px] h-[230px] w-[230px] rounded-full bg-[#8db5d8]/[0.12]" />
                        <div className="absolute -bottom-[70px] -left-[70px] h-[140px] w-[140px] rounded-full border border-[#5b8fbd]/10" />

                        <div className="relative z-10 flex min-h-[650px] flex-col justify-center px-8 py-10 sm:px-12 lg:px-14">
                            <div className={`${itemClass(0)} mb-8`} style={{ transitionDelay: "100ms" }}>
                                <div className="inline-flex w-fit items-center gap-2.5 rounded-[40px] border border-[#d9e6f1] bg-[#f8fcff] py-1.5 pl-1.5 pr-3.5 text-[15px] font-bold text-[#29465f] shadow-[0_8px_20px_rgba(54,105,145,.06)] transition-all duration-300 hover:-translate-y-0.5">
                                    <span className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-gradient-to-br from-[#5b8fbd] to-[#7eacd2] font-serif text-lg text-white shadow-[0_5px_12px_rgba(91,143,189,.22)] transition-all duration-300 hover:scale-110 hover:rotate-[-10deg]">
                                        H
                                    </span>
                                    HOKLibrary
                                </div>
                            </div>

                            <div className={`${itemClass(0)} mb-3 flex items-center gap-2.5 text-[10px] font-bold tracking-[2.5px] text-[#7194b2]`} style={{ transitionDelay: "200ms" }}>
                                <span className="h-px w-8 bg-[#8db5d8]" />
                                MULAI PERJALANANMU
                            </div>

                            <div className={itemClass(0)} style={{ transitionDelay: "300ms" }}>
                                <h1 className="font-serif text-4xl font-semibold tracking-[-.5px] text-[#29465f]">
                                    Buat akun baru
                                </h1>
                            </div>

                            <div className={itemClass(0)} style={{ transitionDelay: "400ms" }}>
                                <p className="mt-5 text-sm text-[#7892ad]">
                                    Daftar untuk mulai menggunakan HOKLibrary.
                                </p>
                            </div>

                            {error && (
                                <div className="mt-6 rounded-xl border border-[#f0d3ce] bg-[#fff5f3] px-4 py-3 text-sm text-[#a04e43]">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mt-6 rounded-xl border border-[#d6e7d7] bg-[#f2faf3] px-4 py-3 text-sm text-[#4f7d55]">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="mt-8">
                                <div className={`${itemClass(0)} mb-5`} style={{ transitionDelay: "500ms" }}>
                                        <label htmlFor="nama" className="mb-2 block text-sm font-medium text-[#29465f]" >
                                        Nama
                                    </label>

                                    <input
                                        id="nama"
                                        type="text"
                                        value={nama}
                                        onChange={(event) => setNama(event.target.value)}
                                        placeholder="Masukkan nama"
                                        className="h-[58px] w-full rounded-[14px] border border-[#d7e4f0] bg-[#fbfdff] px-5 text-sm text-[#29465f] outline-none transition-all duration-300 placeholder:text-[#9aabb9] hover:-translate-y-0.5 hover:border-[#b9cee1] hover:bg-white focus:-translate-y-1 focus:border-[#8db5d8] focus:bg-white focus:shadow-[0_8px_25px_rgba(54,102,141,.08),0_0_0_4px_rgba(141,181,216,.12)]"
                                        required
                                    />
                                </div>

                                <div className={`${itemClass(0)} mb-5`} style={{ transitionDelay: "600ms" }}>
                                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#29465f]" >
                                        Email
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="Masukkan email"
                                        className="h-[58px] w-full rounded-[14px] border border-[#d7e4f0] bg-[#fbfdff] px-5 text-sm text-[#29465f] outline-none transition-all duration-300 placeholder:text-[#9aabb9] hover:-translate-y-0.5 hover:border-[#b9cee1] hover:bg-white focus:-translate-y-1 focus:border-[#8db5d8] focus:bg-white focus:shadow-[0_8px_25px_rgba(54,102,141,.08),0_0_0_4px_rgba(141,181,216,.12)]"
                                        required
                                    />
                                </div>

                                <div className={`${itemClass(0)} mb-6`} style={{ transitionDelay: "700ms" }}>
                                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#29465f]" >
                                        Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            placeholder="Masukkan password"
                                            className="h-[58px] w-full rounded-[14px] border border-[#d7e4f0] bg-[#fbfdff] px-5 pr-14 text-sm text-[#29465f] outline-none transition-all duration-300 placeholder:text-[#9aabb9] hover:-translate-y-0.5 hover:border-[#b9cee1] hover:bg-white focus:-translate-y-1 focus:border-[#8db5d8] focus:bg-white focus:shadow-[0_8px_25px_rgba(54,102,141,.08),0_0_0_4px_rgba(141,181,216,.12)]"
                                            required
                                        />

                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7892ad] transition-all duration-200 hover:scale-110 hover:text-[#315f92]" >
                                            {showPassword ? "◉" : "○"}
                                        </button>
                                    </div>
                                </div>

                                <div className={itemClass(0)} style={{ transitionDelay: "800ms" }}>
                                    <button type="submit" disabled={loading}
                                        className="group flex h-[58px] w-full items-center justify-center gap-4 rounded-[14px] bg-gradient-to-br from-[#5b8fbd] to-[#7eacd2] text-sm font-semibold text-white shadow-[0_14px_28px_rgba(91,143,189,.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(91,143,189,.28)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50" >
                                        <span>{loading ? "Memproses..." : "Daftar"}</span>
                                        <span className="text-xl transition-transform duration-300 group-hover:translate-x-2">
                                        </span>
                                    </button>
                                </div>

                                <div className={`${itemClass(0)} mt-7 flex items-center gap-4 text-[11px] text-[#9aabb9]`} style={{ transitionDelay: "900ms" }}>
                                    <span className="h-px flex-1 bg-[#e9dfd9]" />
                                    <span>atau</span>
                                    <span className="h-px flex-1 bg-[#e9dfd9]" />
                                </div>

                                <div className={itemClass(0)} style={{ transitionDelay: "1000ms" }}>
                                    <p className="mt-6 text-center text-sm text-[#7892ad]">
                                        Sudah punya akun?{" "}
                                        <Link to="/login" className="font-bold text-[#4e82bd] transition-colors duration-200 hover:text-[#315f92]" >
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
