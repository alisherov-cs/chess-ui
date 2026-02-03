import { Icons, Input, Loading } from "@/components";
import { Theme, useTheme } from "@/context/theme";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { FriendRequests } from "./components/friendRequest";
import { useFindFriends } from "./api/findFriends.request";
import { debounce } from "@/utils/debounce";
import { useSearchParams } from "react-router-dom";
import { useFindSuggestions } from "./api/findSuggestions.request";
import clsx from "clsx";
import { SuggestionCard } from "./components/suggestionCard";
import { AppEvents, eventEmitter } from "@/services/eventEmitter";
import { FriendCard } from "./components/friendCard";

export default function FriendsPage() {
    const {
        data: friendsData,
        isLoading,
        refetch: refetchFriends,
    } = useFindFriends();
    const {
        data: suggestionsData,
        isLoading: isSuggestionLoading,
        refetch: refetchSuggestions,
    } = useFindSuggestions();
    const [searchParams, setSearchParams] = useSearchParams();
    const { theme } = useTheme();
    const [deviceTheme] = useState(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }
        return "light";
    });

    const friends = useMemo(
        () => friendsData?.pages.flatMap((page) => page.data),
        [friendsData]
    );
    const suggestions = useMemo(
        () => suggestionsData?.pages.flatMap((page) => page.data),
        [suggestionsData]
    );
    const pagination = useMemo(
        () => friendsData?.pages?.[0].pagination,
        [friendsData]
    );

    useEffect(() => {
        eventEmitter.on(AppEvents.CANCELED_OUTGOING_REQUEST, () => {
            refetchSuggestions();
            refetchFriends();
        });
        eventEmitter.on(AppEvents.CANCELED_INCOMOING_REQUEST, () => {
            refetchSuggestions();
            refetchFriends();
        });
        eventEmitter.on(AppEvents.ACCEPTED_INCOMOING_REQUEST, () => {
            refetchSuggestions();
            refetchFriends();
        });
    }, []);

    const onSearch = debounce(({ target }: ChangeEvent<HTMLInputElement>) => {
        const value = target.value;

        if (!value) {
            searchParams.delete("search");
        } else {
            searchParams.set("search", value);
        }

        setSearchParams(searchParams);
    }, 200);

    return (
        <div className="w-full py-5">
            <div className="flex items-center gap-3">
                <Icons.friendsIcon width={50} height={50} />
                <h3 className="text-2xl font-bold">Friends</h3>
            </div>
            <div className="flex justify-between gap-3 mt-10">
                <div className="w-200 bg-bg-primary px-5 py-10 rounded-md">
                    <Input
                        defaultValue={searchParams.get("search") ?? ""}
                        onChange={onSearch}
                        icon={<Search className="text-text-secondary" />}
                        placeholder="Search by name or username"
                    />
                    {(isLoading || isSuggestionLoading) && <Loading />}
                    {(!isLoading || !isSuggestionLoading) && (
                        <>
                            <div className="py-5 flex flex-col gap-10">
                                <div>
                                    <div
                                        className={clsx(
                                            "flex items-center gap-2 mb-4"
                                        )}
                                    >
                                        <h2 className="font-semibold">
                                            Friends
                                        </h2>
                                        <span className="py-0.5 px-1.5 rounded-sm bg-bg-secondary text-text-secondary text-sm">
                                            {pagination?.total}
                                        </span>
                                    </div>
                                    {!friends?.length && (
                                        <h2 className="text-text-secondary">
                                            No results found.
                                        </h2>
                                    )}
                                    <div>
                                        {friends?.map((friend) => (
                                            <FriendCard friend={friend} />
                                        ))}
                                    </div>
                                </div>
                                {searchParams.get("search") && (
                                    <div>
                                        <div
                                            className={clsx(
                                                "flex items-center gap-2 mb-4"
                                            )}
                                        >
                                            <h2 className="font-semibold">
                                                Suggestions
                                            </h2>
                                            <span className="py-0.5 px-1.5 rounded-sm bg-bg-secondary text-text-secondary text-sm">
                                                {suggestions?.length}
                                            </span>
                                        </div>
                                        {!suggestions?.length && (
                                            <h2 className="text-text-secondary">
                                                No results found.
                                            </h2>
                                        )}
                                        <div className="flex flex-col gap-3">
                                            {suggestions?.map((suggestion) => (
                                                <SuggestionCard
                                                    key={suggestion.id}
                                                    suggestion={suggestion}
                                                    refetch={refetchSuggestions}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {!friends?.length &&
                                !searchParams.get("search") && (
                                    <div className="flex flex-col items-center gap-2 mt-10">
                                        {theme === Theme.light && (
                                            <Icons.pawnLight />
                                        )}
                                        {theme === Theme.dark && (
                                            <Icons.pawnDark />
                                        )}
                                        {theme === Theme.device &&
                                            deviceTheme === Theme.light && (
                                                <Icons.pawnLight />
                                            )}
                                        {theme === Theme.device &&
                                            deviceTheme === Theme.dark && (
                                                <Icons.pawnDark />
                                            )}
                                        <h2 className="text-text-primary">
                                            Chess is better with friends!
                                        </h2>
                                        <p className="text-text-muted">
                                            Add friends and their names will
                                            appear here.
                                        </p>
                                    </div>
                                )}
                        </>
                    )}
                </div>
                <FriendRequests />
            </div>
        </div>
    );
}
