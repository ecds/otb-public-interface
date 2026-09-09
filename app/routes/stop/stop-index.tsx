import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDeviceContext } from "~/hooks/deviceContext";

const StopIndex = () => {
  const navigate = useNavigate();
  const { isMobile } = useDeviceContext();

  useEffect(() => {
    if (isMobile) navigate(`intro`);
  }, [isMobile, navigate]);

  return <></>;
};

export default StopIndex;
