import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useIncomingRequests } from "../../api/incomingRequests.request";
import { useOutgoingRequests } from "../../api/outgoingRequests.request";
import { OutgoingCard } from "../outgoingCard";
import { AppEvents, eventEmitter } from "@/services/eventEmitter";
import { IncomingCard } from "../incomingCard";

export const FriendRequests = () => {
    const [activeTab, setActiveTab] = useState("incoming");
    const {
        data: incomingRequestsData,
        isLoading: incomingLoading,
        refetch: refetchIncoming,
    } = useIncomingRequests();
    const {
        data: outgoingRequestsData,
        isLoading: outgoingLoading,
        refetch: refetchOutgoing,
    } = useOutgoingRequests();

    const incomingRequests = useMemo(
        () => incomingRequestsData?.pages.flatMap((page) => page.data),
        [incomingRequestsData]
    );
    const incomingPagination = useMemo(
        () => incomingRequestsData?.pages?.[0].pagination,
        [incomingRequestsData]
    );

    const outgoingRequests = useMemo(
        () => outgoingRequestsData?.pages.flatMap((page) => page.data),
        [outgoingRequestsData]
    );
    const outgoingPagination = useMemo(
        () => outgoingRequestsData?.pages?.[0].pagination,
        [outgoingRequestsData]
    );

    useEffect(() => {
        eventEmitter.on(AppEvents.NEW_OUTGOING_REQUEST, () =>
            refetchOutgoing()
        );
        eventEmitter.on(AppEvents.CANCELED_OUTGOING_REQUEST, () =>
            refetchOutgoing()
        );
        eventEmitter.on(AppEvents.CANCELED_INCOMOING_REQUEST, () =>
            refetchIncoming()
        );
        eventEmitter.on(AppEvents.ACCEPTED_INCOMOING_REQUEST, () =>
            refetchIncoming()
        );
    }, []);

    const tabs = [
        {
            key: "incoming",
            title: "Incoming",
            count: incomingPagination?.total ?? 0,
            children: (
                <div className="py-4">
                    {!incomingRequests?.length && (
                        <div className="flex items-center justify-center">
                            <h2>No incoming friend requests.</h2>
                        </div>
                    )}
                    <div className="flex flex-col gap-4 w-full">
                        {incomingRequests?.map((request) => (
                            <IncomingCard
                                key={request.id}
                                refetch={refetchOutgoing}
                                user={request.user}
                            />
                        ))}
                    </div>
                </div>
            ),
        },
        {
            key: "outgoing",
            title: "Outgoing",
            count: outgoingPagination?.total ?? 0,
            children: (
                <div className="py-4">
                    {!outgoingRequests?.length && (
                        <div className="flex items-center justify-center">
                            <h2>No outgoing friend requests.</h2>
                        </div>
                    )}
                    <div className="flex flex-col gap-4 w-full">
                        {outgoingRequests?.map((request) => (
                            <OutgoingCard
                                key={request.id}
                                refetch={refetchOutgoing}
                                user={request.friend}
                            />
                        ))}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="flex-1 bg-bg-primary rounded-md h-fit px-5 py-3">
            <h2 className="text-lg font-semibold">Friend Requests</h2>
            <div className="grid grid-cols-2 border-b border-border mt-2">
                {tabs.map((tab) => (
                    <div
                        onClick={() => setActiveTab(tab.key)}
                        className={clsx(
                            "flex items-center border-b-3 gap-2 justify-center py-4 cursor-pointer",
                            tab.key === activeTab
                                ? "border-text-primary"
                                : "border-transparent"
                        )}
                    >
                        <h2 className="font-semibold">{tab.title}</h2>
                        <span className="py-0.5 px-1.5 rounded-sm bg-bg-secondary text-text-secondary text-sm">
                            {tab.count}
                        </span>
                    </div>
                ))}
            </div>
            <div>{tabs.find((tab) => tab.key === activeTab)?.children}</div>
        </div>
    );
};
