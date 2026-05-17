import { useCallback, useEffect, useRef, useState } from "react";

interface DownloadState {
  downloading: boolean;
  downloaded: boolean;
  progress: number;
  downloadedUrl: string | null;
}

export const useDownloadFile = () => {
  const [state, setState] = useState<DownloadState>({
    downloading: false,
    downloaded: false,
    progress: 0,
    downloadedUrl: null,
  });

  const controllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ───────────────── RESET ───────────────── */
  const reset = useCallback(() => {
    controllerRef.current?.abort();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState({
      downloading: false,
      downloaded: false,
      progress: 0,
      downloadedUrl: null,
    });
  }, []);

  /* ───────────────── DOWNLOAD ───────────────── */
  const downloadFile = useCallback(
    async (url: string, fileName?: string) => {
      try {
        reset();

        setState((prev) => ({
          ...prev,
          downloading: true,
        }));

        const controller = new AbortController();

        controllerRef.current = controller;

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to download file.");
        }

        const total =
          Number(response.headers.get("content-length")) || 0;

        const reader = response.body?.getReader();

        if (!reader) {
          throw new Error("Readable stream not supported.");
        }

        const chunks: Uint8Array[] = [];

        let received = 0;

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          if (value) {
            chunks.push(value);

            received += value.length;

            if (total > 0) {
              const progress = Math.min(
                100,
                Math.round((received / total) * 100)
              );

              setState((prev) => ({
                ...prev,
                progress,
              }));
            }
          }
        }

        const blob = new Blob(chunks);

        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = blobUrl;
        link.download = fileName || "file";

        document.body.appendChild(link);

        link.click();

        link.remove();

        setState({
          downloading: false,
          downloaded: true,
          progress: 100,
          downloadedUrl: blobUrl,
        });

        timeoutRef.current = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            downloaded: false,
            progress: 0,
          }));
        }, 2500);

        return blobUrl;
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error(error);
        }

        reset();

        throw error;
      }
    },
    [reset]
  );

  /* ───────────────── CANCEL ───────────────── */
  const cancelDownload = useCallback(() => {
    controllerRef.current?.abort();

    setState((prev) => ({
      ...prev,
      downloading: false,
      progress: 0,
    }));
  }, []);

  /* ───────────────── CLEANUP ───────────────── */
  useEffect(() => {
    return () => {
      controllerRef.current?.abort();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    downloadFile,
    cancelDownload,
    reset,
  };
};