import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useMessagesQuery = () => {
    const { isPending, error, data } = useQuery({
        queryKey: ["messages"],
        queryFn: () => axios.get("http://localhost:3000/test-sns").then((res) => res.data),
    });


    return {
        isPending,
        error,
        data
    }
    
}

export default useMessagesQuery;