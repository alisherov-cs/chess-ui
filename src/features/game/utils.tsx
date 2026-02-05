import { clsx } from "clsx";
import { Draggable } from "@/components";
import { getCaptureColor, getMoveColor, getTextColor } from "./colors";

type TPiece = {
    position: string;
    currentPosition: string[];
};

export const Piece = ({ position, currentPosition }: TPiece) => {
    const piece = currentPosition.find((item) => item.endsWith(position));

    if (!piece) return null;

    const [color, role] = piece.split("");

    const pieceKey = `${color}${role}`;

    return (
        <Draggable id={`${pieceKey}${position}`}>
            <div className="w-full h-full transition-all">
                <img
                    draggable={false}
                    className="select-none! w-full h-full"
                    src={`/pieces/${pieceKey}.png`}
                />
            </div>
        </Draggable>
    );
};

type TMoves = {
    position: string;
    legalMoves: string[];
};

export const Moves = ({ position, legalMoves }: TMoves) => {
    if (!legalMoves?.includes(position)) {
        return;
    }

    return (
        <div
            className={clsx(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-999 w-8 h-8 rounded-full",
                getMoveColor(position)
            )}
        />
    );
};

type TCaptures = {
    position: string;
    legalCaptures: string[];
};

export const Captures = ({ position, legalCaptures }: TCaptures) => {
    if (!legalCaptures?.includes(position)) {
        return;
    }

    return (
        <div
            className={clsx(
                "absolute top-0 left-0 z-999 w-full h-full rounded-full border-8",
                getCaptureColor(position)
            )}
        />
    );
};

type TIndex = {
    position: string;
};

export const Numbers = ({ position }: TIndex) => {
    const [_, row] = position.split("");

    return (
        <span
            className={clsx(
                "font-semibold text-2xl absolute top-2 left-2",
                getTextColor(position)
            )}
        >
            {row}
        </span>
    );
};

export const Letters = ({ position }: TIndex) => {
    const [col] = position.split("");

    return (
        <span
            className={clsx(
                "font-semibold text-2xl absolute bottom-2 right-2",
                getTextColor(position)
            )}
        >
            {col}
        </span>
    );
};
