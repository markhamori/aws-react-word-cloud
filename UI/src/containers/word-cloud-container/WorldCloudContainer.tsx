import WordCloud from "../../components/word-cloud/WordCloud";
import useMessagesQuery from "../../queries/useMessagesQuery";

type Message = {
  messageId: string;
  messageText: string;
  timestamp: number;
};

const WorldCloudContainer = () => {
  const { data, error, isPending } = useMessagesQuery();

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const concatenatedMessages: string = data.messages
    .map((message: Message) => message.messageText)
    .join(" ");

  return <WordCloud concatedWords={concatenatedMessages} />;
};

export default WorldCloudContainer;
