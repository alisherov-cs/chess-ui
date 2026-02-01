import { Icons } from "@/components";

export enum Role {
    pawn = "pawn",
    bishop = "bishop",
    knight = "knight",
    rook = "rook",
    queen = "queen",
    king = "king",
}

export enum Color {
    white = "white",
    black = "black",
}

export const pieceImageKeys = {
    colors: {
        [Color.white]: "w",
        [Color.black]: "b",
    },
    roles: {
        [Role.pawn]: "p",
        [Role.bishop]: "b",
        [Role.knight]: "n",
        [Role.rook]: "r",
        [Role.queen]: "q",
        [Role.king]: "k",
    },
};

export const navbarLinks = [
    {
        title: "Play",
        icon: <Icons.playIcon />,
        href: "/play",
    },
    {
        title: "Friends",
        icon: <Icons.friendsIcon />,
        href: "/friends",
    },
    {
        title: "Invites",
        icon: <Icons.invites />,
        href: "/invites",
    },
];

export const defaultBoard = [
    {
        position: "a1",
        role: Role.rook,
        color: Color.white,
    },
    {
        position: "b1",
        role: Role.knight,
        color: Color.white,
    },
    {
        position: "c1",
        role: Role.bishop,
        color: Color.white,
    },
    {
        position: "d1",
        role: Role.queen,
        color: Color.white,
    },
    {
        position: "e1",
        role: Role.king,
        color: Color.white,
    },
    {
        position: "f1",
        role: Role.bishop,
        color: Color.white,
    },
    {
        position: "g1",
        role: Role.knight,
        color: Color.white,
    },
    {
        position: "h1",
        role: Role.rook,
        color: Color.white,
    },
    {
        position: "a2",
        role: Role.pawn,
        color: Color.white,
    },
    {
        position: "b2",
        role: Role.pawn,
        color: Color.white,
    },
    {
        position: "c2",
        role: Role.pawn,
        color: Color.white,
    },
    {
        position: "d2",
        role: Role.pawn,
        color: Color.white,
    },
    {
        position: "e2",
        role: Role.pawn,
        color: Color.white,
    },
    {
        position: "f2",
        role: Role.pawn,
        color: Color.white,
    },
    {
        position: "g2",
        role: Role.pawn,
        color: Color.white,
    },
    {
        position: "h2",
        role: Role.pawn,
        color: Color.white,
    },
    {
        position: "a8",
        role: Role.rook,
        color: Color.black,
    },
    {
        position: "b8",
        role: Role.knight,
        color: Color.black,
    },
    {
        position: "c8",
        role: Role.bishop,
        color: Color.black,
    },
    {
        position: "d8",
        role: Role.queen,
        color: Color.black,
    },
    {
        position: "e8",
        role: Role.king,
        color: Color.black,
    },
    {
        position: "f8",
        role: Role.bishop,
        color: Color.black,
    },
    {
        position: "g8",
        role: Role.knight,
        color: Color.black,
    },
    {
        position: "h8",
        role: Role.rook,
        color: Color.black,
    },
    {
        position: "a7",
        role: Role.pawn,
        color: Color.black,
    },
    {
        position: "b7",
        role: Role.pawn,
        color: Color.black,
    },
    {
        position: "c7",
        role: Role.pawn,
        color: Color.black,
    },
    {
        position: "d7",
        role: Role.pawn,
        color: Color.black,
    },
    {
        position: "e7",
        role: Role.pawn,
        color: Color.black,
    },
    {
        position: "f7",
        role: Role.pawn,
        color: Color.black,
    },
    {
        position: "g7",
        role: Role.pawn,
        color: Color.black,
    },
    {
        position: "h7",
        role: Role.pawn,
        color: Color.black,
    },
];

export const durations = [
    {
        id: 1,
        title: "Bullet",
        icon: <Icons.bullet className="fill-icon-bullet" />,
        children: [
            {
                id: `bullet-1`,
                title: "1 min",
                value: 60000,
            },
            {
                id: `bullet-1.1`,
                title: "1 | 1",
                value: 60000,
            },
            {
                id: `bullet-2.1`,
                title: "2 | 1",
                value: 120000,
            },
        ],
    },
    {
        id: 2,
        title: "Blitz",
        icon: <Icons.lightning className="fill-icon-blitz" />,
        children: [
            {
                id: `blitz-3`,
                title: "3 min",
                value: 180000,
            },
            {
                id: `blitz-3.2`,
                title: "3 | 2",
                value: 180000,
            },
            {
                id: `blitz-5`,
                title: "5 min",
                value: 300000,
            },
        ],
    },
    {
        id: 3,
        title: "Rapid",
        icon: <Icons.timer className="w-5 h-5 fill-success" />,
        children: [
            {
                id: `rapid-10`,
                title: "10 min",
                value: 600000,
            },
            {
                id: `rapid-15.10`,
                title: "15 | 10",
                value: 900000,
            },
            {
                id: `rapid-30`,
                title: "30 min",
                value: 1800000,
            },
        ],
    },
    {
        id: 4,
        title: "Daily",
        icon: <Icons.sun className="fill-icon-daily" />,
        children: [
            {
                id: `daily-1`,
                title: "1 day",
                value: 86400000,
            },
            {
                id: `daily-3`,
                title: "3 days",
                value: 259200000,
            },
            {
                id: `daily-7`,
                title: "7 days",
                value: 604800000,
            },
        ],
    },
];
