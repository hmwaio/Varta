import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userAPI } from "../api/user.api";

export const useConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState("");
  const [isSender, setIsSender] = useState(false);
  const { targetId } = useParams<{ targetId: string }>();

  useEffect(() => {
    let isMounted = true;

    const fetchConnectionStatus = async () => {
      try {
        const res = await userAPI.connectionStatus(targetId!);
        if (!isMounted) return;

        const status = res.data.data.status;
        setConnectionStatus(status);

        // Check if current user is sender or receiver
        if (status === "PENDING") {
          const pending = await userAPI.pendingConnectionReq();
          const isReceiver = pending.data.data.some(
            (r: any) => r.sender.username === targetId,
          );
          setIsSender(!isReceiver);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (targetId) fetchConnectionStatus();

    return () => {
      isMounted = false;
    };
  }, [targetId]);

  return { connectionStatus, isSender };
};

export const useSendConnection = () => {
  const [loading, setLoading] = useState(false);

  const sendConnection = async (targetId: string) => {
    setLoading(true);
    try {
      await userAPI.connectUser(targetId);
      return "PENDING";
    } finally {
      setLoading(false);
    }
  };

  return { sendConnection, loading };
};

export const useAcceptConnection = () => {
  const [loading, setLoading] = useState(false);

  const acceptConnection = async (targetId: string) => {
    setLoading(true);
    try {
      await userAPI.acceptUser(targetId);
      return "CONNECTED";
    } finally {
      setLoading(false);
    }
  };

  return { acceptConnection, loading };
};

export const useDisconnectConnection = () => {
  const [loading, setLoading] = useState(false);

  const disconnectConnection = async (targetId: string) => {
    setLoading(true);
    try {
      await userAPI.disconnectUser(targetId);
      return "NONE";
    } finally {
      setLoading(false);
    }
  };

  return { disconnectConnection, loading };
};

export const useDeclinedConnection = () => {
  const [loading, setLoading] = useState(false);

  const declineConnection = async (targetId: string) => {
    setLoading(true);
    try {
      await userAPI.declineRequest(targetId);
      return "NONE";
    } finally {
      setLoading(false);
    }
  };

  return { declineConnection, loading };
};

export const useBlockConnection = () => {
  const [loading, setLoading] = useState(false);

  const blockConnection = async (targetId: string) => {
    setLoading(true);
    try {
      await userAPI.blockUser(targetId);
      return "BLOCKED";
    } finally {
      setLoading(false);
    }
  };

  return { blockConnection, loading };
};

export const useUnblockConnection = () => {
  const [loading, setLoading] = useState(false);

  const unblockConnection = async (targetId: string) => {
    setLoading(true);
    try {
      await userAPI.unblockUser(targetId);
      return "CONNECTED";
    } finally {
      setLoading(false);
    }
  };

  return { unblockConnection, loading };
};