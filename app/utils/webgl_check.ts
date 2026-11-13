// Whether MapLibre can run in this browser. Checked once per page load and
// kept in memory only, so turning WebGL on takes effect on the next load.
let supported: boolean | undefined;

export const canUseWebGL = (): boolean => {
  if (supported !== undefined) return supported;
  if (typeof document === "undefined") return false; // server render

  try {
    const canvas = document.createElement("canvas");
    // MapLibre 6 asks for WebGL 2 only.
    const gl = canvas.getContext("webgl2");
    supported = gl !== null;
    // Browsers cap open WebGL contexts, so give this one back right away.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    supported = false;
  }
  return supported;
};

// For when MapLibre fails even though the check passed, so later maps on
// the page go straight to the fallback.
export const markWebGLUnavailable = () => {
  supported = false;
};
