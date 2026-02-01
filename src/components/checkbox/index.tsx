import clsx from "clsx";

type TCheckbox = {
    checked: boolean;
    onCheck: (checked: boolean) => void;
};

export const Checkbox = ({ checked, onCheck }: TCheckbox) => {
    return (
        <div
            onClick={() => onCheck(!checked)}
            className={clsx(
                "relative h-6 rounded-full cursor-pointer w-12",
                checked ? "bg-success" : "bg-bg-tertiary"
            )}
        >
            <div
                className={clsx(
                    "h-6 top-0 left-0 absolute aspect-square rounded-full bg-text-primary transition-all duration-150",
                    checked ? "translate-x-6" : "translate-x-0"
                )}
            />
        </div>
    );
};
