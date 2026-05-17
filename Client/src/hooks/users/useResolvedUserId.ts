import { useEffect, useRef, useState } from "react";
import { userAPI } from "../../api/user.api";

export const useResolveUserId = (identifier?: string) => {
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const cache = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!identifier) return;

    // return cached result
    if (cache.current[identifier]) {
      setResolvedId(cache.current[identifier]);
      return;
    }

    const isUUID = /^[0-9a-f-]{36}$/.test(identifier);
    if (isUUID) {
      cache.current[identifier] = identifier;
      setResolvedId(identifier);
      return;
    }

    userAPI
      .userStatus(identifier)
      .then((res) => {
        const uuid = res.data.data.userId;
        cache.current[identifier] = uuid;
        setResolvedId(uuid);
      })
      .catch(console.error);
  }, [identifier]);

  return resolvedId;
};
