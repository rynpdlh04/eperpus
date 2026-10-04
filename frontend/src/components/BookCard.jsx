import { Link } from "react-router-dom"

export default function BookCard({ buku }) {
    return (
        <div key={buku.id} className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            
            {/* Cover Buku disini deh */}
            <div className="flex h-64 items-center justify-center bg-gray-100">
                {buku.cover ? (
                    <img
                        src={buku.cover}
                        alt={`Cover ${buku.judul}`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                        <div className="text-center text-gray-400">
                            <p className="text-4xl">📖</p>
                            <p className="mt-2 text-sm">Preview cover belum tersedia</p>
                    </div>
                )}
            </div>

            {/* ini info bukunya */}
            <div className="p-4">
                <div className="h-14"> 
                    <h2 className="line-clamp-2 text-lg font-bold">
                    {buku.judul}
                </h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">{ buku.penulis }</p>

                <div className="mt-3 flex flex-col gap-2 items-center justify-between">
                    <span className="rounded-lg bg-sky-100 px-3 py-1 text-xs font-medium text-gray-700">{ buku.kategori }</span>
                    <span className="text-xs text-gray-500">{ buku.tahun }</span>
                </div>

                <Link
                    to={`/buku/${buku.id}`}
                    className="block mt-4 w-full rounded-xl border border-sky-200 py-2 text-center text-sm font-medium transition hover:bg-sky-100">
                    Lihat Detail
                </Link>
            </div>
            
            </div>
    )
}