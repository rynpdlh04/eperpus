import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import hokLogo from "../assets/logo-hokhs.webp";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [focused, setFocused] = useState("");
    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Email dan password harus diisi.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password
                })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal masuk. Periksa email dan password.");
            }

            if (!data.token || !data.user) {
                throw new Error("Respons login dari server tidak valid.");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate(data.user.role === "admin" ? "/admin" : "/", { replace: true });
        } catch (loginError) {
            console.error("Gagal login:", loginError);
            setError(loginError.message || "Tidak dapat terhubung ke server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eef7ff] px-4 py-6 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#ffffff_0%,transparent_45%)]" />
                <div className="absolute -left-[180px] -top-[150px] h-[520px] w-[520px] rounded-full bg-[#b9dcf7]/45 blur-[100px] animate-[cloudLeft_14s_ease-in-out_infinite]" />
                <div className="absolute -right-[180px] -top-[100px] h-[480px] w-[480px] rounded-full bg-[#cce8fa]/55 blur-[100px] animate-[cloudRight_16s_ease-in-out_infinite]" />
                <div className="absolute -bottom-[200px] left-[25%] h-[500px] w-[500px] rounded-full bg-[#d7ebfa]/60 blur-[110px] animate-[cloudBottom_18s_ease-in-out_infinite]" />
                <div className="absolute left-[8%] top-[10%] h-[280px] w-[280px] rounded-full border border-white/80 animate-[spinSlow_32s_linear_infinite]" />
                <div className="absolute left-[10%] top-[13%] h-[210px] w-[210px] rounded-full border border-[#c7e0f3]/40 animate-[spinSlow_24s_linear_infinite_reverse]" />
                <div className="absolute right-[8%] bottom-[7%] h-[320px] w-[320px] rounded-full border border-white/80 animate-[spinSlow_35s_linear_infinite_reverse]" />
                <div className="absolute right-[11%] bottom-[10%] h-[230px] w-[230px] rounded-full border border-[#c8e0f3]/45 animate-[spinSlow_27s_linear_infinite]" />
                <div className="absolute left-[7%] top-[38%] h-2 w-2 rounded-full bg-white shadow-[0_0_18px_5px_rgba(255,255,255,.8)] animate-[starOne_6s_ease-in-out_infinite]" />
                <div className="absolute left-[22%] top-[17%] h-3 w-3 rounded-full bg-[#9fc9e8]/50 shadow-[0_0_22px_6px_rgba(159,201,232,.35)] animate-[starTwo_7s_1s_ease-in-out_infinite]" />
                <div className="absolute right-[22%] top-[21%] h-2 w-2 rounded-full bg-white shadow-[0_0_20px_5px_rgba(255,255,255,.9)] animate-[starOne_5s_.5s_ease-in-out_infinite_reverse]" />
                <div className="absolute right-[8%] top-[52%] h-3 w-3 rounded-full bg-[#a9cee9]/45 shadow-[0_0_22px_6px_rgba(169,206,233,.3)] animate-[starThree_7s_1.5s_ease-in-out_infinite]" />
                <div className="absolute bottom-[18%] left-[14%] h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_18px_5px_rgba(255,255,255,.9)] animate-[starTwo_6s_ease-in-out_infinite_reverse]" />
                <div className="absolute left-[5%] top-[55%] h-px w-[230px] rotate-[-32deg] bg-gradient-to-r from-transparent via-white/70 to-transparent animate-[lightMove_8s_ease-in-out_infinite]" />
                <div className="absolute right-[3%] top-[38%] h-px w-[260px] rotate-[32deg] bg-gradient-to-r from-transparent via-white/70 to-transparent animate-[lightMove_10s_2s_ease-in-out_infinite_reverse]" />
            </div>

            <div className="relative z-20 w-full max-w-[1080px] animate-[pageIn_1.2s_cubic-bezier(.16,1,.3,1)_both]">
                <div className="grid min-h-[650px] overflow-hidden rounded-[36px] border border-white/90 bg-white/90 shadow-[0_40px_100px_rgba(54,105,145,.15),0_10px_35px_rgba(54,105,145,.07)] backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_50px_120px_rgba(54,105,145,.2)] active:scale-[.998] lg:grid-cols-2">
                    <div className="relative hidden overflow-hidden bg-[linear-gradient(145deg,#f0f8ff_0%,#deeffb_48%,#edf7fd_100%)] lg:flex lg:flex-col lg:items-center lg:justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,.95),transparent_55%)]" />
                        <div className="absolute -left-[150px] -top-[150px] h-[420px] w-[420px] rounded-full border border-white/80 animate-[spinSlow_35s_linear_infinite]" />
                        <div className="absolute -left-[100px] -top-[100px] h-[320px] w-[320px] rounded-full border border-[#b9d8ed]/40 animate-[spinSlow_27s_linear_infinite_reverse]" />
                        <div className="absolute -bottom-[180px] -right-[150px] h-[460px] w-[460px] rounded-full border border-white/80 animate-[spinSlow_38s_linear_infinite_reverse]" />
                        <div className="absolute left-[18%] top-[24%] h-2 w-2 rounded-full bg-white shadow-[0_0_25px_8px_rgba(255,255,255,.8)] animate-[floatOne_6s_ease-in-out_infinite]" />
                        <div className="absolute right-[20%] top-[28%] h-2 w-2 rounded-full bg-[#8eb8d7]/60 shadow-[0_0_18px_5px_rgba(142,184,215,.35)] animate-[floatTwo_7s_ease-in-out_infinite]" />
                        <div className="absolute bottom-[28%] left-[22%] h-2 w-2 rounded-full bg-[#a8cbe4]/60 animate-[floatOne_7s_1s_ease-in-out_infinite_reverse]" />

                        <div className="relative z-10 w-[78%] max-w-[470px] animate-[logoIn_1.5s_cubic-bezier(.16,1,.3,1)_both]">
                            <div className="absolute inset-[15%] rounded-full bg-white/50 blur-[70px] animate-[logoGlow_5s_ease-in-out_infinite]" />
                            <img
                                src={hokLogo}
                                alt="HOKLibrary"
                                className="relative w-full object-contain mix-blend-multiply saturate-[.8] transition-all duration-1000 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.06] hover:-rotate-1 active:scale-[.96]"
                            />
                        </div>

                        <div className="absolute bottom-[38px] left-[48px] text-[9px] font-bold tracking-[2px] text-[#6685a1] animate-[fadeIn_1.5s_.7s_ease_both]">
                            HOKLIBRARY <span className="mx-2 text-[#8db5d8]">•</span> READ <span className="mx-2 text-[#8db5d8]">•</span> DISCOVER <span className="mx-2 text-[#8db5d8]">•</span> GROW
                        </div>
                    </div>

                    <div className="relative overflow-hidden bg-white/95">
                        <div className="pointer-events-none absolute -right-[130px] -top-[120px] h-[330px] w-[330px] rounded-full bg-[#e8f5fd] blur-[80px] animate-[floatTwo_12s_ease-in-out_infinite]" />
                        <div className="pointer-events-none absolute -bottom-[150px] -left-[120px] h-[330px] w-[330px] rounded-full bg-[#f0f8fd] blur-[80px] animate-[floatOne_14s_ease-in-out_infinite_reverse]" />

                        <div className="relative z-10 flex min-h-[650px] flex-col justify-center px-8 py-10 sm:px-12 lg:px-14">
                            <div className="animate-[contentIn_.9s_.2s_cubic-bezier(.16,1,.3,1)_both]">
                                <div className="inline-flex w-fit items-center gap-2.5 rounded-[40px] border border-[#d9e6f1] bg-[#f8fcff] py-1.5 pl-1.5 pr-4 text-[15px] font-bold text-[#29465f] shadow-[0_8px_20px_rgba(58,102,141,.06)] transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_12px_25px_rgba(58,102,141,.11)] active:scale-95">
                                    <span className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-gradient-to-br from-[#5b8fbd] to-[#7eacd2] font-serif text-lg text-white shadow-[0_5px_12px_rgba(91,143,189,.2)] transition-all duration-500 hover:rotate-[12deg] hover:scale-110 active:scale-90">
                                        H
                                    </span>
                                    HOKLibrary
                                </div>

                                <p className="mt-8 flex items-center gap-2.5 text-[10px] font-bold tracking-[2.5px] text-[#7194b2]">
                                    <span className="h-px w-7 bg-[#8db5d8]" />
                                    SELAMAT DATANG
                                </p>

                                <h1 className="mt-2 font-serif text-3xl font-semibold tracking-[-.5px] text-[#29465f] sm:text-4xl">
                                    Masuk ke akun
                                </h1>

                                <p className="mt-5 text-sm leading-6 text-[#7892ad]">
                                    Masuk untuk melanjutkan ke HOKLibrary.
                                </p>
                            </div>

                            <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${error ? "mt-6 max-h-20 translate-y-0 opacity-100" : "max-h-0 -translate-y-3 opacity-0"}`}>
                                <div className="rounded-xl border border-[#f0d3d6] bg-[#fff6f7] px-4 py-3 text-sm text-[#b45f68] animate-[shake_.45s_ease]">
                                    {error}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                                <div className="animate-[contentIn_.8s_.3s_cubic-bezier(.16,1,.3,1)_both]">
                                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#29465f]">
                                        Email
                                    </label>
                                    <div className={`transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${focused === "email" ? "scale-[1.015]" : "scale-100"}`}>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => setFocused("email")}
                                            onBlur={() => setFocused("")}
                                            placeholder="Masukkan email"
                                            required
                                            className="h-[54px] w-full rounded-xl border border-[#d7e4f0] bg-[#fbfdff] px-4 text-[13px] text-[#29465f] outline-none transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] placeholder:text-[#9aabb9] hover:-translate-y-1 hover:border-[#b9cee1] hover:bg-white hover:shadow-[0_12px_28px_rgba(58,102,141,.09)] focus:-translate-y-1 focus:border-[#8db5d8] focus:bg-white focus:shadow-[0_0_0_4px_rgba(141,181,216,.13),0_15px_30px_rgba(58,102,141,.1)] active:scale-[.995]"
                                        />
                                    </div>
                                </div>

                                <div className="animate-[contentIn_.8s_.4s_cubic-bezier(.16,1,.3,1)_both]">
                                    <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#29465f]">
                                        Password
                                    </label>
                                    <div className={`relative transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${focused === "password" ? "scale-[1.015]" : "scale-100"}`}>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setFocused("password")}
                                            onBlur={() => setFocused("")}
                                            placeholder="Masukkan password"
                                            required
                                            className="h-[54px] w-full rounded-xl border border-[#d7e4f0] bg-[#fbfdff] px-4 pr-12 text-[13px] text-[#29465f] outline-none transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] placeholder:text-[#9aabb9] hover:-translate-y-1 hover:border-[#b9cee1] hover:bg-white hover:shadow-[0_12px_28px_rgba(58,102,141,.09)] focus:-translate-y-1 focus:border-[#8db5d8] focus:bg-white focus:shadow-[0_0_0_4px_rgba(141,181,216,.13),0_15px_30px_rgba(58,102,141,.1)] active:scale-[.995]"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-[#7892ad] transition-all duration-300 hover:scale-110 hover:bg-[#edf5fc] hover:text-[#4e82bd] active:scale-75"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative mt-2 flex h-[54px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#5b8fbd] via-[#6f9fca] to-[#7eacd2] font-semibold text-white shadow-[0_14px_28px_rgba(91,143,189,.22)] transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(91,143,189,.3)] active:translate-y-[2px] active:scale-[.965] disabled:opacity-60 animate-[contentIn_.8s_.5s_cubic-bezier(.16,1,.3,1)_both]"
                                >
                                    <span className="absolute -left-[120%] top-0 h-full w-[70%] skew-x-[-25deg] bg-white/20 transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:left-[130%]" />
                                    <span className="absolute inset-0 rounded-xl bg-white/0 transition-all duration-500 group-hover:bg-white/[.04] group-active:bg-white/[.1]" />
                                    <span className="relative z-10 transition-transform duration-300 group-active:scale-95">
                                        {loading ? "Memproses..." : "Masuk"}
                                    </span>
                                    {!loading && (
                                        <ArrowRight
                                            size={18}
                                            className="relative z-10 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1.5 group-hover:scale-110 group-active:translate-x-0 group-active:scale-75"
                                        />
                                    )}
                                </button>
                            </form>

                            <div className="my-7 flex items-center gap-3.5 text-[11px] text-[#9aabb9] animate-[fadeIn_1s_.7s_ease_both]">
                                <span className="h-px flex-1 bg-[#e3edf5]" />
                                <span>atau</span>
                                <span className="h-px flex-1 bg-[#e3edf5]" />
                            </div>

                            <p className="text-center text-sm text-[#7892ad] animate-[contentIn_.8s_.8s_cubic-bezier(.16,1,.3,1)_both]">
                                Belum punya akun?{" "}
                                <Link
                                    to="/register"
                                    className="inline-block font-bold text-[#4e82bd] transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:scale-[1.03] hover:text-[#315f92] hover:underline hover:underline-offset-4 active:scale-90"
                                >
                                    Daftar sekarang
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pageIn {
                    0% { opacity:0; transform:translateY(45px) scale(.94); filter:blur(12px); }
                    60% { opacity:1; transform:translateY(-6px) scale(1.01); filter:blur(0); }
                    100% { opacity:1; transform:translateY(0) scale(1); filter:blur(0); }
                }
                @keyframes cloudLeft {
                    0%,100% { transform:translate(0,0) scale(1); }
                    50% { transform:translate(80px,55px) scale(1.12); }
                }
                @keyframes cloudRight {
                    0%,100% { transform:translate(0,0) scale(1); }
                    50% { transform:translate(-75px,65px) scale(1.1); }
                }
                @keyframes cloudBottom {
                    0%,100% { transform:translate(0,0) scale(1); }
                    50% { transform:translate(55px,-65px) scale(1.14); }
                }
                @keyframes spinSlow {
                    from { transform:rotate(0deg); }
                    to { transform:rotate(360deg); }
                }
                @keyframes starOne {
                    0%,100% { transform:translate(0,0) scale(.6); opacity:.2; }
                    50% { transform:translate(18px,-28px) scale(1.5); opacity:1; }
                }
                @keyframes starTwo {
                    0%,100% { transform:translate(0,0) scale(.7); opacity:.25; }
                    50% { transform:translate(-24px,25px) scale(1.55); opacity:.95; }
                }
                @keyframes starThree {
                    0%,100% { transform:translate(0,0) scale(.6); opacity:.2; }
                    50% { transform:translate(28px,-22px) scale(1.5); opacity:.95; }
                }
                @keyframes floatOne {
                    0%,100% { transform:translateY(0); }
                    50% { transform:translateY(-26px); }
                }
                @keyframes floatTwo {
                    0%,100% { transform:translateY(0); }
                    50% { transform:translateY(24px); }
                }
                @keyframes logoIn {
                    0% { opacity:0; transform:scale(.7) translateY(45px) rotate(-3deg); filter:blur(15px); }
                    60% { opacity:1; transform:scale(1.04) translateY(-8px) rotate(1deg); filter:blur(0); }
                    100% { opacity:1; transform:scale(1) translateY(0) rotate(0); filter:blur(0); }
                }
                @keyframes logoGlow {
                    0%,100% { opacity:.35; transform:scale(.9); }
                    50% { opacity:.8; transform:scale(1.1); }
                }
                @keyframes contentIn {
                    0% { opacity:0; transform:translateY(30px); filter:blur(6px); }
                    100% { opacity:1; transform:translateY(0); filter:blur(0); }
                }
                @keyframes fadeIn {
                    from { opacity:0; }
                    to { opacity:1; }
                }
                @keyframes shake {
                    0%,100% { transform:translateX(0); }
                    20% { transform:translateX(-6px); }
                    40% { transform:translateX(6px); }
                    60% { transform:translateX(-4px); }
                    80% { transform:translateX(4px); }
                }
                @keyframes lightMove {
                    0%,100% { opacity:.15; transform:translateX(0) rotate(-32deg); }
                    50% { opacity:.8; transform:translateX(35px) rotate(-32deg); }
                }
            `}</style>
        </div>
    );
}

export default Login;