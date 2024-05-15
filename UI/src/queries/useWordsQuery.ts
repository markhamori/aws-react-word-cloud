import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useWordsQuery = () => {
    const { isPending, error, data } = useQuery({
        queryKey: ["words"],
        queryFn: () => axios.get("http://localhost:3000/words").then((res) => res.data),
    });


    return {
        isPending,
        error,
        data
    }
    
}

export default useWordsQuery;