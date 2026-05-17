import { usePresence } from "../../hooks/socket/usePresence";
import { formatLastSeen } from "../../utils/formatLastSeen";

type Props = {
  targetUserId: string;
};

function GetUserStatus({ targetUserId }: Props) {
  const { status, lastSeen } = usePresence(targetUserId);

  return (
    <p
      className={`text-xs ${
        status === "online" ? "text-green-500" : "text-gray-500"
      }`}
    >
      {status === "online"
        ? "online"
        : lastSeen
          ? `${formatLastSeen(lastSeen)}`
          : "offline"}
    </p>
  );
}

export default GetUserStatus;
