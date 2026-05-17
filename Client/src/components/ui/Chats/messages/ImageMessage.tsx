import {
  Close,
  Download,
  Visibility,
} from "@mui/icons-material";

import { useState } from "react";

import { useDownloadFile } from "../../../../hooks/messages/useDownloadFile";

interface ImageMessageProps {
  src: string;
  alt: string;
  fileName?: string;
}

export const ImageMessage = ({
  src,
  alt,
  fileName = "image.jpg",
}: ImageMessageProps) => {
  const [open, setOpen] =
    useState(false);

  const {
    downloading,
    progress,
    downloadFile,
  } = useDownloadFile();

  return (
    <>
      {/* =========================
          IMAGE CARD
      ========================== */}
      <div
        className="
          relative overflow-hidden

          rounded-3xl

          border border-white/10

          bg-white/4

          backdrop-blur-2xl

          shadow-[0_10px_50px_rgba(0,0,0,0.35)]

          group

          w-full
          max-w-84

          transition-all duration-500
        "
      >
        {/* BACKGROUND GLOW */}
        <div
          className="
            absolute inset-0

            bg-gradient-to-br
            from-white/[0.08]
            via-transparent
            to-white/[0.03]

            pointer-events-none
          "
        />

        {/* IMAGE */}
        <div className="relative overflow-hidden">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="
              w-full

              object-cover

              max-h-[520px]
              min-h-[220px]

              transition-transform duration-700

              group-hover:scale-[1.04]
            "
          />

          {/* OVERLAY */}
          <div
            className="
              absolute inset-0

              bg-gradient-to-t
              from-black/75
              via-black/10
              to-black/10
            "
          />

          {/* TOP GLASS */}
          <div
            className="
              absolute top-4 left-4 right-4

              flex items-center justify-between
            "
          >
            {/* TITLE */}
            <div
              className="
                max-w-[70%]

                px-4 py-2

                rounded-2xl

                bg-black/25

                backdrop-blur-2xl

                border border-white/10
              "
            >
              <p
                className="
                  text-white
                  text-xs sm:text-sm
                  font-medium

                  truncate
                "
              >
                {alt}
              </p>
            </div>

            {/* DOWNLOAD */}
            <button
              disabled={
                downloading
              }
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

                bg-black/30
                hover:bg-black/50

                backdrop-blur-2xl

                transition-all duration-300

                hover:scale-105
                active:scale-95

                shadow-xl
              "
            >
              {downloading ? (
                <span
                  className="
                    text-[11px]
                    text-white
                    font-semibold
                  "
                >
                  {progress}%
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
          </div>

          {/* BOTTOM ACTIONS */}
          <div
            className="
              absolute bottom-0 left-0 right-0

              p-4 sm:p-5
            "
          >
            <div
              className="
                flex items-end justify-between gap-3
              "
            >
              {/* INFO */}
              <div className="min-w-0">
                <p
                  className="
                    text-white
                    text-sm sm:text-[15px]
                    font-semibold

                    break-all
                    line-clamp-2
                  "
                >
                  {alt}
                </p>

                <p
                  className="
                    mt-1

                    text-[11px]
                    sm:text-xs

                    text-white/60
                  "
                >
                  High quality image
                </p>
              </div>

              {/* PREVIEW BUTTON */}
              <button
                onClick={() =>
                  setOpen(true)
                }
                className="
                  flex items-center gap-2

                  px-4 py-3
                  sm:px-5

                  rounded-2xl

                  bg-white/15
                  hover:bg-white/20

                  border border-white/10

                  backdrop-blur-2xl

                  text-white

                  transition-all duration-300

                  hover:scale-[1.03]
                  active:scale-[0.98]

                  shadow-2xl

                  flex-shrink-0
                "
              >
                <Visibility
                  sx={{
                    fontSize: 20,
                  }}
                />

                <span
                  className="
                    text-xs sm:text-sm
                    font-medium
                  "
                >
                  Preview
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          FULLSCREEN PREVIEW
      ========================== */}
      {open && (
        <div
          className="
            fixed inset-0 z-[9999]

            bg-black/92

            backdrop-blur-3xl

            flex items-center justify-center

            p-3 sm:p-5

            animate-in fade-in duration-300
          "
          onClick={() =>
            setOpen(false)
          }
        >
          {/* IMAGE WRAPPER */}
          <div
            className="
              relative

              w-full
              h-full

              flex items-center justify-center
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* IMAGE */}
            <img
              src={src}
              alt={alt}
              className="
                max-w-full
                max-h-full

                object-contain

                rounded-3xl

                shadow-[0_20px_80px_rgba(0,0,0,0.55)]

                animate-in zoom-in-95 duration-300
              "
            />

            {/* TOP CONTROLS */}
            <div
              className="
                absolute top-4 right-4

                flex items-center gap-2
              "
            >
              {/* DOWNLOAD */}
              <button
                disabled={
                  downloading
                }
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

                  bg-black/40
                  hover:bg-black/60

                  backdrop-blur-2xl

                  transition-all duration-300

                  hover:scale-105
                  active:scale-95
                "
              >
                {downloading ? (
                  <span
                    className="
                      text-[11px]
                      text-white
                      font-semibold
                    "
                  >
                    {progress}%
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

              {/* CLOSE */}
              <button
                onClick={() =>
                  setOpen(false)
                }
                className="
                  flex items-center justify-center

                  h-11 w-11
                  sm:h-12 sm:w-12

                  rounded-2xl

                  border border-white/10

                  bg-black/40
                  hover:bg-black/60

                  backdrop-blur-2xl

                  transition-all duration-300

                  hover:scale-105
                  active:scale-95
                "
              >
                <Close
                  sx={{
                    fontSize: 22,
                    color: "white",
                  }}
                />
              </button>
            </div>

            {/* BOTTOM INFO */}
            <div
              className="
                absolute bottom-0 left-0 right-0

                p-5 sm:p-6

                bg-gradient-to-t
                from-black/80
                via-black/30
                to-transparent
              "
            >
              <div
                className="
                  flex items-center justify-between gap-4
                "
              >
                <div className="min-w-0">
                  <p
                    className="
                      text-white
                      text-sm sm:text-base
                      font-semibold

                      break-all
                    "
                  >
                    {alt}
                  </p>

                  <p
                    className="
                      mt-1

                      text-xs
                      text-white/60
                    "
                  >
                    Tap outside to close
                  </p>
                </div>

                {/* MOBILE PREVIEW DOWNLOAD */}
                <button
                  onClick={() =>
                    downloadFile(
                      src,
                      fileName,
                    )
                  }
                  className="
                    sm:hidden

                    flex items-center justify-center

                    h-11 w-11

                    rounded-2xl

                    bg-white
                    text-black

                    shadow-2xl

                    active:scale-95

                    transition-all duration-300
                  "
                >
                  <Download
                    sx={{
                      fontSize: 20,
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};