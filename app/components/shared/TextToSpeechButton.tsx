import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones, faPause } from "@fortawesome/free-solid-svg-icons";
import { TourContext } from "~/contexts/tourContext";

interface Props {
  text: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TextToSpeechButton = ({ text, size = "md", className = "" }: Props) => {
  const { tour } = useContext(TourContext);
  const [isReading, setIsReading] = useState<boolean>(false);
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
      console.info("This browser does not support speechSynthesis");
      return;
    }

    if (!text) {
      console.error("No text available to read");
    }

    const _synth = window.speechSynthesis;

    setSynth(_synth);
  }, []);

  useEffect(() => {
    if (!synth) return;

    const _utterance = new SpeechSynthesisUtterance(text);
    _utterance.lang = tour?.attributes.default_lng || navigator.language;
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
  }, [synth, text]);

  useEffect(() => {
    if (!synth || !utterance) return;

    setIsReading(synthState === "reading" || synthState === "resumed");

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

  const handleTextToSpeech = () => {
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

  if (!isSupported) {
    return <></>; // Don't render if not supported
  }

  // Size classes
  const sizeClasses = {
    sm: "text-sm p-1",
    md: "text-base p-2",
    lg: "text-lg p-3",
  };

  return (
    <button
      onClick={handleTextToSpeech}
      className={`
          inline-flex items-center justify-center
          rounded-full bg-gray-100 hover:bg-gray-200 
          text-gray-600 hover:text-gray-800
          transition-colors duration-200
          ${sizeClasses[size]}
          ${
            isReading
              ? "bg-blue-100 text-blue-600 outline-none ring-2 ring-blue-500 ring-offset-2 animate-pulse"
              : ""
          }
          ${className}
        `}
      title={isReading ? "Stop reading" : "Read text aloud"}
      aria-label={isReading ? "Stop reading text" : "Read text aloud"}
    >
      <FontAwesomeIcon
        icon={isReading ? faPause : faHeadphones}
        className="w-4 h-4"
      />
    </button>
  );
};

export default TextToSpeechButton;
