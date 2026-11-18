import { useState } from "react";
import MarkerPin from "./MarkerPin";

interface Props {
  image?: string;
  color?: string;
  position?: number;
  current?: boolean;
}

// A custom icon at half its natural size (half again when current), or a
// pin.
const MarkerIcon = ({ image, color, position, current = false }: Props) => {
  const [width, setWidth] = useState<number>();

  if (!image)
    return <MarkerPin color={color} position={position} isCurrent={current} />;

  return (
    <img
      src={image}
      alt=""
      onLoad={(event) => setWidth(event.currentTarget.naturalWidth / 2)}
      style={{
        width: width && (current ? width * 1.5 : width),
        // Hidden until its size is known, so it doesn't jump.
        visibility: width ? "visible" : "hidden",
      }}
    />
  );
};

export default MarkerIcon;
