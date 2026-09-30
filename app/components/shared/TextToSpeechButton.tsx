import { faHeadphones, faPause } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { TourContext } from "~/contexts/TourContext";
import { useDeviceContext } from "~/hooks/deviceContext";

interface Props {
  text: string;
  voiceOverUrl?: string;
}

interface Narration {
  isAvailable: boolean;
  isReading: boolean;
  toggle: () => void;
  readingLabel: string;
  notReadingLabel: string;
}

// Plays a recorded voice-over file, when one is available for the stop/tour.
const useAudioNarration = (url: string | undefined): Narration => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    if (!url) return;

    const audio = new Audio(url);
    const handlePlay = () => setIsReading(true);
    const handleStop = () => setIsReading(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handleStop);
    audio.addEventListener("ended", handleStop);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handleStop);
      audio.removeEventListener("ended", handleStop);
      audioRef.current = null;
    };
  }, [url]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  return {
    isAvailable: Boolean(url),
    isReading,
    toggle,
    readingLabel: "Pause narration",
    notReadingLabel: "Play narration",
  };
};

// Falls back to the browser's speech synthesis ("robot voice") when no voice-over is available.
const useSpeechNarration = (text: string, defaultLng: string | undefined): Narration => {
  const [synthState, setSynthState] = useState<
    "reading" | "paused" | "stopped" | "resumed"
  >("stopped");
  const [synth, setSynth] = useState<SpeechSynthesis | undefined>(undefined);
  const [utterance, setUtterance] = useState<
    SpeechSynthesisUtterance | undefined
  >(undefined);
  const [isSupported] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window
  );

  useEffect(() => {
    if (!isSupported) {
      console.warn("This browser does not support speechSynthesis");
      return;
    }

    if (!text) {
      console.warn("No text available to read");
    }

    setSynth(window.speechSynthesis);
  }, [isSupported, text]);

  useEffect(() => {
    if (!synth) return;

    const _utterance = new SpeechSynthesisUtterance(text);
    _utterance.lang = defaultLng || navigator.language;
    const voice =
      synth.getVoices().find((voice) => voice.lang == _utterance.lang) ||
      synth.getVoices()[0];
    _utterance.voice = voice;
    _utterance.rate = 0.9; // Slightly slower for better comprehension
    _utterance.pitch = 1; // Normal pitch
    _utterance.volume = 1; // Full volume
    _utterance.onend = () => setSynthState("stopped");
    _utterance.onstart = () => setSynthState("reading");
    _utterance.onpause = () => setSynthState("paused");
    _utterance.onresume = () => setSynthState("resumed");
    _utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      setSynthState("stopped");
    };

    setUtterance(_utterance);
  }, [synth, text, defaultLng]);

  useEffect(() => {
    if (!synth || !utterance) return;

    switch (synthState) {
      case "stopped":
        synth.cancel();
        break;
      case "reading":
        synth.speak(utterance);
        break;
      case "resumed":
        synth.resume();
        break;
      case "paused":
        synth.pause();
        break;
      default:
        break;
    }
  }, [synth, utterance, synthState]);

  const toggle = () => {
    switch (synthState) {
      case "reading":
      case "resumed":
        setSynthState("paused");
        break;
      case "paused":
        setSynthState("resumed");
        break;
      case "stopped":
        setSynthState("reading");
        break;
      default:
        break;
    }
  };

  return {
    isAvailable: isSupported,
    isReading: synthState === "reading" || synthState === "resumed",
    toggle,
    readingLabel: "Stop reading",
    notReadingLabel: "Read text aloud",
  };
};

const TextToSpeechButton = ({ text, voiceOverUrl }: Props) => {
  const { tour } = useContext(TourContext);
  const { isDesktop } = useDeviceContext();

  const audioNarration = useAudioNarration(voiceOverUrl);
  const speechNarration = useSpeechNarration(text, tour?.default_lng);

  // A recorded voice-over, when present, replaces the synthesized "robot voice" entirely.
  const narration = audioNarration.isAvailable ? audioNarration : speechNarration;

  if (!narration.isAvailable || isDesktop) {
    return <></>;
  }

  return (
    <span className={"me-3 mt-4 float-left"}>
      <button
        onClick={narration.toggle}
        className={`inline text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer ${
          narration.isReading ? "animate-pulse" : ""
        }`}
        title={narration.isReading ? narration.readingLabel : narration.notReadingLabel}
        aria-label={narration.isReading ? narration.readingLabel : narration.notReadingLabel}
      >
        <FontAwesomeIcon
          icon={narration.isReading ? faPause : faHeadphones}
        />
      </button>
    </span>
  );
};

export default TextToSpeechButton;
