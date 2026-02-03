export const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const next = (col: string, step = 1) => {
    const index = cols.indexOf(col);
    return cols[index + step];
};

export const prev = (col: string, step = 1) => {
    const index = cols.indexOf(col);
    return cols[index - step];
};

const isStillCheck = (
    currentPosition: string[],
    piece: string,
    newPosition: string,
    history: string[]
) => {
    const [color, role] = piece.split("");

    let updatedPosition = currentPosition;
    if (updatedPosition.some((item) => item.endsWith(newPosition))) {
        updatedPosition = updatedPosition.filter(
            (item) => !item.endsWith(newPosition)
        );
    }
    updatedPosition = updatedPosition.map((item) =>
        item === piece ? `${color}${role}${newPosition}` : item
    );
    const kingPosition = updatedPosition.find((item) =>
        item.startsWith(color === "w" ? "wk" : "bk")
    );
    const pieces = updatedPosition.filter((item) =>
        item.startsWith(color === "w" ? "b" : "w")
    );
    const stillCheck = pieces.some((item) => {
        const { legalCaptures } = getLegalMoves(
            item,
            updatedPosition,
            history,
            true
        );

        return legalCaptures.some((i) => kingPosition?.endsWith(i));
    });

    return stillCheck;
};

export function getLegalMoves(
    piece: string,
    currentPosition: string[],
    history: string[],
    skipCheckValidation = false
): {
    legalMoves: string[];
    legalCaptures: string[];
    legalEnpassent: string[];
    legalCastles: string[];
    legalPromotions: string[];
} {
    const [color, role, col, row] = piece.split("");
    const legalMoves: string[] = [];
    const legalCaptures: string[] = [];
    const legalEnpassent: string[] = [];
    const legalCastles: string[] = [];
    const legalPromotions: string[] = [];

    const lastMove = history.at(-1);

    if (role === "p") {
        if (Number(row) !== (color === "w" ? 8 : 1)) {
            const upOne = `${col}${Number(row) + (color === "w" ? 1 : -1)}`;
            const upTwo = `${col}${Number(row) + (color === "w" ? 2 : -2)}`;
            const upRight = `${next(col)}${Number(row) + (color === "w" ? 1 : -1)}`;
            const upLeft = `${prev(col)}${Number(row) + (color === "w" ? 1 : -1)}`;

            if (!currentPosition.some((item) => item.endsWith(upOne))) {
                if (
                    skipCheckValidation ||
                    !isStillCheck(currentPosition, piece, upOne, history)
                ) {
                    legalMoves.push(upOne);

                    if (upOne.endsWith(color === "w" ? "8" : "1")) {
                        legalPromotions.push(upOne);
                    }
                }
            }

            if (
                Number(row) === (color === "w" ? 2 : 7) &&
                !currentPosition.some((item) => item.endsWith(upOne)) &&
                !currentPosition.some((item) => item.endsWith(upTwo))
            ) {
                if (
                    skipCheckValidation ||
                    !isStillCheck(currentPosition, piece, upTwo, history)
                ) {
                    legalMoves.push(upTwo);
                }
            }

            if (
                currentPosition.some(
                    (item) => item.endsWith(upRight) && !item.startsWith(color)
                )
            ) {
                if (
                    skipCheckValidation ||
                    !isStillCheck(currentPosition, piece, upRight, history)
                ) {
                    legalCaptures.push(upRight);

                    if (upRight.endsWith(color === "w" ? "8" : "1")) {
                        legalPromotions.push(upRight);
                    }
                }
            }

            if (
                currentPosition.some(
                    (item) => item.endsWith(upLeft) && !item.startsWith(color)
                )
            ) {
                if (
                    skipCheckValidation ||
                    !isStillCheck(currentPosition, piece, upLeft, history)
                ) {
                    legalCaptures.push(upLeft);

                    if (upLeft.endsWith(color === "w" ? "8" : "1")) {
                        legalPromotions.push(upLeft);
                    }
                }
            }
        }

        if (lastMove) {
            const [fromPiece, to] = lastMove.split("-");
            const [fromColor, fromRole, _, fromRow] = fromPiece.split("");
            const [toCol, toRow] = to.split("");

            if (
                fromColor !== color &&
                fromRole === "p" &&
                toRow === row &&
                Math.abs(cols.indexOf(toCol) - cols.indexOf(col)) === 1 &&
                Math.abs(Number(fromRow) - Number(toRow)) === 2
            ) {
                const position = `${toCol}${Number(row) + (color === "w" ? 1 : -1)}`;

                if (
                    skipCheckValidation ||
                    !isStillCheck(currentPosition, piece, position, history)
                ) {
                    legalEnpassent.push(position);
                    legalCaptures.push(position);
                }
            }
        }
    }

    if (role === "n") {
        const upRight = `${next(col, 1)}${Number(row) + 2}`;
        const upLeft = `${prev(col, 1)}${Number(row) + 2}`;
        const rightUp = `${next(col, 2)}${Number(row) + 1}`;
        const rightDown = `${next(col, 2)}${Number(row) - 1}`;
        const leftUp = `${prev(col, 2)}${Number(row) + 1}`;
        const leftDown = `${prev(col, 2)}${Number(row) - 1}`;
        const downRight = `${next(col, 1)}${Number(row) - 2}`;
        const downLeft = `${prev(col, 1)}${Number(row) - 2}`;

        if (Number(row) + 2 <= 8 && prev(col, 1)) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, upLeft, history)
            ) {
                if (!currentPosition.some((item) => item.endsWith(upLeft))) {
                    legalMoves.push(upLeft);
                } else {
                    if (
                        currentPosition.some(
                            (item) =>
                                item.startsWith(color === "w" ? "b" : "w") &&
                                item.endsWith(upLeft)
                        )
                    ) {
                        legalCaptures.push(upLeft);
                    }
                }
            }
        }

        if (Number(row) + 2 <= 8 && next(col, 1)) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, upRight, history)
            ) {
                if (!currentPosition.some((item) => item.endsWith(upRight))) {
                    legalMoves.push(upRight);
                } else {
                    if (
                        currentPosition.some(
                            (item) =>
                                item.startsWith(color === "w" ? "b" : "w") &&
                                item.endsWith(upRight)
                        )
                    ) {
                        legalCaptures.push(upRight);
                    }
                }
            }
        }

        if (Number(row) - 2 >= 1 && prev(col, 1)) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, downLeft, history)
            ) {
                if (!currentPosition.some((item) => item.endsWith(downLeft))) {
                    legalMoves.push(downLeft);
                } else {
                    if (
                        currentPosition.some(
                            (item) =>
                                item.startsWith(color === "w" ? "b" : "w") &&
                                item.endsWith(downLeft)
                        )
                    ) {
                        legalCaptures.push(downLeft);
                    }
                }
            }
        }

        if (Number(row) - 2 >= 1 && next(col, 1)) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, downRight, history)
            ) {
                if (!currentPosition.some((item) => item.endsWith(downRight))) {
                    legalMoves.push(downRight);
                } else {
                    if (
                        currentPosition.some(
                            (item) =>
                                item.startsWith(color === "w" ? "b" : "w") &&
                                item.endsWith(downRight)
                        )
                    ) {
                        legalCaptures.push(downRight);
                    }
                }
            }
        }

        if (Number(row) + 1 <= 8 && prev(col, 2)) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, leftUp, history)
            ) {
                if (!currentPosition.some((item) => item.endsWith(leftUp))) {
                    legalMoves.push(leftUp);
                } else {
                    if (
                        currentPosition.some(
                            (item) =>
                                item.startsWith(color === "w" ? "b" : "w") &&
                                item.endsWith(leftUp)
                        )
                    ) {
                        legalCaptures.push(leftUp);
                    }
                }
            }
        }

        if (Number(row) - 1 >= 1 && prev(col, 2)) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, leftDown, history)
            ) {
                if (!currentPosition.some((item) => item.endsWith(leftDown))) {
                    legalMoves.push(leftDown);
                } else {
                    if (
                        currentPosition.some(
                            (item) =>
                                item.startsWith(color === "w" ? "b" : "w") &&
                                item.endsWith(leftDown)
                        )
                    ) {
                        legalCaptures.push(leftDown);
                    }
                }
            }
        }

        if (Number(row) + 1 <= 8 && next(col, 2)) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, rightUp, history)
            ) {
                if (!currentPosition.some((item) => item.endsWith(rightUp))) {
                    legalMoves.push(rightUp);
                } else {
                    if (
                        currentPosition.some(
                            (item) =>
                                item.startsWith(color === "w" ? "b" : "w") &&
                                item.endsWith(rightUp)
                        )
                    ) {
                        legalCaptures.push(rightUp);
                    }
                }
            }
        }

        if (Number(row) - 1 >= 1 && next(col, 2)) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, rightDown, history)
            ) {
                if (!currentPosition.some((item) => item.endsWith(rightDown))) {
                    legalMoves.push(rightDown);
                } else {
                    if (
                        currentPosition.some(
                            (item) =>
                                item.startsWith(color === "w" ? "b" : "w") &&
                                item.endsWith(rightDown)
                        )
                    ) {
                        legalCaptures.push(rightDown);
                    }
                }
            }
        }
    }

    if (role === "r") {
        for (let i = Number(row) + 1; i <= 8; i++) {
            const position = `${col}${i}`;

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }

        for (let i = Number(row) - 1; i >= 1; i--) {
            const position = `${col}${i}`;

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }

        for (let i = cols.indexOf(col) + 1; i < 8; i++) {
            const position = `${cols[i]}${row}`;

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }

        for (let i = cols.indexOf(col) + 1; i < 8; i++) {
            const position = `${cols[i]}${row}`;

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }

        for (let i = cols.indexOf(col) - 1; i >= 0; i--) {
            const position = `${cols[i]}${row}`;

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }
    }

    if (role === "b") {
        const colIndex = cols.indexOf(col);

        for (let i = 1; i <= 8 - colIndex; i++) {
            const position = `${cols[colIndex + i]}${Number(row) + i}`;

            if (Number(row) + i > 8) {
                break;
            }

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }

        for (let i = 1; i <= 8 - colIndex; i++) {
            const position = `${cols[colIndex + i]}${Number(row) - i}`;

            if (Number(row) - i < 1) {
                break;
            }

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }

        for (let i = colIndex - 1; i >= 0; i--) {
            const position = `${cols[i]}${Number(row) - (colIndex - i)}`;

            if (Number(row) - (colIndex - i) < 1) {
                break;
            }

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }

        for (let i = colIndex - 1; i >= 0; i--) {
            const position = `${cols[i]}${Number(row) + (colIndex - i)}`;

            if (Number(row) + (colIndex - i) > 8) {
                break;
            }

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }
    }

    if (role === "q") {
        for (let i = Number(row) + 1; i <= 8; i++) {
            const position = `${col}${i}`;

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }

        for (let i = Number(row) - 1; i >= 1; i--) {
            const position = `${col}${i}`;

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }

        for (let i = cols.indexOf(col) + 1; i < 8; i++) {
            const position = `${cols[i]}${row}`;

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }

        for (let i = cols.indexOf(col) + 1; i < 8; i++) {
            const position = `${cols[i]}${row}`;

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }

        for (let i = cols.indexOf(col) - 1; i >= 0; i--) {
            const position = `${cols[i]}${row}`;

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }

        const colIndex = cols.indexOf(col);

        for (let i = 1; i <= 8 - colIndex; i++) {
            const position = `${cols[colIndex + i]}${Number(row) + i}`;

            if (Number(row) + i > 8) {
                break;
            }

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }

        for (let i = 1; i <= 8 - colIndex; i++) {
            const position = `${cols[colIndex + i]}${Number(row) - i}`;

            if (Number(row) - i < 1) {
                break;
            }

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }

        for (let i = colIndex - 1; i >= 0; i--) {
            const position = `${cols[i]}${Number(row) - (colIndex - i)}`;

            if (Number(row) - (colIndex - i) < 1) {
                break;
            }

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }

        for (let i = colIndex - 1; i >= 0; i--) {
            const position = `${cols[i]}${Number(row) + (colIndex - i)}`;

            if (Number(row) + (colIndex - i) > 8) {
                break;
            }

            if (currentPosition.some((item) => item.endsWith(position))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(position)
                    )
                ) {
                    if (
                        skipCheckValidation ||
                        !isStillCheck(currentPosition, piece, position, history)
                    ) {
                        legalCaptures.push(position);
                    }
                }
                break;
            }

            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, position, history)
            ) {
                legalMoves.push(position);
            }
        }
    }

    if (role === "k") {
        const up = `${col}${Number(row) + 1}`;
        const down = `${col}${Number(row) - 1}`;
        const right = `${next(col, 1)}${row}`;
        const left = `${prev(col, 1)}${row}`;
        const upRight = `${next(col, 1)}${Number(row) + 1}`;
        const upLeft = `${prev(col, 1)}${Number(row) + 1}`;
        const downRight = `${next(col, 1)}${Number(row) - 1}`;
        const downLeft = `${prev(col, 1)}${Number(row) - 1}`;

        if (
            Number(row) < 8 &&
            !currentPosition.some((item) => item.endsWith(up))
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, up, history)
            ) {
                legalMoves.push(up);
            }
        }

        if (
            Number(row) < 8 &&
            currentPosition.some(
                (item) =>
                    item.startsWith(color === "w" ? "b" : "w") &&
                    item.endsWith(up)
            )
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, up, history)
            ) {
                legalCaptures.push(up);
            }
        }

        if (
            next(col, 1) &&
            Number(row) < 8 &&
            !currentPosition.some((item) => item.endsWith(upRight))
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, upRight, history)
            ) {
                legalMoves.push(upRight);
            }
        }

        if (
            next(col, 1) &&
            Number(row) < 8 &&
            currentPosition.some(
                (item) =>
                    item.startsWith(color === "w" ? "b" : "w") &&
                    item.endsWith(upRight)
            )
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, upRight, history)
            ) {
                legalCaptures.push(upRight);
            }
        }

        if (
            prev(col, 1) &&
            Number(row) < 8 &&
            !currentPosition.some((item) => item.endsWith(upLeft))
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, upLeft, history)
            ) {
                legalMoves.push(upLeft);
            }
        }

        if (
            prev(col, 1) &&
            Number(row) < 8 &&
            currentPosition.some(
                (item) =>
                    item.startsWith(color === "w" ? "b" : "w") &&
                    item.endsWith(upLeft)
            )
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, upLeft, history)
            ) {
                legalCaptures.push(upLeft);
            }
        }

        if (
            Number(row) > 1 &&
            !currentPosition.some((item) => item.endsWith(down))
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, down, history)
            ) {
                legalMoves.push(down);
            }
        }

        if (
            Number(row) > 1 &&
            currentPosition.some(
                (item) =>
                    item.startsWith(color === "w" ? "b" : "w") &&
                    item.endsWith(down)
            )
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, down, history)
            ) {
                legalCaptures.push(down);
            }
        }

        if (
            next(col, 1) &&
            Number(row) > 1 &&
            !currentPosition.some((item) => item.endsWith(downRight))
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, downRight, history)
            ) {
                legalMoves.push(downRight);
            }
        }

        if (
            next(col, 1) &&
            Number(row) > 1 &&
            currentPosition.some(
                (item) =>
                    item.startsWith(color === "w" ? "b" : "w") &&
                    item.endsWith(downRight)
            )
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, downRight, history)
            ) {
                legalCaptures.push(downRight);
            }
        }

        if (
            prev(col, 1) &&
            Number(row) > 1 &&
            !currentPosition.some((item) => item.endsWith(downLeft))
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, downLeft, history)
            ) {
                legalMoves.push(downLeft);
            }
        }

        if (
            prev(col, 1) &&
            Number(row) > 1 &&
            currentPosition.some(
                (item) =>
                    item.startsWith(color === "w" ? "b" : "w") &&
                    item.endsWith(downLeft)
            )
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, downLeft, history)
            ) {
                legalCaptures.push(downLeft);
            }
        }

        if (
            next(col, 1) &&
            !currentPosition.some((item) => item.endsWith(right))
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, right, history)
            ) {
                legalMoves.push(right);
            }
        }

        if (
            next(col, 1) &&
            currentPosition.some(
                (item) =>
                    item.startsWith(color === "w" ? "b" : "w") &&
                    item.endsWith(right)
            )
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, right, history)
            ) {
                legalCaptures.push(right);
            }
        }

        if (
            prev(col, 1) &&
            !currentPosition.some((item) => item.endsWith(left))
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, left, history)
            ) {
                legalMoves.push(left);
            }
        }

        if (
            prev(col, 1) &&
            currentPosition.some(
                (item) =>
                    item.startsWith(color === "w" ? "b" : "w") &&
                    item.endsWith(left)
            )
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(currentPosition, piece, left, history)
            ) {
                legalCaptures.push(left);
            }
        }

        const doesKingMoved = history.some((item) =>
            item.startsWith(color === "w" ? "wk" : "bk")
        );
        const doesKingSideRookMoved = history.some((item) =>
            item.startsWith(color === "w" ? "wrh1" : "brh8")
        );
        const doesQueenSideRookMoved = history.some((item) =>
            item.startsWith(color === "w" ? "wra1" : "bra8")
        );

        const rightOne = `${next(col, 1)}${row}`;
        const rightTwo = `${next(col, 2)}${row}`;
        const rightThree = `${next(col, 3)}${row}`;
        const leftOne = `${prev(col, 1)}${row}`;
        const leftTwo = `${prev(col, 2)}${row}`;
        const leftThree = `${prev(col, 3)}${row}`;
        const leftFour = `${prev(col, 4)}${row}`;

        if (
            !doesKingMoved &&
            !doesKingSideRookMoved &&
            !currentPosition.some((item) => item.endsWith(rightOne)) &&
            !currentPosition.some((item) => item.endsWith(rightTwo))
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(
                    currentPosition.map((item) =>
                        item === (color === "w" ? "wrh1" : "brh8")
                            ? color === "w"
                                ? "wrf1"
                                : "brf8"
                            : item
                    ),
                    piece,
                    rightTwo,
                    history
                )
            ) {
                legalMoves.push(rightTwo);
                legalCastles.push(rightTwo);
                legalCastles.push(rightThree);
            }
        }

        if (
            !doesKingMoved &&
            !doesQueenSideRookMoved &&
            !currentPosition.some((item) => item.endsWith(leftOne)) &&
            !currentPosition.some((item) => item.endsWith(leftTwo)) &&
            !currentPosition.some((item) => item.endsWith(leftThree))
        ) {
            if (
                skipCheckValidation ||
                !isStillCheck(
                    currentPosition.map((item) =>
                        item === (color === "w" ? "wra1" : "bra8")
                            ? color === "w"
                                ? "wrd1"
                                : "brd8"
                            : item
                    ),
                    piece,
                    leftTwo,
                    history
                )
            ) {
                legalMoves.push(leftTwo);
                legalCastles.push(leftTwo);
                legalCastles.push(leftThree);
                legalCastles.push(leftFour);
            }
        }
    }

    return {
        legalMoves,
        legalCaptures,
        legalEnpassent,
        legalCastles,
        legalPromotions,
    };
}
