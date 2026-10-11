import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "Konfirmasi",
    cancelLabel = "Batal",
    tone = "danger",
    busy = false,
    onConfirm,
    onCancel
}) {
    if (!open) return null;

    const confirmClass = tone === "danger"
        ? "bg-[#bd6f72] hover:bg-[#aa5c60]"
        : "bg-[#5b8fbd] hover:bg-[#4e7fab]";

    return (
        <div className="fixed inset-0 z-300 flex items-center justify-center bg-[#29465f]/35 px-4 py-6 backdrop-blur-sm" onMouseDown={onCancel}>
            <section
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
                className="w-full max-w-md rounded-2xl border border-[#d9e6f1] bg-white p-6 shadow-[0_24px_70px_rgba(41,70,95,.24)] page-enter"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="flex items-start gap-4">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone === "danger" ? "bg-[#fff0f1] text-[#bd6f72]" : "bg-[#eaf4ff] text-[#5b8fbd]"}`}>
                        <AlertTriangle size={21} />
                    </span>
                    <div className="min-w-0">
                        <h2 id="confirm-dialog-title" className="text-lg font-bold text-[#29465f]">{title}</h2>
                        <p id="confirm-dialog-description" className="mt-2 text-sm leading-6 text-[#7892ad]">{description}</p>
                    </div>
                </div>

                <div className="mt-7 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={busy}
                        className="rounded-xl border border-[#d7e4f0] px-4 py-2.5 text-sm font-semibold text-[#607b97] transition hover:bg-[#f4f8fd] disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={busy}
                        className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${confirmClass}`}
                    >
                        {busy ? "Memproses..." : confirmLabel}
                    </button>
                </div>
            </section>
        </div>
    );
}
