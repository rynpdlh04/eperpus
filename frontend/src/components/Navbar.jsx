function Navbar() {
  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-2 py-2 flex items-center justify-between">

        {/* Logo */}
        <div className = "">
            <img
            src="https://hokhomeschool.com/logo-hokhs.webp"
            width = "50"
            alt="" />
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Beranda
          </a>

          <a
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Koleksi
          </a>

          <a
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Tentang
          </a>
        </div>

        {/* Login */}
        <button className="rounded-xl bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800">
          Login
        </button>

      </div>
    </nav>
  );
}

export default Navbar;