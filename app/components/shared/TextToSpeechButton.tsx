import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp, faVolumeMute, faHeadphones } from "@fortawesome/free-solid-svg-icons";

interface Props {
  text: string;
  variant?: 'speaker' | 'headphones';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TextToSpeechButton = ({ 
  text, 
  variant = 'headphones', 
  size = 'md',
  className = '' 
}: Props) => {
  const [isReading, setIsReading] = useState(false);
  const [isSupported] = useState(() => 
    typeof window !== 'undefined' && 'speechSynthesis' in window
  );

  const handleTextToSpeech = () => {
    if (!isSupported) {
      alert('Text-to-speech is not supported in your browser');
      return;
    }

    if (isReading) {
      // Stop current speech
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      // Start new speech
      window.speechSynthesis.cancel(); // Stop any existing speech first
      
      // Clean HTML tags and extra whitespace from text
      const cleanText = text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ')    // Replace multiple whitespace with single space
        .trim();

      if (!cleanText) {
        console.warn('No text available to read');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Configure speech settings
      utterance.rate = 0.9;    // Slightly slower for better comprehension
      utterance.pitch = 1;     // Normal pitch
      utterance.volume = 1;    // Full volume

      // Event handlers
      utterance.onstart = () => {
        setIsReading(true);
      };

      utterance.onend = () => {
        setIsReading(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsReading(false);
      };

      utterance.onpause = () => {
        setIsReading(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  // Icon selection
  const getIcon = () => {
    if (variant === 'headphones') {
      return faHeadphones;
    }
    return isReading ? faVolumeMute : faVolumeUp;
  };

  // Size classes
  const sizeClasses = {
    sm: 'text-sm p-1',
    md: 'text-base p-2',
    lg: 'text-lg p-3'
  };

  return (
    <button
      onClick={handleTextToSpeech}
      className={`
        inline-flex items-center justify-center
        rounded-full bg-gray-100 hover:bg-gray-200 
        text-gray-600 hover:text-gray-800
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${sizeClasses[size]}
        ${isReading ? 'bg-blue-100 text-blue-600' : ''}
        ${className}
      `}
      title={isReading ? 'Stop reading' : 'Read text aloud'}
      aria-label={isReading ? 'Stop reading text' : 'Read text aloud'}
    >
      <FontAwesomeIcon 
        icon={getIcon()} 
        className={isReading ? 'animate-pulse' : ''}
      />
    </button>
  );
};

export default TextToSpeechButton;