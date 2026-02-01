import { Draggable, Icons, Loading } from "@/components";
import { Droppable } from "@/components/droppable";
import { defaultBoard, pieceImageKeys } from "@/constants";
import { useGetCountryData } from "@/features/auth/profile/api/country.request";
import { useGetProfile } from "@/features/auth/profile/api/profile.request";
import { even, odd } from "@/utils/oddOrEven";
import { hashPosition } from "@/utils/positionConverter";
import {
    DndContext,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import { clsx } from "clsx";
import { useState } from "react";

const letters: Record<number, string> = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
    4: "e",
    5: "f",
    6: "g",
    7: "h",
};

type TPiece = {
    id: string;
    row: number;
    col: number;
};

const Piece = ({ id, row, col }: TPiece) => {
    const position = hashPosition(row, col);

    const piece = defaultBoard.find((item) => item.position === position);

    if (!piece) return null;

    const pieceKey = `${pieceImageKeys.colors[piece.color]}${pieceImageKeys.roles[piece.role]}`;

    return (
        <Draggable id={`${pieceKey}-${id}`}>
            <div className="w-full h-full">
                <img
                    draggable={false}
                    className="select-none! w-full h-full"
                    src={`/pieces/${pieceKey}.png`}
                />
            </div>
        </Draggable>
    );
};

type TCenterCursor = {
    transform: { x: number; y: number; scaleX: number; scaleY: number };
    draggingNodeRect: {
        width: number;
        height: number;
        top: number;
        right: number;
        bottom: number;
        left: number;
    } | null;
    activatorEvent: Event | null;
};

export const DemoBoard = () => {
    const { data: profile, isLoading } = useGetProfile();
    const { data: country } = useGetCountryData(profile?.country);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dangerZones, setDangerZones] = useState<string[]>([]);

    const centerCursor = ({
        transform,
        draggingNodeRect,
        activatorEvent,
    }: TCenterCursor) => {
        if (!draggingNodeRect || !activatorEvent) {
            return transform;
        }

        const activatorCoordinates = {
            x: activatorEvent.clientX,
            y: activatorEvent.clientY,
        };

        return {
            ...transform,
            x:
                transform.x +
                activatorCoordinates.x -
                draggingNodeRect.left -
                draggingNodeRect.width / 2,
            y:
                transform.y +
                activatorCoordinates.y -
                draggingNodeRect.top -
                draggingNodeRect.height / 2,
        };
    };

    const onDragStart = (e: DragStartEvent) => {
        const key = e.active.id?.split("-")?.[1];
        setDraggingId(key);
        setDangerZones([]);
        if (activeId === key) {
            setActiveId(null);
        } else {
            setActiveId(key);
        }
    };

    const onDragEnd = (e: DragEndEvent) => {
        const overKey = e.over?.id;
        const activeKey = e.active.id?.split("-")?.[1];

        if (!activeId) {
            setActiveId(null);
        }

        if (activeKey === overKey) {
            setDraggingId(null);
        }
    };

    if (isLoading) return <Loading />;

    return (
        <div className="h-full w-full flex-1 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
                <div className="flex gap-2 items-start">
                    <div className="w-10 h-10 rounded-sm overflow-hidden shrink-0">
                        <img src="/oponent-black.png" />
                    </div>
                    <div className="flex items-center gap-1">
                        <h3 className="text-text-primary font-semibold">
                            Opponent
                        </h3>
                    </div>
                </div>

                <div className="h-full bg-bg-secondary w-30 flex items-center justify-end px-5 rounded-sm">
                    <h2 className="text-xl font-semibold">10:00</h2>
                </div>
            </div>
            <DndContext
                modifiers={[centerCursor]}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <div className="grid grid-cols-1 rounded-md overflow-hidden w-200 h-200 aspect-square select-none!">
                    {Array(8)
                        .fill(null)
                        .map((_, row) => (
                            <div
                                key={`row-${row}`}
                                className="grid grid-cols-8"
                            >
                                {Array(8)
                                    .fill(null)
                                    .map((_, col) => (
                                        <Droppable
                                            id={`${hashPosition(row, col)}`}
                                        >
                                            <div
                                                key={`col-${col}`}
                                                onClick={() => {
                                                    setDangerZones([]);
                                                    setActiveId(null);
                                                    setDraggingId(null);
                                                }}
                                                onContextMenu={(e) => {
                                                    e.preventDefault();
                                                    const position =
                                                        hashPosition(row, col);
                                                    setDangerZones((prev) =>
                                                        prev.includes(position)
                                                            ? prev.filter(
                                                                  (item) =>
                                                                      item !==
                                                                      position
                                                              )
                                                            : [
                                                                  ...prev,
                                                                  position,
                                                              ]
                                                    );
                                                }}
                                                className={clsx(
                                                    "aspect-square w-full h-full relative flex items-center justify-center",
                                                    even(row) &&
                                                        even(col) &&
                                                        "bg-board-light",
                                                    even(row) &&
                                                        odd(col) &&
                                                        "bg-board-dark",
                                                    odd(row) &&
                                                        even(col) &&
                                                        "bg-board-dark",
                                                    odd(row) &&
                                                        odd(col) &&
                                                        "bg-board-light",
                                                    (activeId || draggingId) ===
                                                        hashPosition(
                                                            row,
                                                            col
                                                        ) &&
                                                        even(row) &&
                                                        even(col) &&
                                                        "bg-active-light!",
                                                    (activeId || draggingId) ===
                                                        hashPosition(
                                                            row,
                                                            col
                                                        ) &&
                                                        even(row) &&
                                                        odd(col) &&
                                                        "bg-active-dark!",
                                                    (activeId || draggingId) ===
                                                        hashPosition(
                                                            row,
                                                            col
                                                        ) &&
                                                        odd(row) &&
                                                        even(col) &&
                                                        "bg-active-dark!",
                                                    (activeId || draggingId) ===
                                                        hashPosition(
                                                            row,
                                                            col
                                                        ) &&
                                                        odd(row) &&
                                                        odd(col) &&
                                                        "bg-active-light!",
                                                    dangerZones.includes(
                                                        hashPosition(row, col)
                                                    ) &&
                                                        even(row) &&
                                                        even(col) &&
                                                        "bg-danger-light!",
                                                    dangerZones.includes(
                                                        hashPosition(row, col)
                                                    ) &&
                                                        even(row) &&
                                                        odd(col) &&
                                                        "bg-danger-dark!",
                                                    dangerZones.includes(
                                                        hashPosition(row, col)
                                                    ) &&
                                                        odd(row) &&
                                                        even(col) &&
                                                        "bg-danger-dark!",
                                                    dangerZones.includes(
                                                        hashPosition(row, col)
                                                    ) &&
                                                        odd(row) &&
                                                        odd(col) &&
                                                        "bg-danger-light!"
                                                )}
                                            >
                                                {col === 0 && (
                                                    <span
                                                        className={clsx(
                                                            "font-semibold text-2xl absolute top-2 left-2",
                                                            even(row) &&
                                                                "text-board-dark",
                                                            odd(row) &&
                                                                "text-board-light"
                                                        )}
                                                    >
                                                        {8 - row}
                                                    </span>
                                                )}
                                                {row === 7 && (
                                                    <span
                                                        className={clsx(
                                                            "font-semibold text-2xl absolute bottom-2 right-2",
                                                            even(col) &&
                                                                "text-board-light",
                                                            odd(col) &&
                                                                "text-board-dark"
                                                        )}
                                                    >
                                                        {letters[col]}
                                                    </span>
                                                )}
                                                <Piece
                                                    id={`${hashPosition(row, col)}`}
                                                    row={row}
                                                    col={col}
                                                />
                                            </div>
                                        </Droppable>
                                    ))}
                            </div>
                        ))}
                </div>
            </DndContext>
            <div className="flex items-center justify-between">
                <div className="flex gap-2 items-start">
                    <div className="w-10 h-10 rounded-sm overflow-hidden shrink-0">
                        {profile?.avatar ? (
                            <img
                                width={40}
                                height={40}
                                src={profile.avatar}
                                alt={profile.username}
                            />
                        ) : (
                            <Icons.defaultUser />
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <h3 className="text-text-primary font-semibold">
                            {profile?.username}
                        </h3>
                        <span className="text-sm text-text-secondary">
                            ({profile?.elo})
                        </span>
                        {country?.[0] && (
                            <div>
                                <img
                                    src={country[0].flags.svg}
                                    alt={country[0].flags.alt}
                                    className="h-3.5 w-5 rounded-xs cursor-pointer"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-full bg-text-muted w-30 flex items-center justify-end px-5 rounded-sm">
                    <h2 className="text-xl text-bg-tertiary font-semibold">
                        10:00
                    </h2>
                </div>
            </div>
        </div>
    );
};
