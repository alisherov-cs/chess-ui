import { Icons, Loading } from "@/components";
import { Droppable } from "@/components/droppable";
import { useGetProfile } from "@/features/auth/profile/api/profile.request";
import { cols, getLegalMoves } from "@/utils/getLegalMoves";
import {
    DndContext,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import { clsx } from "clsx";
import { useState, useMemo, useEffect, useRef, type ReactNode } from "react";
import {
    defaultPositions,
    getActiveBgColor,
    getBgColor,
    getDangerZoneColor,
    getIllegalBgColor,
} from "./colors";
import { Captures, Letters, Moves, Numbers, Piece } from "./utils";
import { Promotion } from "./promotion";
import { Color, pieceImageKeys, type Role } from "@/constants";
import { UserIndicator } from "./userIndicator";
import { GameStatusModal } from "./gameStatusModal";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useFindGame } from "./api/findGame.request";
import { RotateCwSquare } from "lucide-react";
import { socket } from "@/socket";

type TGameStatus = {
    winner: Color | null;
    draw: boolean;
    currentPosition: string[];
    position: string;
};

const GameStatus = ({
    winner,
    draw,
    currentPosition,
    position,
}: TGameStatus) => {
    const whiteKingPosition = currentPosition.find((item) =>
        item.startsWith("wk")
    );
    const blackKingPosition = currentPosition.find((item) =>
        item.startsWith("bk")
    );

    if (!whiteKingPosition || !blackKingPosition) return;

    const icons: Record<string, ReactNode> = {
        [winner === Color.white
            ? whiteKingPosition.substring(2)
            : blackKingPosition.substring(2)]: (
            <div className="w-full h-full rounded-full bg-green-500 flex items-center justify-center">
                <Icons.winner />
            </div>
        ),
        [winner === Color.white
            ? blackKingPosition.substring(2)
            : whiteKingPosition.substring(2)]: (
            <div className="w-full h-full rounded-full bg-red-500 flex items-center justify-center">
                <Icons.checkmate />
            </div>
        ),
    };

    if (
        whiteKingPosition?.endsWith(position) ||
        blackKingPosition?.endsWith(position)
    ) {
        return (
            <div className="absolute -top-2 -right-2 z-9999999999999 w-10 h-10 flex items-center justify-center">
                {draw && (
                    <div className="w-full h-full rounded-full bg-bg-secondary flex items-center justify-center">
                        <Icons.draw />
                    </div>
                )}
                {winner && icons[position]}
            </div>
        );
    }
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

export default function Game() {
    const { id } = useParams();
    const { data: profile, isLoading } = useGetProfile();
    const {
        data: game,
        isLoading: gameLoading,
        isFetched,
        refetch,
    } = useFindGame(id);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dangerZones, setDangerZones] = useState<string[]>([]);
    const [history, setHistory] = useState<string[]>(game?.history ?? []);
    const moveSound = useRef<HTMLAudioElement>(null);
    const captureSound = useRef<HTMLAudioElement>(null);
    const castleSound = useRef<HTMLAudioElement>(null);
    const checkSound = useRef<HTMLAudioElement>(null);
    const illegalSound = useRef<HTMLAudioElement>(null);
    const [isCheck, setIsCheck] = useState(false);
    const [illegalMove, setIllegalMove] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(
        game?.currentPosition ?? defaultPositions
    );
    const [promotion, setPromotion] = useState<string | null>(null);
    const [winner, setWinner] = useState<Color | null>(null);
    const [draw, setDraw] = useState<boolean>(false);
    const [numbers, setNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8].reverse());
    const [letters, setLetters] = useState([
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
    ]);
    const [rotate, setRotate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on("chellange.rejected", (gameId: string) => {
            if (gameId === id) {
                navigate("/");
            }
        });
        socket.on("chellange.accepted", (gameId: string) => {
            if (gameId === id) {
                refetch();
            }
        });
    }, []);

    useEffect(() => {
        console.log({ game });

        if (game?.playerBlackId === profile?.id) {
            setNumbers((prev) => [...prev].reverse());
            setLetters((prev) => [...prev].reverse());
        }
    }, [game]);

    const rotateBoard = () => {
        setNumbers((prev) => [...prev].reverse());
        setLetters((prev) => [...prev].reverse());
        setRotate((prev) => !prev);
    };

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
            legalPromotions: [],
        };
    }, [activeId, draggingId, currentPosition, history]);

    useEffect(() => {
        if (!history.length) return;

        const actions = history.at(-1)?.split("-");

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
        const {
            whiteLegalMoves,
            whiteLegalCaptures,
            blackLegalMoves,
            blackLegalCaptures,
        } = calculateMoves(currentPosition);

        if (history.length % 2 === 0) {
            if (!whiteLegalMoves.length && !whiteLegalCaptures.length) {
                if (isCheck) {
                    setWinner(Color.black);
                } else {
                    setDraw(true);
                }
            }
        } else {
            if (!blackLegalMoves.length && !blackLegalCaptures.length) {
                if (isCheck) {
                    setWinner(Color.white);
                } else {
                    setDraw(true);
                }
            }
        }
    }, [currentPosition]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIllegalMove(false);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [illegalMove]);

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

    const isKingUnderCheck = (mostRecentPosition = currentPosition) => {
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
            blackLegalCaptures.some((item) => whiteKingPosition?.endsWith(item))
        ) {
            setIsCheck(true);
            return true;
        } else {
            setIsCheck(false);
            return false;
        }
    };

    const updatePosition = (
        position: string[],
        activeKey: string,
        overKey: string
    ) => {
        return position.map((item) => {
            if (item.endsWith(activeKey)) {
                const [color, role] = item.split("");
                return `${color}${role}${overKey}`;
            }

            return item;
        });
    };

    const move = (activeKey: string, overKey: string) => {
        if (
            !moves.legalMoves.includes(overKey) &&
            !moves.legalCaptures.includes(overKey) &&
            !moves.legalEnpassent.includes(overKey) &&
            !moves.legalCastles.includes(overKey)
        ) {
            return;
        }

        let newPosition = currentPosition;

        if (moves.legalCaptures.includes(overKey)) {
            newPosition = newPosition.filter((item) => !item.endsWith(overKey));
        }

        let newMove = "";

        if (moves.legalCastles.includes(overKey)) {
            const [overCol] = overKey.split("");
            const [_, __, activeCol, activeRow] = activeKey.split("");
            const rookPosition =
                cols.indexOf(overCol) > cols.indexOf(activeCol)
                    ? `${cols.at(-1)}${activeRow}`
                    : `${cols.at(0)}${activeRow}`;
            const rookTeleportedPosition =
                cols.indexOf(overCol) > cols.indexOf(activeCol)
                    ? `f${activeRow}`
                    : `d${activeRow}`;
            const kingTeleportedPosition =
                cols.indexOf(overCol) > cols.indexOf(activeCol)
                    ? `g${activeRow}`
                    : `c${activeRow}`;

            newPosition = newPosition.map((item) => {
                if (item.endsWith(rookPosition)) {
                    const [color, role] = item.split("");
                    return `${color}${role}${rookTeleportedPosition}`;
                }
                return item;
            });
            newPosition = newPosition.map((item) => {
                if (item === activeKey) {
                    const [color, role] = item.split("");
                    return `${color}${role}${kingTeleportedPosition}`;
                }
                return item;
            });

            newMove += `O-O`;

            if (cols.indexOf(overCol) > cols.indexOf(activeCol)) {
                newMove += "-k";
            } else {
                newMove += "-q";
            }
        } else {
            newPosition = updatePosition(newPosition, activeKey, overKey);

            newMove += `${activeKey}-${overKey}`;

            if (moves.legalPromotions.includes(overKey)) {
                setPromotion(`${activeKey}-${overKey}-p`);
            }
        }

        if (moves.legalCaptures.includes(overKey)) {
            newMove += "-x";
        }

        if (moves.legalEnpassent.includes(overKey)) {
            const [color] = activeKey.split("");
            const [col, row] = overKey.split("");
            newPosition = newPosition.filter(
                (item) =>
                    !item.endsWith(
                        `${col}${Number(row) + (color === "w" ? -1 : 1)}`
                    )
            );
        }

        if (isKingUnderCheck(newPosition)) {
            newMove += "-+";
        }

        if (!moves.legalPromotions.includes(overKey)) {
            setHistory((prev) => [...prev, newMove]);
            setCurrentPosition(newPosition);
        }
        setActiveId(null);
        setDraggingId(null);
    };

    const onDragStart = (e: DragStartEvent) => {
        const key = e.active.id as string;
        const [_, __, col, row] = key.split("");

        if (promotion) return;

        if (activeId && moves.legalCaptures.includes(`${col}${row}`)) {
            move(activeId, `${col}${row}`);

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
            const whiteToMove = history.length % 2 === 0;
            if (
                (whiteToMove && activeKey.startsWith("w")) ||
                (!whiteToMove && activeKey.startsWith("b"))
            ) {
                setIllegalMove(true);
                illegalSound.current?.play();
            }
        }

        move(activeKey, overKey);
    };

    const onSquareClick = (position: string) => {
        setDangerZones([]);

        if (activeId && moves.legalMoves.includes(position)) {
            move(activeId, position);
        }

        setActiveId(null);
        setDraggingId(null);
    };

    const toggleDangerZone = (position: string) => {
        if (dangerZones.includes(position)) {
            setDangerZones((prev) => prev.filter((item) => item !== position));
        } else {
            setDangerZones((prev) => [...prev, position]);
        }
    };

    const onSelectPromotion = (role: Role) => {
        if (!promotion) return;

        const [from, to] = promotion.split("-");

        let newMove = `${from}-${to}`;
        let newPosition = currentPosition;

        if (newPosition.some((item) => item.endsWith(to))) {
            newPosition = newPosition.filter((item) => !item.endsWith(to));
            newMove += "-x";
        }

        const [color] = from.split("");
        const roleKey = pieceImageKeys.roles[role];
        newPosition = newPosition.map((item) =>
            item === from ? `${color}${roleKey}${to}` : item
        );
        newMove += `-p-${roleKey}`;

        if (isKingUnderCheck(newPosition)) {
            newMove += "-+";
        }

        setCurrentPosition(newPosition);
        setHistory((prev) => [...prev, newMove]);
        setPromotion(null);
    };

    const onRejectPromotion = () => {
        setPromotion(null);
    };

    if (isLoading || gameLoading) return <Loading />;
    if (isFetched && !game) return <Navigate to="/" />;

    return (
        <div
            className={clsx(
                "h-full w-full flex-1 flex justify-between gap-3",
                rotate ? "flex-col-reverse" : "flex-col"
            )}
        >
            <UserIndicator
                user={
                    game?.playerWhiteId === profile?.id
                        ? game?.playerBlack
                        : game?.playerWhite
                }
                color={
                    game?.playerWhiteId === profile?.id
                        ? Color.black
                        : Color.white
                }
                time="10:00"
            />
            <div className="flex gap-2">
                <DndContext
                    modifiers={[centerCursor]}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                >
                    <div className="relative grid grid-cols-1 rounded-md overflow-hidden w-200 h-200 aspect-square select-none!">
                        {numbers.reverse().map((row) => (
                            <div
                                key={`row-${row}`}
                                className="grid grid-cols-8"
                            >
                                {letters.map((col) => {
                                    const position = `${col}${row}`;

                                    return (
                                        <Droppable
                                            key={`col-${col}`}
                                            id={position}
                                        >
                                            <div
                                                onClick={() =>
                                                    onSquareClick(position)
                                                }
                                                onContextMenu={(e) => {
                                                    e.preventDefault();
                                                    toggleDangerZone(position);
                                                }}
                                                className={clsx(
                                                    "aspect-square w-full h-full relative flex items-center justify-center",
                                                    getBgColor(position),
                                                    getActiveBgColor(
                                                        position,
                                                        activeId,
                                                        draggingId
                                                    ),
                                                    getDangerZoneColor(
                                                        position,
                                                        dangerZones
                                                    ),
                                                    getIllegalBgColor(
                                                        illegalMove,
                                                        position,
                                                        history,
                                                        currentPosition
                                                    )
                                                )}
                                            >
                                                {letters[0] === col && (
                                                    <Numbers
                                                        position={position}
                                                    />
                                                )}
                                                {numbers[numbers.length - 1] ===
                                                    Number(row) && (
                                                    <Letters
                                                        position={position}
                                                    />
                                                )}
                                                {!promotion
                                                    ?.split("-")?.[0]
                                                    .endsWith(position) && (
                                                    <Piece
                                                        position={position}
                                                        currentPosition={
                                                            currentPosition
                                                        }
                                                    />
                                                )}
                                                <Moves
                                                    position={position}
                                                    legalMoves={
                                                        moves.legalMoves
                                                    }
                                                />
                                                <Captures
                                                    position={position}
                                                    legalCaptures={
                                                        moves.legalCaptures
                                                    }
                                                />
                                                {promotion?.split("-")?.[1] ===
                                                    position && (
                                                    <Promotion
                                                        color={
                                                            history.length %
                                                                2 ===
                                                            0
                                                                ? "w"
                                                                : "b"
                                                        }
                                                        onSelect={
                                                            onSelectPromotion
                                                        }
                                                        onReject={
                                                            onRejectPromotion
                                                        }
                                                    />
                                                )}
                                                <GameStatus
                                                    winner={winner}
                                                    draw={draw}
                                                    currentPosition={
                                                        currentPosition
                                                    }
                                                    position={position}
                                                />
                                            </div>
                                        </Droppable>
                                    );
                                })}
                            </div>
                        ))}
                        <GameStatusModal winner={winner} draw={draw} />
                    </div>
                </DndContext>
                <div>
                    <button onClick={rotateBoard} className="cursor-pointer">
                        <RotateCwSquare />
                    </button>
                </div>
            </div>
            <UserIndicator
                color={
                    game?.playerWhiteId === profile?.id
                        ? Color.white
                        : Color.black
                }
                user={profile}
                time="10:00"
            />

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
