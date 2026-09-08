import Link from "next/link";


interface RoomCardProps {
    roomId: string;
    roomName: string;
}

export default function RoomCard({ roomId, roomName }: RoomCardProps) {
    return (
        <span className="my-2.5 block rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50">
            <span className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2.5">
                    <span className="flex p-2 items-center justify-center rounded-lg bg-[#1D4ED8] text-white">
                        <span className="material-symbols-outlined text-[16px]">bed</span>
                    </span>
                    <span className="block">
                        <span className="block text-xs font-bold text-gray-900">{roomName}</span>
                        <span className="block text-[10px] font-medium text-emerald-700">
                            Rekomendasi TiniBot
                        </span>
                    </span>
                </span>

                <Link
                    href={`/kamar/${roomId}`}
                    className="flex shrink-0 items-center gap-1 rounded-lg bg-[#1D4ED8] px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-[#1E3A8A] active:scale-95"
                >
                    <span>Detail</span>
                    <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </Link>
            </span>
        </span>
    );
}