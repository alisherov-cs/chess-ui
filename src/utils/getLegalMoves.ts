export const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const next = (col: string, step = 1) => {
    const index = cols.indexOf(col);
    return cols[index + step];
};

export const prev = (col: string, step = 1) => {
    const index = cols.indexOf(col);
    return cols[index - step];
};

export const getLegalMoves = (
    piece: string,
    currentPosition: string[],
    history: string[]
): {
    legalMoves: string[];
    legalCaptures: string[];
    legalEnpassent: string[];
    legalCastles: string[];
} => {
    const [color, role, col, row] = piece.split("");
    const legalMoves: string[] = [];
    const legalCaptures: string[] = [];
    const legalEnpassent: string[] = [];
    const legalCastles: string[] = [];

    const lastMove = history.at(-1);

    if (color === "w") {
        if (role === "p") {
            if (Number(row) !== 8) {
                if (
                    !currentPosition.some((item) =>
                        item.endsWith(`${col}${Number(row) + 1}`)
                    )
                ) {
                    const kingPosition = currentPosition.find((item) =>
                        item.startsWith("wk")
                    );
                    const newPosition = currentPosition.map((item) =>
                        item === piece ? `wp${col}${Number(row) + 1}` : item
                    );
                    const blackPieces = newPosition.filter((item) =>
                        item.startsWith("b")
                    );
                    const stillCheck = blackPieces.some((item) => {
                        const { legalCaptures } = getLegalMoves(
                            item,
                            newPosition,
                            history
                        );

                        return legalCaptures.some((i) =>
                            kingPosition?.endsWith(i)
                        );
                    });
                    if (!stillCheck) {
                        legalMoves.push(`${col}${Number(row) + 1}`);
                    }
                }

                if (
                    legalMoves.length &&
                    Number(row) === 2 &&
                    !currentPosition.some((item) =>
                        item.endsWith(`${col}${Number(row) + 2}`)
                    )
                ) {
                    const kingPosition = currentPosition.find((item) =>
                        item.startsWith("wk")
                    );
                    const newPosition = currentPosition.map((item) =>
                        item === piece ? `wp${col}${Number(row) + 2}` : item
                    );
                    const blackPieces = newPosition.filter((item) =>
                        item.startsWith("b")
                    );
                    const stillCheck = blackPieces.some((item) => {
                        const { legalCaptures } = getLegalMoves(
                            item,
                            newPosition,
                            history
                        );

                        return legalCaptures.some((i) =>
                            kingPosition?.endsWith(i)
                        );
                    });
                    if (!stillCheck) {
                        legalMoves.push(`${col}${Number(row) + 2}`);
                    }
                }

                if (
                    next(col, 1) &&
                    currentPosition.some(
                        (item) =>
                            item.startsWith("b") &&
                            item.endsWith(`${next(col, 1)}${Number(row) + 1}`)
                    )
                ) {
                    const kingPosition = currentPosition.find((item) =>
                        item.startsWith("wk")
                    );
                    const newPosition = currentPosition
                        .filter(
                            (item) =>
                                !item.endsWith(
                                    `${next(col, 1)}${Number(row) + 1}`
                                )
                        )
                        .map((item) =>
                            item === piece
                                ? `wp${next(col, 1)}${Number(row) + 1}`
                                : item
                        );
                    const blackPieces = newPosition.filter((item) =>
                        item.startsWith("b")
                    );
                    const stillCheck = blackPieces.some((item) => {
                        const { legalCaptures } = getLegalMoves(
                            item,
                            newPosition,
                            history
                        );

                        return legalCaptures.some((i) =>
                            kingPosition?.endsWith(i)
                        );
                    });
                    if (!stillCheck) {
                        legalCaptures.push(`${next(col, 1)}${Number(row) + 1}`);
                    }
                }

                if (
                    prev(col, 1) &&
                    currentPosition.some(
                        (item) =>
                            item.startsWith("b") &&
                            item.endsWith(`${prev(col, 1)}${Number(row) + 1}`)
                    )
                ) {
                    legalCaptures.push(`${prev(col, 1)}${Number(row) + 1}`);
                }
            }
        }
    }

    if (color === "b") {
        if (role === "p") {
            if (Number(row) !== 1) {
                if (
                    !currentPosition.some((item) =>
                        item.endsWith(`${col}${Number(row) - 1}`)
                    )
                ) {
                    legalMoves.push(`${col}${Number(row) - 1}`);
                }

                if (
                    legalMoves.length &&
                    Number(row) === 7 &&
                    !currentPosition.some((item) =>
                        item.endsWith(`${col}${Number(row) - 2}`)
                    )
                ) {
                    legalMoves.push(`${col}${Number(row) - 2}`);
                }

                if (
                    next(col, 1) &&
                    currentPosition.some(
                        (item) =>
                            item.startsWith("w") &&
                            item.endsWith(`${next(col, 1)}${Number(row) - 1}`)
                    )
                ) {
                    legalCaptures.push(`${next(col, 1)}${Number(row) - 1}`);
                }

                if (
                    prev(col, 1) &&
                    currentPosition.some(
                        (item) =>
                            item.startsWith("w") &&
                            item.endsWith(`${prev(col, 1)}${Number(row) - 1}`)
                    )
                ) {
                    legalCaptures.push(`${prev(col, 1)}${Number(row) - 1}`);
                }
            }
        }
    }

    if (role === "p") {
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
                legalEnpassent.push(
                    `${toCol}${Number(row) + (color === "w" ? 1 : -1)}`
                );
                legalCaptures.push(
                    `${toCol}${Number(row) + (color === "w" ? 1 : -1)}`
                );
            }
        }
    }

    if (role === "n") {
        if (Number(row) + 2 <= 8 && prev(col, 1)) {
            if (
                !currentPosition.some((item) =>
                    item.endsWith(`${prev(col, 1)}${Number(row) + 2}`)
                )
            ) {
                legalMoves.push(`${prev(col, 1)}${Number(row) + 2}`);
            } else {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${prev(col, 1)}${Number(row) + 2}`)
                    )
                ) {
                    legalCaptures.push(`${prev(col, 1)}${Number(row) + 2}`);
                }
            }
        }

        if (Number(row) + 2 <= 8 && next(col, 1)) {
            if (
                !currentPosition.some((item) =>
                    item.endsWith(`${next(col, 1)}${Number(row) + 2}`)
                )
            ) {
                legalMoves.push(`${next(col, 1)}${Number(row) + 2}`);
            } else {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${next(col, 1)}${Number(row) + 2}`)
                    )
                ) {
                    legalCaptures.push(`${next(col, 1)}${Number(row) + 2}`);
                }
            }
        }

        if (Number(row) - 2 >= 1 && prev(col, 1)) {
            if (
                !currentPosition.some((item) =>
                    item.endsWith(`${prev(col, 1)}${Number(row) - 2}`)
                )
            ) {
                legalMoves.push(`${prev(col, 1)}${Number(row) - 2}`);
            } else {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${prev(col, 1)}${Number(row) - 2}`)
                    )
                ) {
                    legalCaptures.push(`${prev(col, 1)}${Number(row) - 2}`);
                }
            }
        }

        if (Number(row) - 2 >= 1 && next(col, 1)) {
            if (
                !currentPosition.some((item) =>
                    item.endsWith(`${next(col, 1)}${Number(row) - 2}`)
                )
            ) {
                legalMoves.push(`${next(col, 1)}${Number(row) - 2}`);
            } else {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${next(col, 1)}${Number(row) - 2}`)
                    )
                ) {
                    legalCaptures.push(`${next(col, 1)}${Number(row) - 2}`);
                }
            }
        }

        if (Number(row) + 1 <= 8 && prev(col, 2)) {
            if (
                !currentPosition.some((item) =>
                    item.endsWith(`${prev(col, 2)}${Number(row) + 1}`)
                )
            ) {
                legalMoves.push(`${prev(col, 2)}${Number(row) + 1}`);
            } else {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${prev(col, 2)}${Number(row) + 1}`)
                    )
                ) {
                    legalCaptures.push(`${prev(col, 2)}${Number(row) + 1}`);
                }
            }
        }

        if (Number(row) - 1 >= 1 && prev(col, 2)) {
            if (
                !currentPosition.some((item) =>
                    item.endsWith(`${prev(col, 2)}${Number(row) - 1}`)
                )
            ) {
                legalMoves.push(`${prev(col, 2)}${Number(row) - 1}`);
            } else {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${prev(col, 2)}${Number(row) - 1}`)
                    )
                ) {
                    legalCaptures.push(`${prev(col, 2)}${Number(row) - 1}`);
                }
            }
        }

        if (Number(row) + 1 <= 8 && next(col, 2)) {
            if (
                !currentPosition.some((item) =>
                    item.endsWith(`${next(col, 2)}${Number(row) + 1}`)
                )
            ) {
                legalMoves.push(`${next(col, 2)}${Number(row) + 1}`);
            } else {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${next(col, 2)}${Number(row) + 1}`)
                    )
                ) {
                    legalCaptures.push(`${next(col, 2)}${Number(row) + 1}`);
                }
            }
        }

        if (Number(row) - 1 >= 1 && next(col, 2)) {
            if (
                !currentPosition.some((item) =>
                    item.endsWith(`${next(col, 2)}${Number(row) - 1}`)
                )
            ) {
                legalMoves.push(`${next(col, 2)}${Number(row) - 1}`);
            } else {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${next(col, 2)}${Number(row) - 1}`)
                    )
                ) {
                    legalCaptures.push(`${next(col, 2)}${Number(row) - 1}`);
                }
            }
        }
    }

    if (role === "r") {
        for (let i = Number(row) + 1; i <= 8; i++) {
            if (currentPosition.some((item) => item.endsWith(`${col}${i}`))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${col}${i}`)
                    )
                ) {
                    legalCaptures.push(`${col}${i}`);
                }
                break;
            }

            legalMoves.push(`${col}${i}`);
        }

        for (let i = Number(row) - 1; i >= 1; i--) {
            if (currentPosition.some((item) => item.endsWith(`${col}${i}`))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${col}${i}`)
                    )
                ) {
                    legalCaptures.push(`${col}${i}`);
                }
                break;
            }

            legalMoves.push(`${col}${i}`);
        }

        for (let i = cols.indexOf(col) + 1; i < 8; i++) {
            if (
                currentPosition.some((item) =>
                    item.endsWith(`${cols[i]}${row}`)
                )
            ) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${cols[i]}${row}`)
                    )
                ) {
                    legalCaptures.push(`${cols[i]}${row}`);
                }
                break;
            }

            legalMoves.push(`${cols[i]}${row}`);
        }

        for (let i = cols.indexOf(col) + 1; i < 8; i++) {
            if (
                currentPosition.some((item) =>
                    item.endsWith(`${cols[i]}${row}`)
                )
            ) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${cols[i]}${row}`)
                    )
                ) {
                    legalCaptures.push(`${cols[i]}${row}`);
                }
                break;
            }

            legalMoves.push(`${cols[i]}${row}`);
        }

        for (let i = cols.indexOf(col) - 1; i >= 0; i--) {
            if (
                currentPosition.some((item) =>
                    item.endsWith(`${cols[i]}${row}`)
                )
            ) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${cols[i]}${row}`)
                    )
                ) {
                    legalCaptures.push(`${cols[i]}${row}`);
                }
                break;
            }

            legalMoves.push(`${cols[i]}${row}`);
        }
    }

    if (role === "b") {
        const colIndex = cols.indexOf(col);

        for (let i = 1; i <= 8 - colIndex; i++) {
            if (Number(row) + i > 8) {
                break;
            }

            if (
                currentPosition.some((item) =>
                    item.endsWith(`${cols[colIndex + i]}${Number(row) + i}`)
                )
            ) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(
                                `${cols[colIndex + i]}${Number(row) + i}`
                            )
                    )
                ) {
                    legalCaptures.push(
                        `${cols[colIndex + i]}${Number(row) + i}`
                    );
                }
                break;
            }

            legalMoves.push(`${cols[colIndex + i]}${Number(row) + i}`);
        }

        for (let i = 1; i <= 8 - colIndex; i++) {
            if (Number(row) - i < 1) {
                break;
            }

            if (
                currentPosition.some((item) =>
                    item.endsWith(`${cols[colIndex + i]}${Number(row) - i}`)
                )
            ) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(
                                `${cols[colIndex + i]}${Number(row) - i}`
                            )
                    )
                ) {
                    legalCaptures.push(
                        `${cols[colIndex + i]}${Number(row) - i}`
                    );
                }
                break;
            }

            legalMoves.push(`${cols[colIndex + i]}${Number(row) - i}`);
        }

        for (let i = colIndex - 1; i >= 0; i--) {
            if (Number(row) - (colIndex - i) < 1) {
                break;
            }

            if (
                currentPosition.some((item) =>
                    item.endsWith(`${cols[i]}${Number(row) - (colIndex - i)}`)
                )
            ) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(
                                `${cols[i]}${Number(row) - (colIndex - i)}`
                            )
                    )
                ) {
                    legalCaptures.push(
                        `${cols[i]}${Number(row) - (colIndex - i)}`
                    );
                }
                break;
            }

            legalMoves.push(`${cols[i]}${Number(row) - (colIndex - i)}`);
        }

        for (let i = colIndex - 1; i >= 0; i--) {
            if (Number(row) + (colIndex - i) > 8) {
                break;
            }

            if (
                currentPosition.some((item) =>
                    item.endsWith(`${cols[i]}${Number(row) + (colIndex - i)}`)
                )
            ) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(
                                `${cols[i]}${Number(row) + (colIndex - i)}`
                            )
                    )
                ) {
                    legalCaptures.push(
                        `${cols[i]}${Number(row) + (colIndex - i)}`
                    );
                }
                break;
            }

            legalMoves.push(`${cols[i]}${Number(row) + (colIndex - i)}`);
        }
    }

    if (role === "q") {
        for (let i = Number(row) + 1; i <= 8; i++) {
            if (currentPosition.some((item) => item.endsWith(`${col}${i}`))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${col}${i}`)
                    )
                ) {
                    legalCaptures.push(`${col}${i}`);
                }
                break;
            }

            legalMoves.push(`${col}${i}`);
        }

        for (let i = Number(row) - 1; i >= 1; i--) {
            if (currentPosition.some((item) => item.endsWith(`${col}${i}`))) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${col}${i}`)
                    )
                ) {
                    legalCaptures.push(`${col}${i}`);
                }
                break;
            }

            legalMoves.push(`${col}${i}`);
        }

        for (let i = cols.indexOf(col) + 1; i < 8; i++) {
            if (
                currentPosition.some((item) =>
                    item.endsWith(`${cols[i]}${row}`)
                )
            ) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${cols[i]}${row}`)
                    )
                ) {
                    legalCaptures.push(`${cols[i]}${row}`);
                }
                break;
            }

            legalMoves.push(`${cols[i]}${row}`);
        }

        for (let i = cols.indexOf(col) + 1; i < 8; i++) {
            if (
                currentPosition.some((item) =>
                    item.endsWith(`${cols[i]}${row}`)
                )
            ) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${cols[i]}${row}`)
                    )
                ) {
                    legalCaptures.push(`${cols[i]}${row}`);
                }
                break;
            }

            legalMoves.push(`${cols[i]}${row}`);
        }

        for (let i = cols.indexOf(col) - 1; i >= 0; i--) {
            if (
                currentPosition.some((item) =>
                    item.endsWith(`${cols[i]}${row}`)
                )
            ) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(`${cols[i]}${row}`)
                    )
                ) {
                    legalCaptures.push(`${cols[i]}${row}`);
                }
                break;
            }

            legalMoves.push(`${cols[i]}${row}`);
        }

        const colIndex = cols.indexOf(col);

        for (let i = 1; i <= 8 - colIndex; i++) {
            if (Number(row) + i > 8) {
                break;
            }

            if (
                currentPosition.some((item) =>
                    item.endsWith(`${cols[colIndex + i]}${Number(row) + i}`)
                )
            ) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(
                                `${cols[colIndex + i]}${Number(row) + i}`
                            )
                    )
                ) {
                    legalCaptures.push(
                        `${cols[colIndex + i]}${Number(row) + i}`
                    );
                }
                break;
            }

            legalMoves.push(`${cols[colIndex + i]}${Number(row) + i}`);
        }

        for (let i = 1; i <= 8 - colIndex; i++) {
            if (Number(row) - i < 1) {
                break;
            }

            if (
                currentPosition.some((item) =>
                    item.endsWith(`${cols[colIndex + i]}${Number(row) - i}`)
                )
            ) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(
                                `${cols[colIndex + i]}${Number(row) - i}`
                            )
                    )
                ) {
                    legalCaptures.push(
                        `${cols[colIndex + i]}${Number(row) - i}`
                    );
                }
                break;
            }

            legalMoves.push(`${cols[colIndex + i]}${Number(row) - i}`);
        }

        for (let i = colIndex - 1; i >= 0; i--) {
            if (Number(row) - (colIndex - i) < 1) {
                break;
            }

            if (
                currentPosition.some((item) =>
                    item.endsWith(`${cols[i]}${Number(row) - (colIndex - i)}`)
                )
            ) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(
                                `${cols[i]}${Number(row) - (colIndex - i)}`
                            )
                    )
                ) {
                    legalCaptures.push(
                        `${cols[i]}${Number(row) - (colIndex - i)}`
                    );
                }
                break;
            }

            legalMoves.push(`${cols[i]}${Number(row) - (colIndex - i)}`);
        }

        for (let i = colIndex - 1; i >= 0; i--) {
            if (Number(row) + (colIndex - i) > 8) {
                break;
            }

            if (
                currentPosition.some((item) =>
                    item.endsWith(`${cols[i]}${Number(row) + (colIndex - i)}`)
                )
            ) {
                if (
                    currentPosition.some(
                        (item) =>
                            item.startsWith(color === "w" ? "b" : "w") &&
                            item.endsWith(
                                `${cols[i]}${Number(row) + (colIndex - i)}`
                            )
                    )
                ) {
                    legalCaptures.push(
                        `${cols[i]}${Number(row) + (colIndex - i)}`
                    );
                }
                break;
            }

            legalMoves.push(`${cols[i]}${Number(row) + (colIndex - i)}`);
        }
    }

    if (role === "k") {
        if (
            Number(row) < 8 &&
            !currentPosition.some((item) =>
                item.endsWith(`${col}${Number(row) + 1}`)
            )
        ) {
            legalMoves.push(`${col}${Number(row) + 1}`);
        }

        if (
            Number(row) < 8 &&
            currentPosition.some(
                (item) =>
                    item.startsWith(color === "w" ? "b" : "w") &&
                    item.endsWith(`${col}${Number(row) + 1}`)
            )
        ) {
            legalCaptures.push(`${col}${Number(row) + 1}`);
        }

        if (
            next(col, 1) &&
            Number(row) < 8 &&
            !currentPosition.some((item) =>
                item.endsWith(`${next(col, 1)}${Number(row) + 1}`)
            )
        ) {
            legalMoves.push(`${next(col, 1)}${Number(row) + 1}`);
        }

        if (
            next(col, 1) &&
            Number(row) < 8 &&
            currentPosition.some(
                (item) =>
                    item.startsWith(color === "w" ? "b" : "w") &&
                    item.endsWith(`${next(col, 1)}${Number(row) + 1}`)
            )
        ) {
            legalCaptures.push(`${next(col, 1)}${Number(row) + 1}`);
        }

        if (
            prev(col, 1) &&
            Number(row) < 8 &&
            !currentPosition.some((item) =>
                item.endsWith(`${prev(col, 1)}${Number(row) + 1}`)
            )
        ) {
            legalMoves.push(`${prev(col, 1)}${Number(row) + 1}`);
        }

        if (
            prev(col, 1) &&
            Number(row) < 8 &&
            currentPosition.some(
                (item) =>
                    item.startsWith(color === "w" ? "b" : "w") &&
                    item.endsWith(`${prev(col, 1)}${Number(row) + 1}`)
            )
        ) {
            legalCaptures.push(`${prev(col, 1)}${Number(row) + 1}`);
        }

        if (
            Number(row) > 1 &&
            !currentPosition.some((item) =>
                item.endsWith(`${col}${Number(row) - 1}`)
            )
        ) {
            legalMoves.push(`${col}${Number(row) - 1}`);
        }

        if (
            Number(row) > 1 &&
            currentPosition.some(
                (item) =>
                    item.startsWith(color === "w" ? "b" : "w") &&
                    item.endsWith(`${col}${Number(row) - 1}`)
            )
        ) {
            legalCaptures.push(`${col}${Number(row) - 1}`);
        }

        if (
            next(col, 1) &&
            Number(row) > 1 &&
            !currentPosition.some((item) =>
                item.endsWith(`${next(col, 1)}${Number(row) - 1}`)
            )
        ) {
            legalMoves.push(`${next(col, 1)}${Number(row) - 1}`);
        }

        if (
            next(col, 1) &&
            Number(row) > 1 &&
            currentPosition.some(
                (item) =>
                    item.startsWith(color === "w" ? "b" : "w") &&
                    item.endsWith(`${next(col, 1)}${Number(row) - 1}`)
            )
        ) {
            legalCaptures.push(`${next(col, 1)}${Number(row) - 1}`);
        }

        if (
            prev(col, 1) &&
            Number(row) > 1 &&
            !currentPosition.some((item) =>
                item.endsWith(`${prev(col, 1)}${Number(row) - 1}`)
            )
        ) {
            legalMoves.push(`${prev(col, 1)}${Number(row) - 1}`);
        }

        if (
            prev(col, 1) &&
            Number(row) > 1 &&
            currentPosition.some(
                (item) =>
                    item.startsWith(color === "w" ? "b" : "w") &&
                    item.endsWith(`${prev(col, 1)}${Number(row) - 1}`)
            )
        ) {
            legalCaptures.push(`${prev(col, 1)}${Number(row) - 1}`);
        }

        if (
            next(col, 1) &&
            !currentPosition.some((item) =>
                item.endsWith(`${next(col, 1)}${row}`)
            )
        ) {
            legalMoves.push(`${next(col, 1)}${row}`);
        }

        if (
            next(col, 1) &&
            currentPosition.some(
                (item) =>
                    item.startsWith(color === "w" ? "b" : "w") &&
                    item.endsWith(`${next(col, 1)}${row}`)
            )
        ) {
            legalCaptures.push(`${next(col, 1)}${row}`);
        }

        if (
            prev(col, 1) &&
            !currentPosition.some((item) =>
                item.endsWith(`${prev(col, 1)}${row}`)
            )
        ) {
            legalMoves.push(`${prev(col, 1)}${row}`);
        }

        if (
            prev(col, 1) &&
            currentPosition.some(
                (item) =>
                    item.startsWith(color === "w" ? "b" : "w") &&
                    item.endsWith(`${prev(col, 1)}${row}`)
            )
        ) {
            legalCaptures.push(`${prev(col, 1)}${row}`);
        }

        if (color === "w") {
            const doesKingMoved = history.some((item) => item.startsWith("wk"));
            const doesKingSideRookMoved = history.some((item) =>
                item.startsWith("wrh1")
            );
            const doesQueenSideRookMoved = history.some((item) =>
                item.startsWith("wra1")
            );

            if (
                !doesKingMoved &&
                !doesKingSideRookMoved &&
                !currentPosition.some((item) =>
                    item.endsWith(`${next(col, 1)}${row}`)
                ) &&
                !currentPosition.some((item) =>
                    item.endsWith(`${next(col, 2)}${row}`)
                )
            ) {
                legalMoves.push(`${next(col, 2)}${row}`);
                legalCastles.push(`${next(col, 2)}${row}`);
                legalCastles.push(`${next(col, 3)}${row}`);
            }

            if (
                !doesKingMoved &&
                !doesQueenSideRookMoved &&
                !currentPosition.some((item) =>
                    item.endsWith(`${prev(col, 1)}${row}`)
                ) &&
                !currentPosition.some((item) =>
                    item.endsWith(`${prev(col, 2)}${row}`)
                ) &&
                !currentPosition.some((item) =>
                    item.endsWith(`${prev(col, 3)}${row}`)
                )
            ) {
                legalMoves.push(`${prev(col, 2)}${row}`);
                legalCastles.push(`${prev(col, 2)}${row}`);
                legalCastles.push(`${prev(col, 3)}${row}`);
                legalCastles.push(`${prev(col, 4)}${row}`);
            }
        }

        if (color === "b") {
            const doesKingMoved = history.some((item) => item.startsWith("bk"));
            const doesKingSideRookMoved = history.some((item) =>
                item.startsWith("brh8")
            );
            const doesQueenSideRookMoved = history.some((item) =>
                item.startsWith("bra8")
            );

            if (
                !doesKingMoved &&
                !doesKingSideRookMoved &&
                !currentPosition.some((item) =>
                    item.endsWith(`${next(col, 1)}${row}`)
                ) &&
                !currentPosition.some((item) =>
                    item.endsWith(`${next(col, 2)}${row}`)
                )
            ) {
                legalMoves.push(`${next(col, 2)}${row}`);
                legalCastles.push(`${next(col, 2)}${row}`);
                legalCastles.push(`${next(col, 3)}${row}`);
            }

            if (
                !doesKingMoved &&
                !doesQueenSideRookMoved &&
                !currentPosition.some((item) =>
                    item.endsWith(`${prev(col, 1)}${row}`)
                ) &&
                !currentPosition.some((item) =>
                    item.endsWith(`${prev(col, 2)}${row}`)
                ) &&
                !currentPosition.some((item) =>
                    item.endsWith(`${prev(col, 3)}${row}`)
                )
            ) {
                legalMoves.push(`${prev(col, 2)}${row}`);
                legalCastles.push(`${prev(col, 2)}${row}`);
                legalCastles.push(`${prev(col, 3)}${row}`);
                legalCastles.push(`${prev(col, 4)}${row}`);
            }
        }
    }

    return { legalMoves, legalCaptures, legalEnpassent, legalCastles };
};
