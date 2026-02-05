import { axiosPrivate } from "@/api";
import { endpoints } from "@/api/endpoints";
import type { TGame } from "@/features/play/api/sendChellange.request";
import { useQuery } from "@tanstack/react-query";

export const useFindGame = (id?: string) => {
    return useQuery({
        enabled: !!id,
        queryKey: [endpoints.game.byId(id!)],
        queryFn: async () => {
            return (await axiosPrivate.get<TGame>(endpoints.game.byId(id!)))
                .data;
        },
    });
};
