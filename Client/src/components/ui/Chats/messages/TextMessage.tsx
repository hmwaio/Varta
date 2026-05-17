interface TextMessageProps {
  content: string;
}

export const TextMessage = ({
  content,
}: TextMessageProps) => {
  return <p>{content}</p>;
};