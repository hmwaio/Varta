import { Check, Close, Download } from "@mui/icons-material";

interface DownloadProgressBarProps {
  downloading: boolean;
  downloaded: boolean;
  progress: number;
  onDownload: () => void;
  onCancel: () => void;
  className?: string;
}

export const DownloadProgress = ({
  downloading,
  downloaded,
  progress,
  onDownload,
  onCancel,
  className = "",
}: DownloadProgressBarProps) => {
  return (
    <div
      className={`
        flex items-center gap-3
        w-full max-w-sm
        ${className}
      `}
    >
      {/* Initial Button */}
      {!downloading && !downloaded && (
        <button
          onClick={onDownload}
          className="
            w-10 h-10
            flex items-center justify-center
            rounded-full
            bg-white/10
            hover:bg-white/20
            backdrop-blur-md
            border border-white/10
            transition-all duration-200
            active:scale-95
          "
        >
          <Download fontSize="small" />
        </button>
      )}

      {/* Downloading */}
      {downloading && (
        <div
          className="
            flex items-center gap-3
            w-full
            px-3 py-2
            rounded-2xl
            bg-white/5
            border border-white/10
            backdrop-blur-lg
          "
        >
          {/* Progress */}
          <div className="flex-1">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="
                  h-full
                  rounded-full
                  bg-linear-to-r
                  from-sky-400
                  via-blue-500
                  to-violet-500
                  transition-all duration-300
                  relative
                "
                style={{
                  width: `${progress}%`,
                }}
              >
                <div
                  className="
                    absolute right-0 top-0
                    h-full w-8
                    bg-white/40 blur-sm
                  "
                />
              </div>
            </div>

            <div className="mt-1 text-[11px] text-white/60">
              Downloading • {progress}%
            </div>
          </div>

          {/* Cancel */}
          <button
            onClick={onCancel}
            className="
              w-8 h-8
              flex items-center justify-center
              rounded-full
              bg-red-500/10
              hover:bg-red-500/20
              text-red-300
              transition
            "
          >
            <Close fontSize="small" />
          </button>
        </div>
      )}

      {/* Downloaded */}
      {downloaded && (
        <div
          className="
            flex items-center gap-2
            px-3 py-2
            rounded-2xl
            bg-emerald-500/10
            border border-emerald-400/20
            text-emerald-300
            backdrop-blur-lg
            animate-pulse
          "
        >
          <Check fontSize="small" />
          <span className="text-sm font-medium">
            Downloaded
          </span>
        </div>
      )}
    </div>
  );
};