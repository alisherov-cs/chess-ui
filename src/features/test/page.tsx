import { Draggable, Icons, Loading } from "@/components";
import { Droppable } from "@/components/droppable";
import { useGetCountryData } from "@/features/auth/profile/api/country.request";
import { useGetProfile } from "@/features/auth/profile/api/profile.request";
import { cols, getLegalMoves, next, prev } from "@/utils/getLegalMoves";
import { even, odd } from "@/utils/oddOrEven";
import { hashPosition } from "@/utils/positionConverter";
import {
    DndContext,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import { clsx } from "clsx";
import { useState, useMemo, useEffect, useRef } from "react";

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
    row: number;
    col: number;
    currentPosition: string[];
};

const Piece = ({ row, col, currentPosition }: TPiece) => {
    const position = hashPosition(row, col);

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

export default function TestDemoGame() {
    const { data: profile, isLoading } = useGetProfile();
    const { data: country } = useGetCountryData(profile?.country);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dangerZones, setDangerZones] = useState<string[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const moveSound = useRef<HTMLAudioElement>(null);
    const captureSound = useRef<HTMLAudioElement>(null);
    const castleSound = useRef<HTMLAudioElement>(null);
    const checkSound = useRef<HTMLAudioElement>(null);
    const illegalSound = useRef<HTMLAudioElement>(null);
    const [isCheck, setIsCheck] = useState(false);
    const [illegalMove, setIllegalMove] = useState(false);
    const [currentPosition, setCurrentPosition] = useState([
        "wra1",
        "wnb1",
        "wbc1",
        "wqd1",
        "wke1",
        "wbf1",
        "wng1",
        "wrh1",
        "wpa2",
        "wpb2",
        "wpc2",
        "wpd2",
        "wpe2",
        "wpf2",
        "wpg2",
        "wph2",
        "bra8",
        "bnb8",
        "bbc8",
        "bqd8",
        "bke8",
        "bbf8",
        "bng8",
        "brh8",
        "bpa7",
        "bpb7",
        "bpc7",
        "bpd7",
        "bpe7",
        "bpf7",
        "bpg7",
        "bph7",
    ]);

    const moves = useMemo(() => {
        if (activeId) {
            return getLegalMoves(activeId, currentPosition, history);
        }
        if (draggingId) {
            return getLegalMoves(draggingId, currentPosition, history);
        }
        return {
            legalMoves: [],
            legalCaptures: [],
            legalEnpassent: [],
            legalCastles: [],
        };
    }, [activeId, draggingId, currentPosition, history]);

    const calculateMoves = (currentPositions = currentPosition) => {
        const whitePieces = currentPositions.filter((item) =>
            item.startsWith("w")
        );
        const whiteAllLegalMoves = whitePieces.map((piece) => {
            const { legalMoves, legalCaptures } = getLegalMoves(
                piece,
                currentPositions,
                history
            );
            return { legalMoves, legalCaptures };
        });
        const whiteLegalMoves = whiteAllLegalMoves
            .map((item) => item.legalMoves)
            .flat();
        const whiteLegalCaptures = whiteAllLegalMoves
            .map((item) => item.legalCaptures)
            .flat();

        const blackPieces = currentPositions.filter((item) =>
            item.startsWith("b")
        );
        const blackAllLegalMoves = blackPieces.map((piece) => {
            const { legalMoves, legalCaptures } = getLegalMoves(
                piece,
                currentPositions,
                history
            );
            return { legalMoves, legalCaptures };
        });
        const blackLegalMoves = blackAllLegalMoves
            .map((item) => item.legalMoves)
            .flat();
        const blackLegalCaptures = blackAllLegalMoves
            .map((item) => item.legalCaptures)
            .flat();

        return {
            whitePieces,
            whiteLegalMoves,
            whiteLegalCaptures,
            blackPieces,
            blackLegalMoves,
            blackLegalCaptures,
        };
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIllegalMove(false);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [illegalMove]);

    useEffect(() => {
        const actions = history.at(-1)?.split("-");

        console.log(history);
        if (actions?.includes("+")) {
            checkSound.current?.play();
        } else if (actions?.includes("x")) {
            captureSound.current?.play();
        } else if (actions?.includes("O")) {
            castleSound.current?.play();
        } else {
            moveSound.current?.play();
        }
    }, [history]);

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
        const key = e.active.id as string;
        const [color, __, col, row] = key.split("");

        if (activeId && moves.legalCaptures.includes(`${col}${row}`)) {
            setCurrentPosition((prev) =>
                prev.filter((item) => !item.endsWith(`${col}${row}`))
            );
            if (moves.legalEnpassent.includes(`${col}${row}`)) {
                setCurrentPosition((prev) =>
                    prev.filter(
                        (item) =>
                            !item.endsWith(
                                `${col}${color === "w" ? Number(row) - 1 : Number(row) + 1}`
                            )
                    )
                );
            }
            setCurrentPosition((prev) =>
                prev.map((item) => {
                    if (item === activeId) {
                        const [color, role] = item.split("");
                        return `${color}${role}${col}${row}`;
                    }

                    return item;
                })
            );
            const mostRecentPosition = currentPosition
                .filter((item) => !item.endsWith(`${col}${row}`))
                .map((item) => {
                    if (item === activeId) {
                        const [color, role] = item.split("");
                        return `${color}${role}${col}${row}`;
                    }

                    return item;
                });
            const { whiteLegalCaptures, blackLegalCaptures } =
                calculateMoves(mostRecentPosition);

            const whiteKingPosition = mostRecentPosition.find((item) =>
                item.startsWith("wk")
            );
            const blackKingPosition = mostRecentPosition.find((item) =>
                item.startsWith("bk")
            );

            if (
                whiteLegalCaptures.some((item) =>
                    blackKingPosition?.endsWith(item)
                ) ||
                blackLegalCaptures.some((item) =>
                    whiteKingPosition?.endsWith(item)
                )
            ) {
                setIsCheck(true);
                setHistory((prev) => [...prev, `${activeId}-${col}${row}-x-+`]);
            } else {
                setIsCheck(false);
                setHistory((prev) => [...prev, `${activeId}-${col}${row}-x`]);
            }
            setActiveId(null);
            setDraggingId(null);
        } else {
            if (history.length % 2 === 0 && !key.startsWith("b")) {
                setDraggingId(key as string);
                setDangerZones([]);
                if (activeId === key) {
                    setActiveId(null);
                } else {
                    setActiveId(key as string);
                }
            }

            if (history.length % 2 === 1 && !key.startsWith("w")) {
                setDraggingId(key as string);
                setDangerZones([]);
                if (activeId === key) {
                    setActiveId(null);
                } else {
                    setActiveId(key as string);
                }
            }

            if (
                (history.length % 2 === 0 && key.startsWith("b")) ||
                (history.length % 2 === 1 && key.startsWith("w"))
            ) {
                setActiveId(null);
                setDangerZones([]);
            }
        }
    };

    const onDragEnd = (e: DragEndEvent) => {
        const overKey = e.over?.id as string;
        const activeKey = e.active.id as string;

        if (!activeId) {
            setActiveId(null);
        }

        if (activeKey.endsWith(overKey)) {
            setDraggingId(null);
        }

        if (
            isCheck &&
            !activeKey.endsWith(overKey) &&
            !moves.legalMoves.includes(overKey) &&
            !moves.legalCaptures.includes(overKey) &&
            !moves.legalCastles.includes(overKey) &&
            !moves.legalEnpassent.includes(overKey)
        ) {
            setIllegalMove(true);
            illegalSound.current?.play();
        }

        if (moves.legalCastles.includes(overKey)) {
            const [_, __, activeCol] = activeKey.split("");
            const [col, row] = overKey.split("");
            const rookPosition =
                cols.indexOf(col) > cols.indexOf(activeCol)
                    ? `${cols.at(-1)}${row}`
                    : `${cols.at(0)}${row}`;
            const rookTeleportedPosition =
                cols.indexOf(col) > cols.indexOf(activeCol)
                    ? `${prev(cols.at(-1) as string, 2)}${row}`
                    : `${next(cols.at(0) as string, 3)}${row}`;
            setCurrentPosition((prev) =>
                prev.map((item) => {
                    if (item.endsWith(rookPosition)) {
                        const [color, role] = item.split("");
                        return `${color}${role}${rookTeleportedPosition}`;
                    }
                    return item;
                })
            );
            setCurrentPosition((items) =>
                items.map((item) => {
                    if (item.endsWith(activeKey)) {
                        const [color, role] = item.split("");
                        const [col] = rookPosition.split("");
                        const [teleportCol] = rookTeleportedPosition.split("");
                        const kingPosition =
                            cols.indexOf(col) > cols.indexOf(activeCol)
                                ? next(teleportCol)
                                : prev(teleportCol);
                        return `${color}${role}${kingPosition}${row}`;
                    }

                    return item;
                })
            );

            const mostRecentPosition = currentPosition
                .map((item) => {
                    if (item.endsWith(rookPosition)) {
                        const [color, role] = item.split("");
                        return `${color}${role}${rookTeleportedPosition}`;
                    }
                    return item;
                })
                .map((item) => {
                    if (item.endsWith(activeKey)) {
                        const [color, role] = item.split("");
                        const [col] = rookPosition.split("");
                        const [teleportCol] = rookTeleportedPosition.split("");
                        const kingPosition =
                            cols.indexOf(col) > cols.indexOf(activeCol)
                                ? next(teleportCol)
                                : prev(teleportCol);
                        return `${color}${role}${kingPosition}${row}`;
                    }

                    return item;
                });
            const { whiteLegalCaptures, blackLegalCaptures } =
                calculateMoves(mostRecentPosition);

            const whiteKingPosition = mostRecentPosition.find((item) =>
                item.startsWith("wk")
            );
            const blackKingPosition = mostRecentPosition.find((item) =>
                item.startsWith("bk")
            );

            if (
                whiteLegalCaptures.some((item) =>
                    blackKingPosition?.endsWith(item)
                ) ||
                blackLegalCaptures.some((item) =>
                    whiteKingPosition?.endsWith(item)
                )
            ) {
                setIsCheck(true);
                setHistory((prev) => [
                    ...prev,
                    `O-O-${cols.indexOf(col) > cols.indexOf(activeCol) ? "k" : "q"}-+`,
                ]);
            } else {
                setIsCheck(false);
                setHistory((prev) => [
                    ...prev,
                    `O-O-${cols.indexOf(col) > cols.indexOf(activeCol) ? "k" : "q"}`,
                ]);
            }
            setDraggingId(null);
            setActiveId(null);
        }

        if (moves.legalMoves.includes(overKey)) {
            setCurrentPosition((prev) =>
                prev.map((item) => {
                    if (item.endsWith(activeKey)) {
                        const [color, role] = item.split("");
                        return `${color}${role}${overKey}`;
                    }

                    return item;
                })
            );

            const mostRecentPosition = currentPosition.map((item) => {
                if (item.endsWith(activeKey)) {
                    const [color, role] = item.split("");
                    return `${color}${role}${overKey}`;
                }

                return item;
            });
            const { whiteLegalCaptures, blackLegalCaptures } =
                calculateMoves(mostRecentPosition);

            const whiteKingPosition = mostRecentPosition.find((item) =>
                item.startsWith("wk")
            );
            const blackKingPosition = mostRecentPosition.find((item) =>
                item.startsWith("bk")
            );

            if (
                whiteLegalCaptures.some((item) =>
                    blackKingPosition?.endsWith(item)
                ) ||
                blackLegalCaptures.some((item) =>
                    whiteKingPosition?.endsWith(item)
                )
            ) {
                setIsCheck(true);
                setHistory((prev) => [...prev, `${activeKey}-${overKey}-+`]);
            } else {
                setIsCheck(false);
                setHistory((prev) => [...prev, `${activeKey}-${overKey}`]);
            }

            setDraggingId(null);
            setActiveId(null);
        }

        if (moves.legalCaptures.includes(overKey)) {
            setCurrentPosition((prev) =>
                prev.filter((item) => !item.endsWith(overKey))
            );
            if (moves.legalEnpassent.includes(overKey)) {
                const [color] = activeKey.split("");
                const [col, row] = overKey.split("");

                setCurrentPosition((prev) =>
                    prev.filter(
                        (item) =>
                            !item.endsWith(
                                `${col}${color === "w" ? Number(row) - 1 : Number(row) + 1}`
                            )
                    )
                );
            }
            setCurrentPosition((prev) =>
                prev.map((item) => {
                    if (item.endsWith(activeKey)) {
                        const [color, role] = item.split("");
                        return `${color}${role}${overKey}`;
                    }

                    return item;
                })
            );

            const mostRecentPosition = currentPosition
                .filter((item) => !item.endsWith(overKey))
                .map((item) => {
                    if (item.endsWith(activeKey)) {
                        const [color, role] = item.split("");
                        return `${color}${role}${overKey}`;
                    }

                    return item;
                });
            const { whiteLegalCaptures, blackLegalCaptures } =
                calculateMoves(mostRecentPosition);

            const whiteKingPosition = mostRecentPosition.find((item) =>
                item.startsWith("wk")
            );
            const blackKingPosition = mostRecentPosition.find((item) =>
                item.startsWith("bk")
            );

            if (
                whiteLegalCaptures.some((item) =>
                    blackKingPosition?.endsWith(item)
                ) ||
                blackLegalCaptures.some((item) =>
                    whiteKingPosition?.endsWith(item)
                )
            ) {
                setIsCheck(true);
                setHistory((prev) => [...prev, `${activeKey}-${overKey}-x-+`]);
            } else {
                setIsCheck(false);
                setHistory((prev) => [...prev, `${activeKey}-${overKey}-x`]);
            }
            setDraggingId(null);
            setActiveId(null);
        }
    };

    const onSquareClick = (row: number, col: number) => {
        setDangerZones([]);

        if (activeId && moves.legalMoves.includes(hashPosition(row, col))) {
            if (moves.legalCastles.includes(hashPosition(row, col))) {
                const [overCol] = hashPosition(row, col).split("");
                const [_, __, activeCol, activeRow] = activeId.split("");
                const rookPosition =
                    cols.indexOf(overCol) > cols.indexOf(activeCol)
                        ? `${cols.at(-1)}${activeRow}`
                        : `${cols.at(0)}${activeRow}`;
                const rookTeleportedPosition =
                    cols.indexOf(overCol) > cols.indexOf(activeCol)
                        ? prev(overCol, 1)
                        : next(overCol, 1);
                setCurrentPosition((prev) =>
                    prev.map((item) => {
                        if (item === activeId) {
                            const [color, role] = item.split("");
                            return `${color}${role}${hashPosition(row, col)}`;
                        }
                        return item;
                    })
                );
                setCurrentPosition((prev) =>
                    prev.map((item) => {
                        if (item.endsWith(rookPosition)) {
                            const [color, role] = item.split("");
                            return `${color}${role}${rookTeleportedPosition}${activeRow}`;
                        }
                        return item;
                    })
                );
                const mostRecentPosition = currentPosition
                    .map((item) => {
                        if (item.endsWith(rookPosition)) {
                            const [color, role] = item.split("");
                            return `${color}${role}${rookTeleportedPosition}`;
                        }
                        return item;
                    })
                    .map((item) => {
                        if (item === activeId) {
                            const [color, role] = item.split("");
                            const [col] = rookPosition.split("");
                            const [teleportCol] =
                                rookTeleportedPosition.split("");
                            const kingPosition =
                                cols.indexOf(col) > cols.indexOf(activeCol)
                                    ? next(teleportCol)
                                    : prev(teleportCol);
                            return `${color}${role}${kingPosition}${row}`;
                        }

                        return item;
                    });
                const { whiteLegalCaptures, blackLegalCaptures } =
                    calculateMoves(mostRecentPosition);

                const whiteKingPosition = mostRecentPosition.find((item) =>
                    item.startsWith("wk")
                );
                const blackKingPosition = mostRecentPosition.find((item) =>
                    item.startsWith("bk")
                );

                if (
                    whiteLegalCaptures.some((item) =>
                        blackKingPosition?.endsWith(item)
                    ) ||
                    blackLegalCaptures.some((item) =>
                        whiteKingPosition?.endsWith(item)
                    )
                ) {
                    setIsCheck(true);
                    setHistory((prev) => [
                        ...prev,
                        `O-O-${cols.indexOf(overCol) > cols.indexOf(activeCol) ? "k" : "q"}-+`,
                    ]);
                } else {
                    setIsCheck(false);
                    setHistory((prev) => [
                        ...prev,
                        `O-O-${cols.indexOf(overCol) > cols.indexOf(activeCol) ? "k" : "q"}`,
                    ]);
                }
            } else {
                setCurrentPosition((prev) =>
                    prev.map((item) => {
                        if (item === activeId) {
                            const [color, role] = item.split("");
                            return `${color}${role}${hashPosition(row, col)}`;
                        }

                        return item;
                    })
                );
                const mostRecentPosition = currentPosition.map((item) => {
                    if (item === activeId) {
                        const [color, role] = item.split("");
                        return `${color}${role}${hashPosition(row, col)}`;
                    }

                    return item;
                });
                const { whiteLegalCaptures, blackLegalCaptures } =
                    calculateMoves(mostRecentPosition);

                const whiteKingPosition = mostRecentPosition.find((item) =>
                    item.startsWith("wk")
                );
                const blackKingPosition = mostRecentPosition.find((item) =>
                    item.startsWith("bk")
                );

                if (
                    whiteLegalCaptures.some((item) =>
                        blackKingPosition?.endsWith(item)
                    ) ||
                    blackLegalCaptures.some((item) =>
                        whiteKingPosition?.endsWith(item)
                    )
                ) {
                    setIsCheck(true);
                    setHistory((prev) => [
                        ...prev,
                        `${activeId}-${hashPosition(row, col)}-+`,
                    ]);
                } else {
                    setIsCheck(false);
                    setHistory((prev) => [
                        ...prev,
                        `${activeId}-${hashPosition(row, col)}`,
                    ]);
                }
            }
        }

        if (activeId && moves.legalCaptures.includes(hashPosition(row, col))) {
            setCurrentPosition((prev) =>
                prev.filter((item) => !item.endsWith(hashPosition(row, col)))
            );
            if (moves.legalEnpassent.includes(hashPosition(row, col))) {
                const [color] = activeId.split("");
                const [hashedCol, hashedRow] = hashPosition(row, col);

                setCurrentPosition((prev) =>
                    prev.filter(
                        (item) =>
                            !item.endsWith(
                                `${hashedCol}${color === "w" ? Number(hashedRow) - 1 : Number(hashedRow) + 1}`
                            )
                    )
                );
            }
            setCurrentPosition((prev) =>
                prev.map((item) => {
                    if (item === activeId) {
                        const [color, role] = item.split("");
                        return `${color}${role}${hashPosition(row, col)}`;
                    }

                    return item;
                })
            );
            const mostRecentPosition = currentPosition
                .filter((item) => !item.endsWith(hashPosition(row, col)))
                .map((item) => {
                    if (item === activeId) {
                        const [color, role] = item.split("");
                        return `${color}${role}${hashPosition(row, col)}`;
                    }

                    return item;
                });
            const { whiteLegalCaptures, blackLegalCaptures } =
                calculateMoves(mostRecentPosition);

            const whiteKingPosition = mostRecentPosition.find((item) =>
                item.startsWith("wk")
            );
            const blackKingPosition = mostRecentPosition.find((item) =>
                item.startsWith("bk")
            );

            if (
                whiteLegalCaptures.some((item) =>
                    blackKingPosition?.endsWith(item)
                ) ||
                blackLegalCaptures.some((item) =>
                    whiteKingPosition?.endsWith(item)
                )
            ) {
                setIsCheck(true);
                setHistory((prev) => [
                    ...prev,
                    `${activeId}-${hashPosition(row, col)}-x-+`,
                ]);
            } else {
                setIsCheck(false);
                setHistory((prev) => [
                    ...prev,
                    `${activeId}-${hashPosition(row, col)}-x`,
                ]);
            }
        }

        setActiveId(null);
        setDraggingId(null);
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
                                                onClick={() =>
                                                    onSquareClick(row, col)
                                                }
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
                                                    (
                                                        activeId || draggingId
                                                    )?.endsWith(
                                                        hashPosition(row, col)
                                                    ) &&
                                                        even(row) &&
                                                        even(col) &&
                                                        "bg-active-light!",
                                                    (
                                                        activeId || draggingId
                                                    )?.endsWith(
                                                        hashPosition(row, col)
                                                    ) &&
                                                        even(row) &&
                                                        odd(col) &&
                                                        "bg-active-dark!",
                                                    (
                                                        activeId || draggingId
                                                    )?.endsWith(
                                                        hashPosition(row, col)
                                                    ) &&
                                                        odd(row) &&
                                                        even(col) &&
                                                        "bg-active-dark!",
                                                    (
                                                        activeId || draggingId
                                                    )?.endsWith(
                                                        hashPosition(row, col)
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
                                                        "bg-danger-light!",
                                                    illegalMove &&
                                                        history.length % 2 ===
                                                            0 &&
                                                        currentPosition
                                                            .find((item) =>
                                                                item.startsWith(
                                                                    "wk"
                                                                )
                                                            )
                                                            ?.endsWith(
                                                                hashPosition(
                                                                    row,
                                                                    col
                                                                )
                                                            ) &&
                                                        "bg-danger-dark animate-illegal"
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
                                                {moves.legalMoves?.includes(
                                                    hashPosition(row, col)
                                                ) && (
                                                    <div
                                                        className={clsx(
                                                            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-999 w-8 h-8 rounded-full",
                                                            even(row) &&
                                                                even(col) &&
                                                                "bg-bg-tertiary/20",
                                                            even(row) &&
                                                                odd(col) &&
                                                                "bg-bg-tertiary/30",
                                                            odd(row) &&
                                                                even(col) &&
                                                                "bg-bg-tertiary/30",
                                                            odd(row) &&
                                                                odd(col) &&
                                                                "bg-bg-tertiary/20"
                                                        )}
                                                    />
                                                )}
                                                {moves.legalCaptures?.includes(
                                                    hashPosition(row, col)
                                                ) && (
                                                    <div
                                                        className={clsx(
                                                            "absolute top-0 left-0 z-999 w-full h-full rounded-full border-8",
                                                            even(row) &&
                                                                even(col) &&
                                                                "border-bg-tertiary/20",
                                                            even(row) &&
                                                                odd(col) &&
                                                                "border-bg-tertiary/30",
                                                            odd(row) &&
                                                                even(col) &&
                                                                "border-bg-tertiary/30",
                                                            odd(row) &&
                                                                odd(col) &&
                                                                "border-bg-tertiary/20"
                                                        )}
                                                    />
                                                )}
                                                <Piece
                                                    row={row}
                                                    col={col}
                                                    currentPosition={
                                                        currentPosition
                                                    }
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

            <div className="hidden">
                <audio ref={moveSound} src="/sounds/move-self.mp3" />
                <audio ref={captureSound} src="/sounds/capture.mp3" />
                <audio ref={castleSound} src="/sounds/castle.mp3" />
                <audio ref={checkSound} src="/sounds/move-check.mp3" />
                <audio ref={illegalSound} src="/sounds/illegal.mp3" />
            </div>
        </div>
    );
}
