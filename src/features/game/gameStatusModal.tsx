import { pieceImageKeys, type Color } from "@/constants";
import { clsx } from "clsx";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

type TGameStatusModal = {
    winner: Color | null;
    draw: boolean;
};

export const GameStatusModal = ({ winner, draw }: TGameStatusModal) => {
    const [open, setOpen] = useState(winner || draw);

    useEffect(() => {
        setOpen(winner || draw);
    }, [winner, draw]);

    return (
        <div
            className={clsx(
                "absolute top-0 left-0 w-full h-full bg-black/20 z-9999999999 flex items-center justify-center",
                open ? "visible" : "hidden"
            )}
        >
            <div className="relative bg-bg-tertiary w-100 h-50 rounded-md flex items-center justify-center">
                {winner && (
                    <div className="flex items-center gap-2">
                        <h1 className="">Winner:</h1>
                        <img
                            src={`/pieces/${pieceImageKeys.colors[winner!]}k.png`}
                            className="w-10"
                        />
                    </div>
                )}
                {draw && (
                    <div className="flex items-center gap-2">
                        <h1 className="">Draw</h1>
                    </div>
                )}

                <button
                    className="cursor-pointer absolute top-4 right-4 z-999999"
                    onClick={() => setOpen(false)}
                >
                    <XIcon />
                </button>
            </div>
        </div>
    );
};
