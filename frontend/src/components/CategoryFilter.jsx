export default function CategoryFilter({
    kategoriList,
    kategori,
    setKategori
}) {
    return (
        <div className="scrollbar-hidden flex min-w-0 flex-1 flex-nowrap gap-2 overflow-x-auto py-1 lg:flex-wrap lg:overflow-visible" role="group" aria-label="Filter kategori buku">
            {kategoriList.map((item) => (
                <button
                    key={item}
                    onClick={() => setKategori(item)}
                    aria-pressed={kategori === item}
                    className={`shrink-0 whitespace-nowrap rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors duration-150 ${
                        kategori === item
                            ? "border-[#5b8fbd] bg-[#5b8fbd] text-white shadow-sm"
                            : "border-[#d7e4f0] bg-white text-[#607b97] hover:border-[#a9c7e3] hover:bg-[#eaf4ff]"
                    }`}
                >
                    {item}
                </button>
            ))}
        </div>
    );
}