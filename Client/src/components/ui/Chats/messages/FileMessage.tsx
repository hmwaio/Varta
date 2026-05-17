import {
  Archive,
  Code,
  Description,
  InsertDriveFile,
  PictureAsPdf,
  Slideshow,
  TableChart,
  Visibility,
} from "@mui/icons-material";

import { useMemo, useState } from "react";

import { useDownloadFile } from "../../../../hooks/messages/useDownloadFile";
import { DownloadProgress } from "../../DownloadProgressBar";

interface FileMessageProps {
  url: string;
  fileName: string;
  mimeType?: string;
  fileSize?: number;
}

export const FileMessage = ({
  url,
  fileName,
  mimeType,
  fileSize,
}: FileMessageProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  /* DOWNLOAD HOOK */
  const { downloading, progress, downloaded, downloadFile, cancelDownload } =
    useDownloadFile();

  /* FILE EXTENSION */
  const extension = useMemo(() => {
    return fileName?.split(".")?.pop()?.toLowerCase();
  }, [fileName]);

  /* FILE TYPE */
  const fileData = useMemo(() => {
    switch (extension) {
      case "pdf":
        return {
          icon: <PictureAsPdf sx={{ fontSize: 34 }} />,
          label: "PDF Document",
        };

      case "doc":
      case "docx":
        return {
          icon: <Description sx={{ fontSize: 34 }} />,
          label: "Word Document",
        };

      case "xls":
      case "xlsx":
      case "csv":
        return {
          icon: <TableChart sx={{ fontSize: 34 }} />,
          label: "Spreadsheet",
        };

      case "ppt":
      case "pptx":
        return {
          icon: <Slideshow sx={{ fontSize: 34 }} />,
          label: "Presentation",
        };

      case "zip":
      case "rar":
      case "7z":
        return {
          icon: <Archive sx={{ fontSize: 34 }} />,
          label: "Archive",
        };

      case "json":
      case "js":
      case "ts":
      case "tsx":
      case "jsx":
      case "html":
      case "css":
        return {
          icon: <Code sx={{ fontSize: 34 }} />,
          label: "Code File",
        };

      default:
        return {
          icon: <InsertDriveFile sx={{ fontSize: 34 }} />,
          label: "Document",
        };
    }
  }, [extension]);

  /* FILE SIZE */
  const formattedSize = useMemo(() => {
    if (!fileSize) return null;

    if (fileSize < 1024) {
      return `${fileSize} B`;
    }

    if (fileSize < 1024 * 1024) {
      return `${(fileSize / 1024).toFixed(1)} KB`;
    }

    return `${(fileSize / 1024 / 1024).toFixed(1)} MB`;
  }, [fileSize]);

  /* PREVIEW SUPPORT */
  const canPreview =
    mimeType?.includes("pdf") ||
    mimeType?.includes("image") ||
    mimeType?.includes("video") ||
    mimeType?.includes("text");

  return (
    <>
      {/* FILE CARD */}
      <div
        className="
          relative overflow-hidden
          rounded-3xl
          border border-white/10
          bg-white/5
          backdrop-blur-xl
          w-full min-w-[240px]
          max-w-full
        "
      >
        {/* Glow */}
        <div
          className="
            absolute inset-0
            bg-linear-to-br
            from-white/5
            via-transparent
            to-white/10
            pointer-events-none
          "
        />

        <div className="relative p-4">
          {/* TOP */}
          <div className="flex items-start gap-4">
            {/* ICON */}
            <div
              className="
                flex items-center justify-center
                w-16 h-16
                rounded-2xl
                bg-white/10
                border border-white/10
                shrink-0
                text-white
              "
            >
              {fileData.icon}
            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0">
              {/* NAME */}
              <p
                className="
                  text-sm font-medium
                  text-white
                  break-all
                  line-clamp-2
                "
              >
                {fileName}
              </p>

              {/* BADGES */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span
                  className="
                    text-[11px]
                    px-2 py-1
                    rounded-full
                    bg-white/10
                    text-white/70
                  "
                >
                  {fileData.label}
                </span>

                {formattedSize && (
                  <span
                    className="
                      text-[11px]
                      text-white/50
                    "
                  >
                    {formattedSize}
                  </span>
                )}
              </div>

              {/* MIME */}
              {mimeType && (
                <p
                  className="
                    text-[11px]
                    text-white/40
                    mt-2 truncate
                  "
                >
                  {mimeType}
                </p>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-5 flex flex-col gap-3">
            {/* DOWNLOAD */}
            <DownloadProgress
              downloading={downloading}
              progress={progress}
              downloaded={downloaded}
              onDownload={() => downloadFile(url, fileName)}
              onCancel={cancelDownload}
            />

            {/* PREVIEW BUTTON */}
            {canPreview && (
              <button
                onClick={() => setPreviewOpen(true)}
                className="
        flex items-center justify-center gap-2
        px-4 py-3
        rounded-2xl
        bg-white/10
        hover:bg-white/15
        border border-white/10
        backdrop-blur-xl
        text-white
        transition
        active:scale-[0.98]
      "
              >
                <Visibility fontSize="small" />

                <span className="text-sm font-medium">Preview Inside App</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {previewOpen && (
        <div
          className="
            fixed inset-0 z-[9999]
            bg-black/80
            backdrop-blur-xl
            flex items-center justify-center
            p-4
          "
        >
          {/* CLOSE */}
          <button
            onClick={() => setPreviewOpen(false)}
            className="
              absolute top-4 right-4
              h-11 w-11
              rounded-full
              bg-white/10
              hover:bg-white/20
              text-white
              text-xl
              backdrop-blur-xl
            "
          >
            ✕
          </button>

          {/* CONTENT */}
          <div
            className="
              w-full max-w-6xl
              h-[90vh]
              rounded-3xl
              overflow-hidden
              border border-white/10
              bg-black
            "
          >
            {/* PDF */}
            {mimeType?.includes("pdf") && (
              <iframe src={url} className="w-full h-full" />
            )}

            {/* IMAGE */}
            {mimeType?.includes("image") && (
              <img
                src={url}
                alt={fileName}
                className="
                  w-full h-full
                  object-contain
                  bg-black
                "
              />
            )}

            {/* VIDEO */}
            {mimeType?.includes("video") && (
              <video
                src={url}
                controls
                className="
                  w-full h-full
                  object-contain
                  bg-black
                "
              />
            )}

            {/* TEXT */}
            {mimeType?.includes("text") && (
              <iframe
                src={url}
                className="
                  w-full h-full
                  bg-white
                "
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
