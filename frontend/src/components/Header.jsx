import logo from "../assets/hok-logo.png"

export default function Header() {
    return (
        <div className="p-4 mt-4 flex flex-col content-center items-center bg-sky-50 md:hidden">
            <div className="flex gap-4">
                <img
                    src={logo}
                    width="50"
                    alt="HOK"
                />
                <h1 className="text-4xl text-gray-900 font-bold">HOKLibrary</h1>
                
            </div>
            <p className="text-sm text-gray-500">Perpustakaan digital House Of Knowledge</p>
        </div>
    )
}