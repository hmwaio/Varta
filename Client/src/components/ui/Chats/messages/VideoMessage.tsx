import {
  Close,
  Download,
  Fullscreen,
  Pause,
  PlayArrow,
  VolumeDown,
  VolumeMute,
  VolumeUp,
} from "@mui/icons-material";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useDownloadFile } from "../../../../hooks/messages/useDownloadFile";

interface VideoMessageProps {
  src: string;
  mimeType?: string;
  fileName?: string;
  poster?: string;
}

export const VideoMessage = ({
  src,
  mimeType,
  fileName = "video.mp4",
  poster,
}: VideoMessageProps) => {
  const videoRef =
    useRef<HTMLVideoElement>(null);

  const containerRef =
    useRef<HTMLDivElement>(null);

  const controlsTimeout =
    useRef<NodeJS.Timeout | null>(null);

  const [playing, setPlaying] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [showControls, setShowControls] =
    useState(true);

  const [volume, setVolume] =
    useState(1);

  const [muted, setMuted] =
    useState(false);

  const [buffered, setBuffered] =
    useState(0);

  const {
    downloading,
    progress: downloadProgress,
    downloadFile,
    cancelDownload,
  } = useDownloadFile();

  /* =========================
     PLAY / PAUSE
  ========================== */
  const togglePlay = async () => {
    if (!videoRef.current) return;

    try {
      if (playing) {
        videoRef.current.pause();

        setPlaying(false);

        setShowControls(true);
      } else {
        await videoRef.current.play();

        setPlaying(true);

        autoHideControls();
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     SEEK
  ========================== */
  const handleSeek = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!videoRef.current) return;

    const value = Number(e.target.value);

    videoRef.current.currentTime = value;

    setProgress(value);
  };

  /* =========================
     VOLUME
  ========================== */
  const handleVolume = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!videoRef.current) return;

    const value = Number(e.target.value);

    videoRef.current.volume = value;

    setVolume(value);

    setMuted(value === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    if (muted) {
      videoRef.current.muted = false;

      videoRef.current.volume =
        volume || 1;

      setMuted(false);
    } else {
      videoRef.current.muted = true;

      setMuted(true);
    }
  };

  /* =========================
     FULLSCREEN
  ========================== */
  const handleFullscreen =
    async () => {
      if (!containerRef.current) return;

      if (
        document.fullscreenElement
      ) {
        await document.exitFullscreen();
      } else {
        await containerRef.current.requestFullscreen();
      }
    };

  /* =========================
     CONTROLS
  ========================== */
  const autoHideControls =
    () => {
      if (controlsTimeout.current) {
        clearTimeout(
          controlsTimeout.current,
        );
      }

      if (playing) {
        controlsTimeout.current =
          setTimeout(() => {
            setShowControls(false);
          }, 2500);
      }
    };

  const showPlayerControls =
    () => {
      setShowControls(true);

      autoHideControls();
    };

  /* =========================
     EVENTS
  ========================== */
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const update = () => {
      setProgress(video.currentTime);

      setDuration(video.duration || 0);

      if (
        video.buffered.length > 0
      ) {
        setBuffered(
          video.buffered.end(0),
        );
      }
    };

    const ended = () => {
      setPlaying(false);

      setShowControls(true);
    };

    video.addEventListener(
      "timeupdate",
      update,
    );

    video.addEventListener(
      "progress",
      update,
    );

    video.addEventListener(
      "loadedmetadata",
      update,
    );

    video.addEventListener(
      "ended",
      ended,
    );

    return () => {
      video.removeEventListener(
        "timeupdate",
        update,
      );

      video.removeEventListener(
        "progress",
        update,
      );

      video.removeEventListener(
        "loadedmetadata",
        update,
      );

      video.removeEventListener(
        "ended",
        ended,
      );
    };
  }, []);

  /* =========================
     FORMAT
  ========================== */
  const formatTime = (
    time: number,
  ) => {
    if (
      !time ||
      isNaN(time)
    ) {
      return "00:00";
    }

    const mins = Math.floor(
      time / 60,
    );

    const secs = Math.floor(
      time % 60,
    );

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const VolumeIcon = muted
    ? VolumeMute
    : volume < 0.5
      ? VolumeDown
      : VolumeUp;

  return (
    <div
      ref={containerRef}
      className="
        relative
        overflow-hidden

        rounded-[28px]

        bg-black

        border border-white/10

        shadow-[0_10px_50px_rgba(0,0,0,0.45)]

        group

        w-full
        max-w-full

        select-none
      "
      onMouseMove={
        showPlayerControls
      }
      onTouchStart={
        showPlayerControls
      }
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        preload="metadata"
        className="
          w-full
          h-full

          object-cover
          bg-black

          max-h-48
          sm:max-h-72
          md:max-h-104
          lg:max-h-128
        "
      >
        <source
          src={src}
          type={mimeType}
        />
      </video>

      {/* =========================
          TOP ACTIONS
      ========================== */}
      <div
        className="
          absolute top-3 right-3 z-20
          flex items-center gap-2
        "
      >
        {/* DOWNLOAD */}
        <button
          disabled={downloading}
          onClick={() =>
            downloadFile(
              src,
              fileName,
            )
          }
          className="
            flex items-center justify-center

            h-11 w-11
            sm:h-12 sm:w-12

            rounded-2xl

            border border-white/10

            bg-black/35
            hover:bg-black/55

            backdrop-blur-2xl

            transition-all duration-300

            hover:scale-105
            active:scale-95
          "
        >
          {downloading ? (
            <span className="text-[11px] text-white font-medium">
              {downloadProgress}%
            </span>
          ) : (
            <Download
              sx={{
                fontSize: 22,
                color: "white",
              }}
            />
          )}
        </button>

        {/* CANCEL */}
        {downloading && (
          <button
            onClick={
              cancelDownload
            }
            className="
              flex items-center justify-center

              h-11 w-11
              sm:h-12 sm:w-12

              rounded-2xl

              border border-red-400/20

              bg-red-500/20
              hover:bg-red-500/30

              backdrop-blur-2xl

              transition-all duration-300
            "
          >
            <Close
              sx={{
                fontSize: 20,
                color: "white",
              }}
            />
          </button>
        )}
      </div>

      {/* =========================
          CENTER PLAY
      ========================== */}
      {!playing && (
        <div
          className="
            absolute inset-0 z-10

            bg-black/30
            backdrop-blur-md

            flex items-center justify-center
          "
        >
          <button
            onClick={togglePlay}
            className="
              flex items-center justify-center

              h-20 w-20
              sm:h-24 sm:w-24

              rounded-full

              border border-white/10

              bg-white/15
              hover:bg-white/25

              backdrop-blur-3xl

              shadow-[0_10px_40px_rgba(0,0,0,0.4)]

              transition-all duration-300

              hover:scale-110
              active:scale-95
            "
          >
            <PlayArrow
              sx={{
                fontSize: 52,
                color: "white",
              }}
            />
          </button>
        </div>
      )}

      {/* =========================
          CONTROLS
      ========================== */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 z-20

          p-3 sm:p-4

          bg-linear-to-t
          from-black/95
          via-black/55
          to-transparent

          transition-all duration-300

          ${
            showControls
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }
        `}
      >
        {/* BUFFER + SEEK */}
        <div className="relative mb-3">
          {/* Buffered */}
          <div
            className="
              absolute top-1/2 -translate-y-1/2
              h-1 w-full
              rounded-full
              bg-white/10
              overflow-hidden
            "
          >
            <div
              className="
                h-full
                bg-white/20
              "
              style={{
                width: `${
                  duration
                    ? (buffered /
                        duration) *
                      100
                    : 0
                }%`,
              }}
            />
          </div>

          {/* Range */}
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={handleSeek}
            className="
              relative z-10
              w-full
              cursor-pointer
              accent-white
            "
          />
        </div>

        {/* CONTROLS ROW */}
        <div
          className="
            flex items-center justify-between
            gap-3
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PLAY */}
            <button
              onClick={togglePlay}
              className="
                flex items-center justify-center

                h-10 w-10
                sm:h-11 sm:w-11

                rounded-full

                bg-white/10
                hover:bg-white/20

                backdrop-blur-2xl

                transition-all duration-300
              "
            >
              {playing ? (
                <Pause
                  sx={{
                    fontSize: 22,
                    color: "white",
                  }}
                />
              ) : (
                <PlayArrow
                  sx={{
                    fontSize: 22,
                    color: "white",
                  }}
                />
              )}
            </button>

            {/* VOLUME */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="
                  flex items-center justify-center

                  h-10 w-10

                  rounded-full

                  bg-white/10
                  hover:bg-white/20

                  backdrop-blur-xl

                  transition
                "
              >
                <VolumeIcon
                  sx={{
                    fontSize: 20,
                    color: "white",
                  }}
                />
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={
                  muted
                    ? 0
                    : volume
                }
                onChange={
                  handleVolume
                }
                className="
                  w-24
                  cursor-pointer
                  accent-white
                "
              />
            </div>

            {/* TIME */}
            <span
              className="
                text-[11px]
                sm:text-xs

                text-white/80

                whitespace-nowrap
              "
            >
              {formatTime(
                progress,
              )}{" "}
              /{" "}
              {formatTime(
                duration,
              )}
            </span>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            {/* FULLSCREEN */}
            <button
              onClick={
                handleFullscreen
              }
              className="
                flex items-center justify-center

                h-10 w-10
                sm:h-11 sm:w-11

                rounded-full

                bg-white/10
                hover:bg-white/20

                backdrop-blur-2xl

                transition-all duration-300
              "
            >
              <Fullscreen
                sx={{
                  fontSize: 20,
                  color: "white",
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};