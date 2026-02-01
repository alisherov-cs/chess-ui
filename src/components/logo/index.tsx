import { Link } from "react-router-dom";
import { Icons } from "../icons";

export const Logo = () => {
    return (
        <Link to="/" className="flex justify-center w-full">
            <Icons.logo height={35} />
        </Link>
    );
};
