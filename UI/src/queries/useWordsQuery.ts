import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useWordsQuery = () => {
    const { isPending, error, data } = useQuery({
        queryKey: ["words"],
        queryFn: () => axios.get(import.meta.env.VITE_WORD_CLOUD_API_URL).then((res) => res.data),
    });


    return {
        isPending,
        error,
        data
    }
    
}

export default useWordsQuery;