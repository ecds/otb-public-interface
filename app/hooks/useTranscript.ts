import { useEffect, useState } from "react";
import { parseVtt, transcriptUrlFrom  } from "~/utils/transcript";
import type { TTourMedium } from "~/types";
import type {TCue} from "~/utils/transcript";

export interface TTranscript {
  // The WebVTT file, for linking and for the player's captions track.
  url?: string;
  cues?: TCue[];
  loading: boolean;
}

// An audio medium's transcript: its own WebVTT link, or the one its IIIF
// manifest lists. Anything that fails leaves it without a transcript.
export const useTranscript = (medium: TTourMedium): TTranscript => {
  const { transcript, manifest } = medium;
  const [state, setState] = useState<TTranscript>({
    loading: !!(transcript || manifest),
  });

  useEffect(() => {
    if (!transcript && !manifest) {
      setState({ loading: false });
      return;
    }
    const controller = new AbortController();
    const get = (url: string) =>
      fetch(url, { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error(`${response.status} ${url}`);
        return response;
      });

    setState({ loading: true });
    (async () => {
      try {
        const url =
          transcript ??
          transcriptUrlFrom(await (await get(manifest!)).json());
        if (!url) {
          setState({ loading: false });
          return;
        }
        const cues = parseVtt(await (await get(url)).text());
        setState({ url, cues, loading: false });
      } catch {
        if (!controller.signal.aborted) setState({ loading: false });
      }
    })();

    return () => controller.abort();
  }, [transcript, manifest]);

  return state;
};
