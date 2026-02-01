import { axiosPublic } from "@/api";
import { useQuery } from "@tanstack/react-query";

type TCountryResponse = {
    name: {
        common: string;
    };
    flags: {
        png: string;
        svg: string;
        alt: string;
    };
};

export const useGetCountryData = (countryCode?: string) => {
    return useQuery({
        enabled: !!countryCode,
        queryKey: [
            `https://restcountries.com/v3.1/alpha/${countryCode}`,
            { countryCode },
        ],
        queryFn: async () => {
            return (
                await axiosPublic.get<TCountryResponse[]>(
                    `https://restcountries.com/v3.1/alpha/${countryCode}`
                )
            ).data;
        },
    });
};
