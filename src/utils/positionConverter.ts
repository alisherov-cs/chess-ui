const rows: Record<string, number> = {
    "1": 7,
    "2": 6,
    "3": 5,
    "4": 4,
    "5": 3,
    "6": 2,
    "7": 1,
    "8": 0,
};

const cols: Record<string, number> = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
};

export const convertPosition = (position: string) => {
    const [colKey, rowKey] = position.split("");

    return {
        row: rows[rowKey],
        col: cols[colKey],
    };
};

export const hashPosition = (row: number, col: number): string => {
    const [rowKey] = Object.entries(rows).find(([_, value]) => value === row);
    const [colKey] = Object.entries(cols).find(([_, value]) => value === col);

    return `${colKey}${rowKey}`;
};
