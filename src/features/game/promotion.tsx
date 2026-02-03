import { pieceImageKeys, Role } from "@/constants";
import { XIcon } from "lucide-react";

type TPromotion = {
    color: string;
    onSelect: (role: Role) => void;
    onReject: () => void;
};

export const Promotion = ({ color, onSelect, onReject }: TPromotion) => {
    const pieces = [Role.queen, Role.knight, Role.rook, Role.bishop];

    return (
        <div className="flex flex-col absolute top-0 left-0 z-9999999999 bg-white shadow-2xl shadow-black rounded-md">
            {pieces.map((piece) => (
                <div
                    onClick={() => onSelect(piece)}
                    className="w-25 h-25 transition-all cursor-pointer"
                >
                    <img
                        draggable={false}
                        className="select-none! w-full h-full"
                        src={`/pieces/${color}${pieceImageKeys.roles[piece]}.png`}
                    />
                </div>
            ))}
            <button
                onClick={onReject}
                className="flex items-center justify-center bg-gray-100 rounded-b-md py-1 cursor-pointer"
            >
                <XIcon className="text-black" />
            </button>
        </div>
    );
};
