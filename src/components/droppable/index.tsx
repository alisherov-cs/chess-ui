import { even, odd } from "@/utils/oddOrEven";
import { convertPosition } from "@/utils/positionConverter";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import type { ReactNode } from "react";

type TDroppable = {
    id: string;
    children: ReactNode;
};

export const Droppable = ({ id, children }: TDroppable) => {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    const { row, col } = convertPosition(id);

    return (
        <div ref={setNodeRef} className="relative">
            {children}
            <div
                className={clsx(
                    "absolute top-0 right-0 w-full h-full border-5",
                    even(row) && even(col) && "border-gray-50",
                    even(row) && odd(col) && "border-gray-300",
                    odd(row) && even(col) && "border-gray-300",
                    odd(row) && odd(col) && "border-gray-50",
                    isOver ? "visible" : "hidden"
                )}
            />
        </div>
    );
};
