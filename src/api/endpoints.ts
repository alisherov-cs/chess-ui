export const endpoints = {
    auth: {
        google: "/auth/google",
        profile: "/auth/profile",
        setupUsername: "/auth/profile/setup/username",
        setupPassword: "/auth/profile/setup/password",
        login: "/auth/login",
        signup: "/auth/signup",
    },
    friends: {
        all: "/friends",
        byId: (id: string) => `/friends/${id}`,
        suggestions: "/friends/suggestions",
        sendFriendRequest: "/friends/sendFriendRequest",
        incomingRequests: "/friends/incomingRequests",
        outgoingRequests: "/friends/outgoingRequests",
        cancelFriendRequest: "/friends/cancelFriendRequest",
        acceptFriendRequest: "/friends/acceptFriendRequest",
    },
};
