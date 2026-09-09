import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface Props {
  filename: string;
  className?: string;
}

const CopyMediumLink = ({ filename, className = "text-blue-500 hover:text-blue-800" }: Props) => {
  const [directLink, setDirectLink] = useState<string>();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!window) return;
    const { protocol, host, pathname } = window.location;
    setDirectLink(`${protocol}//${host}${pathname}?${filename}`);
  }, [filename]);

  const handleClick = async () => {
    if (!directLink) return;
    try {
      // Use the modern Clipboard API
      await navigator.clipboard.writeText(directLink);
      setIsCopied(true);

      // Reset the button text back to "Copy" after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (directLink) {
    return (
      <button
        onClick={handleClick}
        disabled={isCopied}
        className={`ps-4 pt-2 underline ${className}`}
      >
        {isCopied ? (
          "Copied"
        ) : (
          <>
            Copy Link <FontAwesomeIcon icon={faCopy} />
          </>
        )}
      </button>
    );
  }
  return <></>;
};

export default CopyMediumLink;
