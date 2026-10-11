import { Search } from "lucide-react";

export default function SearchBar({ search, setSearch }) {
    return (
        <div className="w-full">
            <label className="relative block" htmlFor="book-search">
                <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5b82aa]"
                    size={18}
                />
            <input
                id="book-search"
                type="text"
                placeholder="Cari judul, penulis, dan kode buku disini..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#d3e1ef] bg-white py-2 pl-10 pr-4 text-sm text-[#334155] outline-none transition placeholder:text-[#94a8bc] focus:border-[#8bb3da] focus:ring-4 focus:ring-[#e7f1fb]"
            />
            </label>
        </div>
    );
}