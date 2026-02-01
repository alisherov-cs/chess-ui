export const debounce = <T, R>(
    func: (x: T) => R,
    wait: number
): ((value: T) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null;

    return (value: T) => {
        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
            if ("requestIdleCallback" in window) {
                requestIdleCallback(() => func(value));
            } else {
                func(value);
            }
        }, wait);
    };
};
