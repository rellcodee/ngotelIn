import Link from "next/link";
import { Bed, ArrowRight } from "lucide-react";

interface RoomCardProps {
    roomId: string;
    roomName: string;
}

export default function RoomCard({ roomId, roomName }: RoomCardProps) {
    return (
        <span className="my-2.5 block rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50">
            <span className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2.5">
                    <span className="flex p-2 items-center justify-center rounded-lg bg-[#0B4F37] text-white">
                        <Bed className="h-4 w-4" />
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
                    className="flex shrink-0 items-center gap-1 rounded-lg bg-[#0B4F37] px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-[#073524] active:scale-95"
                >
                    <span>Detail</span>
                    <ArrowRight className="h-3 w-3" />
                </Link>
            </span>
        </span>
    );
}