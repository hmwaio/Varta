import {
  Download,
  GraphicEq,
  Pause,
  PlayArrow,
  VolumeDown,
  VolumeMute,
  VolumeUp,
} from "@mui/icons-material";

import { useEffect, useMemo, useRef, useState } from "react";

import { useDownloadFile } from "../../../../hooks/messages/useDownloadFile";

interface AudioMessageProps {
  src: string;
  mimeType?: string;
  fileName?: string;
  title?: string;
}

export const AudioMessage = ({
  src,
  mimeType,
  fileName = "audio-message.mp3",
  title = "Audio Message",
}: AudioMessageProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [duration, setDuration] = useState(0);

  const [currentTime, setCurrentTime] = useState(0);

  const [volume, setVolume] = useState(1);

  const [muted, setMuted] = useState(false);

  const { downloading, progress, downloadFile } = useDownloadFile();

  /* ───────────────── PLAY / PAUSE ───────────────── */
  const togglePlayback = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();

        setIsPlaying(false);
      } else {
        await audioRef.current.play();

        setIsPlaying(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ───────────────── SEEK ───────────────── */
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const time = Number(e.target.value);

    audioRef.current.currentTime = time;

    setCurrentTime(time);
  };

  /* ───────────────── VOLUME ───────────────── */
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const value = Number(e.target.value);

    audioRef.current.volume = value;

    setVolume(value);

    setMuted(value === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (muted) {
      audioRef.current.muted = false;

      audioRef.current.volume = volume || 1;

      setMuted(false);
    } else {
      audioRef.current.muted = true;

      setMuted(true);
    }
  };

  /* ───────────────── EVENTS ───────────────── */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const onLoaded = () => {
      setDuration(audio.duration || 0);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", onLoaded);

    audio.addEventListener("timeupdate", onTimeUpdate);

    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);

      audio.removeEventListener("timeupdate", onTimeUpdate);

      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  /* ───────────────── FORMAT ───────────────── */
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) {
      return "0:00";
    }

    const mins = Math.floor(time / 60);

    const secs = Math.floor(time % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  /* ───────────────── WAVE BARS ───────────────── */
  const bars = useMemo(
    () =>
      Array.from({
        length: 38,
      }),
    [],
  );

  const VolumeIcon = muted ? VolumeMute : volume < 0.5 ? VolumeDown : VolumeUp;

  return (
    <div
      className="
        w-full
        min-w-[260px]
        max-w-[760px]
      "
    >
      {/* Hidden Native Audio */}
      <audio ref={audioRef} preload="metadata">
        <source src={src} type={mimeType} />
      </audio>

      {/* =========================
          PLAYER
      ========================== */}
      <div
        className="
          relative overflow-hidden

          rounded-[28px]

          border border-white/10

          bg-white/[0.04]

          backdrop-blur-2xl

          shadow-[0_10px_50px_rgba(0,0,0,0.25)]

          px-4 py-4 sm:px-5 sm:py-5
        "
      >
        {/* Background Glow */}
        <div
          className="
            absolute inset-0

            bg-gradient-to-br
            from-white/[0.06]
            via-transparent
            to-white/[0.03]

            pointer-events-none
          "
        />

        {/* TOP */}
        <div
          className="
            relative

            flex items-center gap-3 sm:gap-4
          "
        >
          {/* PLAY */}
          <button
            onClick={togglePlayback}
            className="
              relative

              flex items-center justify-center

              h-14 w-14
              sm:h-16 sm:w-16

              rounded-full

              bg-white
              text-black

              shadow-2xl

              hover:scale-105
              active:scale-95

              transition-all duration-300

              flex-shrink-0
            "
          >
            {isPlaying ? (
              <Pause
                sx={{
                  fontSize: 30,
                }}
              />
            ) : (
              <PlayArrow
                sx={{
                  fontSize: 30,
                }}
              />
            )}
          </button>

          {/* CONTENT */}
          <div className="flex-1 min-w-0">
            {/* TITLE */}
            <div
              className="
                flex items-center gap-2
              "
            >
              <GraphicEq
                sx={{
                  fontSize: 18,
                  color: "rgba(255,255,255,0.7)",
                }}
              />

              <p
                className="
                  text-white
                  text-sm sm:text-[15px]
                  font-medium

                  truncate
                "
              >
                {title}
              </p>
            </div>

            {/* WAVE */}
            <div
              className="
                relative

                mt-3

                h-12

                flex items-end gap-[3px]

                overflow-hidden
              "
            >
              {/* Active Progress */}
              <div
                className="
                  absolute left-0 top-0 bottom-0

                  bg-gradient-to-r
                  from-sky-400/20
                  via-blue-500/10
                  to-violet-500/10

                  rounded-xl

                  transition-all duration-300
                "
                style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                }}
              />

              {/* Bars */}
              {bars.map((_, index) => {
                const height =
                  12 + Math.sin(index * 0.8) * 14 + Math.random() * 10;

                const active = duration
                  ? index < (currentTime / duration) * bars.length
                  : false;

                return (
                  <div
                    key={index}
                    className={`
                        flex-1 rounded-full transition-all duration-300

                        ${
                          active
                            ? "bg-gradient-to-t from-sky-400 via-blue-500 to-violet-400"
                            : "bg-white/15"
                        }

                        ${isPlaying && active ? "animate-pulse" : ""}
                      `}
                    style={{
                      height,
                    }}
                  />
                );
              })}
            </div>

            {/* SEEK */}
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="
                mt-3

                w-full

                cursor-pointer

                accent-white
              "
            />

            {/* TIME */}
            <div
              className="
                mt-2

                flex items-center justify-between
              "
            >
              <span
                className="
                  text-[11px]
                  text-white/60
                "
              >
                {formatTime(currentTime)}
              </span>

              <span
                className="
                  text-[11px]
                  text-white/60
                "
              >
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM CONTROLS */}
        <div
          className="
            relative

            mt-4 pt-4

            border-t border-white/5

            flex items-center justify-between gap-3
          "
        >
          {/* VOLUME */}
          <div
            className="
              hidden sm:flex
              items-center gap-3
            "
          >
            <button
              onClick={toggleMute}
              className="
                flex items-center justify-center

                h-10 w-10

                rounded-full

                bg-white/10
                hover:bg-white/15

                backdrop-blur-xl

                transition-all duration-300
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
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className="
                w-24

                cursor-pointer

                accent-white
              "
            />
          </div>

          {/* DOWNLOAD */}
          <button
            disabled={downloading}
            onClick={() => downloadFile(src, fileName)}
            className="
              flex items-center gap-2 ml-auto px-4 py-2.5 rounded-2xl bg-white/10
              hover:bg-white/15

              border border-white/10

              backdrop-blur-2xl

              text-white

              transition-all duration-300

              hover:scale-[1.02]
              active:scale-[0.98]
            "
          >
            <Download
              sx={{
                fontSize: 18,
              }}
            />

            <span
              className="
                text-xs sm:text-sm
                font-medium
              "
            >
              {downloading ? `${progress}%` : "Download"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
