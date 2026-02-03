import { odd } from "@/utils/oddOrEven";

export const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const defaultPositions = [
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
];

export const getBgColor = (position: string) => {
    const [col, row] = position.split("");
    const colors = ["bg-board-dark", "bg-board-light"];

    return odd(+row)
        ? colors[letters.indexOf(col) % 2]
        : colors.reverse()[letters.indexOf(col) % 2];
};

export const getMoveColor = (position: string) => {
    const [col, row] = position.split("");
    const colors = ["bg-bg-tertiary/30", "bg-bg-tertiary/20"];

    return odd(+row)
        ? colors[letters.indexOf(col) % 2]
        : colors.reverse()[letters.indexOf(col) % 2];
};

export const getCaptureColor = (position: string) => {
    const [col, row] = position.split("");
    const colors = ["border-bg-tertiary/30", "border-bg-tertiary/20"];

    return odd(+row)
        ? colors[letters.indexOf(col) % 2]
        : colors.reverse()[letters.indexOf(col) % 2];
};

export const getTextColor = (position: string) => {
    const [col, row] = position.split("");
    const colors = ["text-board-light", "text-board-dark"];

    return odd(+row)
        ? colors[letters.indexOf(col) % 2]
        : colors.reverse()[letters.indexOf(col) % 2];
};

export const getActiveBgColor = (
    position: string,
    activeId?: string | null,
    draggingId?: string | null
) => {
    const [col, row] = position.split("");
    const colors = ["bg-active-dark!", "bg-active-light!"];

    if (!activeId && !draggingId) return;
    if (activeId && !activeId.endsWith(position)) return;
    if (draggingId && !draggingId.endsWith(position)) return;

    return odd(+row)
        ? colors[letters.indexOf(col) % 2]
        : colors.reverse()[letters.indexOf(col) % 2];
};

export const getDangerZoneColor = (position: string, dangerZone: string[]) => {
    const [col, row] = position.split("");
    const colors = ["bg-danger-dark!", "bg-danger-light!"];

    if (!dangerZone.some((item) => item === position)) return;

    return odd(+row)
        ? colors[letters.indexOf(col) % 2]
        : colors.reverse()[letters.indexOf(col) % 2];
};

export const getIllegalBgColor = (
    illegalMove: boolean,
    position: string,
    history: string[],
    currentPosition: string[]
) => {
    if (!illegalMove) return;

    const whiteToMove = history.length % 2 === 0;

    return (
        currentPosition
            .find((item) => item.startsWith(whiteToMove ? "wk" : "bk"))
            ?.endsWith(position) && "bg-danger-dark animate-illegal"
    );
};
