import { Search } from "lucide-react";

export default function SearchBar({ search, setSearch }) {
    return (
        <div className="mb-6 w-full max-w-2xl sm:mx-5">
            <label className="relative block" htmlFor="book-search">
                <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-9 -translate-y-1/2 text-gray-500"
                    size={18}
                />
            <input
                id="book-search"
                type="text"
                placeholder="Cari judul, penulis, dan kode buku disini..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="mt-4 w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 outline-none focus:border-black"
            />
            </label>
        </div>
    );
}