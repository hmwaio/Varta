import { useState } from "react";
import {
  useAcceptConnection,
  useBlockConnection,
  useConnectionStatus,
  useDeclinedConnection,
  useDisconnectConnection,
  useSendConnection,
  useUnblockConnection,
} from "../../hooks/connectionStatus";

type ConnectionStatus = "CONNECTED" | "PENDING" | "NONE" | "BLOCKED";

interface ButtonProps {
  targetId: string;
}

function Button({ targetId }: ButtonProps) {
  const { connectionStatus, isSender } = useConnectionStatus();
  const { disconnectConnection, loading: disconnectLoading } =
    useDisconnectConnection();
  const { sendConnection, loading: sendLoading } = useSendConnection();
  const { acceptConnection, loading: acceptLoading } = useAcceptConnection();
  const { declineConnection, loading: declineLoading } =
    useDeclinedConnection();
  const { blockConnection, loading: blockLoading } = useBlockConnection();
  const { unblockConnection, loading: unblockLoading } = useUnblockConnection();

  const [localStatus, setLocalStatus] = useState<ConnectionStatus | null>(null);

  const status =
    localStatus || (connectionStatus as ConnectionStatus) || "NONE";

  const loading =
    sendLoading || acceptLoading || declineLoading || blockLoading;

  const handleAction = async (action: string) => {
    try {
      let newStatus: ConnectionStatus;

      switch (action) {
        case "connect":
          newStatus = await sendConnection(targetId);
          break;
        case "accept":
          newStatus = await acceptConnection(targetId);
          break;
        case "disconnect":
          newStatus = await disconnectConnection(targetId);
          break;
        case "decline":
          newStatus = await declineConnection(targetId);
          break;
        case "block":
          newStatus = await blockConnection(targetId);
          break;
        case "unblock":
          newStatus = await unblockConnection(targetId);
          break;
        default:
          return;
      }

      setLocalStatus(newStatus);
    } catch (err: any) {
      alert(err.response?.data?.error ?? "Action failed");
    }
  };

  // 🔹 UI
  if (status === "PENDING") {
    return isSender ? (
      <button className="bg-gray-400 text-white px-3 py-1 rounded-lg">
        Pending...
      </button>
    ) : (
      <div className="flex gap-2">
        <button
          onClick={() => handleAction("accept")}
          className="bg-green-500 text-white px-3 py-1 rounded-lg"
        >
          Accept
        </button>
        <button
          onClick={() => handleAction("decline")}
          className="bg-red-500 text-white px-3 py-1 rounded-lg"
        >
          Decline
        </button>
      </div>
    );
  }

  // CONNECTED UI:
  if (status === "CONNECTED") {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleAction("disconnect")}
          disabled={loading}
          className="bg-gray-500 text-white px-3 py-1 rounded-lg"
        >
          Disconnect
        </button>
        <button
          onClick={() => handleAction("block")}
          disabled={loading}
          className="bg-red-500 text-white px-3 py-1 rounded-lg"
        >
          Block
        </button>
      </div>
    );
  }

  // In Button.tsx BLOCKED state:
  if (status === "BLOCKED") {
    return (
      <button
        onClick={() => handleAction("unblock")}
        disabled={loading}
        className="bg-yellow-500 text-white px-4 py-1 rounded-lg"
      >
        Unblock
      </button>
    );
  }

  return (
    <button
      onClick={() => handleAction("connect")}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-1 rounded-lg"
    >
      Connect
    </button>
  );
}

export { Button };
