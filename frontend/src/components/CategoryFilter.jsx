export default function CategoryFilter({
    kategoriList,
    kategori,
    setKategori
}) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {kategoriList.map((item) => {
                return (
                    <button
                    key={item}
                    onClick={() => setKategori(item)}
                    className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium ${
                        kategori === item
                        ? "bg-sky-500 text-white"
                        : "bg-white text-gray-700 border-gray-200"
                    }`}
                >
                    {item}
                </button> 
                )  
            })}
        </div>
    )
}