import { useDraggable } from "@dnd-kit/core";
import { type ReactNode } from "react";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";

type TDraggable = {
    id: string;
    children: ReactNode;
};

export const Draggable = ({ id, children }: TDraggable) => {
    const { setNodeRef, isDragging, listeners, attributes, transform } =
        useDraggable({
            id,
        });
    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={clsx(
                "w-full h-full",
                isDragging ? "z-99999 cursor-grabbing" : "z-99998 cursor-grab"
            )}
            {...listeners}
            {...attributes}
        >
            {children}
        </div>
    );
};
