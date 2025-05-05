import { createContext } from "react";

interface Context {
  resize: undefined | (() => void);
}

export const ScrollamaContext = createContext<Context>({
  resize: undefined,
});
