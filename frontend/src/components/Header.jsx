import logo from "../assets/hok-logo.png";

export default function Header() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userName = user?.nama?.trim() || user?.name?.trim() || "Pembaca";

    return (
        <header className="border-b border-[#c5d8ec] bg-[#dceafa] px-4 py-3 shadow-[0_4px_16px_rgba(54,96,139,.05)] md:ml-64 md:px-7">
            <div className="mx-auto flex min-h-12 max-w-7xl items-center gap-3">
                <img
                    src={logo}
                    alt="HOKLibrary"
                    className="h-11 w-11 shrink-0 rounded-xl bg-[#c5ddf6] p-1.5 object-contain md:hidden"
                />
                <div className="min-w-0">
                    <p className="truncate text-base font-bold leading-tight text-[#315f92]">
                        Selamat datang, {userName}
                    </p>
                    <p className="mt-1 text-xs text-[#7892ad]">
                        Senang melihatmu kembali di HOKLibrary.
                    </p>
                </div>
            </div>
        </header>
    );
}