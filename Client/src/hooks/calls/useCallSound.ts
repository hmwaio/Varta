// import { useEffect, useRef } from "react";
// import type { CallState } from "../../types/calls.type";

// export const useCallSound = (callState: CallState) => {
//   const ringtoneRef = useRef<HTMLAudioElement | null>(null);

//   useEffect(() => {
//     ringtoneRef.current = new Audio("/sounds/ringtone.mp3");
//     ringtoneRef.current.loop = true;
//     return () => {
//       ringtoneRef.current?.pause();
//       ringtoneRef.current = null;
//     };
//   }, []);

//   useEffect(() => {
//     if (callState === "incoming" || callState === "calling") {
//       ringtoneRef.current?.play().catch(console.error);
//     } else {
//       ringtoneRef.current?.pause();
//       if (ringtoneRef.current) ringtoneRef.current.currentTime = 0;
//     }

//     if (callState === "active") {
//       new Audio("/sounds/call-connected.mp3").play().catch(console.error);
//     }

//     if (callState === "idle") {
//       new Audio("/sounds/call-ended.mp3").play().catch(console.error);
//     }
//   }, [callState]);
// };







// hooks/calls/useCallSound.ts
import { useEffect, useRef } from "react";
import type { CallState } from "../../types/calls.type";

let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
};

type ToneOptions = {
  frequency: number;
  duration: number;
  volume?: number;
  type?: OscillatorType;
  delay?: number;
};

const playTone = ({
  frequency,
  duration,
  volume = 0.15,
  type = "sine",
  delay = 0,
}: ToneOptions) => {
  const ctx = getCtx();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = frequency;

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime + delay;

  // Smooth attack/release
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + duration
  );

  osc.start(now);
  osc.stop(now + duration);
};

const playChord = (
  frequencies: number[],
  duration: number,
  volume = 0.12,
  type: OscillatorType = "sine"
) => {
  frequencies.forEach((freq) => {
    playTone({
      frequency: freq,
      duration,
      volume,
      type,
    });
  });
};

/**
 * Incoming ringtone
 * Soft modern iPhone/WhatsApp style
 */
const playIncomingRing = () => {
  playChord([523.25, 659.25], 0.35, 0.08, "sine");

  playTone({
    frequency: 783.99,
    duration: 0.25,
    volume: 0.07,
    delay: 0.18,
    type: "triangle",
  });

  setTimeout(() => {
    playChord([523.25, 659.25], 0.35, 0.08, "sine");
  }, 450);
};

/**
 * Outgoing calling tone
 */
const playCallingTone = () => {
  playTone({
    frequency: 440,
    duration: 0.5,
    volume: 0.06,
    type: "triangle",
  });

  setTimeout(() => {
    playTone({
      frequency: 440,
      duration: 0.5,
      volume: 0.06,
      type: "triangle",
    });
  }, 700);
};

/**
 * Connected sound
 */
const playConnectedTone = () => {
  playChord([523.25, 659.25, 783.99], 0.18, 0.08, "sine");
};

/**
 * End call sound
 */
const playEndTone = () => {
  playTone({
    frequency: 440,
    duration: 0.15,
    volume: 0.08,
    type: "triangle",
  });

  playTone({
    frequency: 349.23,
    duration: 0.25,
    volume: 0.07,
    delay: 0.12,
    type: "sine",
  });
};

export const useCallSound = (callState: CallState) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    stopLoop();

    if (callState === "incoming") {
      playIncomingRing();

      intervalRef.current = setInterval(() => {
        playIncomingRing();
      }, 3000);
    }

    if (callState === "calling") {
      playCallingTone();

      intervalRef.current = setInterval(() => {
        playCallingTone();
      }, 2000);
    }

    if (callState === "active") {
      playConnectedTone();
    }

    if (callState === "idle") {
      playEndTone();
    }

    return () => stopLoop();
  }, [callState]);
};