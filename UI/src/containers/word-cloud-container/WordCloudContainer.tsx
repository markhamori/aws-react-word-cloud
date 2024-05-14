import { Triangle } from "react-loader-spinner";
import WordCloud from "../../components/word-cloud/WordCloud";
import useMessagesQuery from "../../queries/useMessagesQuery";

import "./WordCloudContainer.css";

type Message = {
  messageId: string;
  messageText: string;
  timestamp: number;
};

const WordCloudContainer = () => {
  const { data, error, isPending } = useMessagesQuery();

  if (isPending) {
    return (
      <div className="loader">
        <Triangle
          visible={true}
          height="80"
          width="80"
          color="#FFF"
          ariaLabel="loading"
        />
      </div>
    );
  }

  if (error) return "An error has occurred: " + error.message;

  const concatenatedMessages: string = data.messages
    .map((message: Message) => message.messageText)
    .join(" ");

  return (
    <div className="wordcloud">
      <WordCloud concatedWords={concatenatedMessages} />
    </div>
  );
};

export default WordCloudContainer;
