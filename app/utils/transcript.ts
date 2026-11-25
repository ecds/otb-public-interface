// Reading transcripts for audio media: finding the WebVTT file in a IIIF
// Presentation 3 manifest, and turning that file into plain cues.

export interface TCue {
  start: number;
  text: string;
}

type Annotation = {
  motivation?: string | string[];
  body?: { id?: string; format?: string } | { id?: string; format?: string }[];
};
type Page = { items?: Annotation[] };
type Canvas = { annotations?: Page[] };

// The first WebVTT body of a "supplementing" annotation on any canvas.
export const transcriptUrlFrom = (manifest: unknown): string | undefined => {
  const canvases = (manifest as { items?: Canvas[] })?.items ?? [];
  for (const canvas of canvases) {
    for (const page of canvas.annotations ?? []) {
      for (const annotation of page.items ?? []) {
        const motivation = [annotation.motivation].flat();
        if (!motivation.includes("supplementing")) continue;
        const bodies = [annotation.body].flat();
        const vtt = bodies.find((body) => body?.format === "text/vtt");
        if (vtt?.id) return vtt.id;
      }
    }
  }
  return undefined;
};

// "01:02:03.500" or "02:03.500" in seconds.
const seconds = (timestamp: string) =>
  timestamp
    .split(":")
    .reduce((total, part) => total * 60 + parseFloat(part), 0);

// Cue text and start times; headers, notes and styling tags are dropped.
export const parseVtt = (vtt: string): TCue[] =>
  vtt
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .flatMap((block) => {
      const lines = block.split("\n");
      const timing = lines.findIndex((line) => line.includes("-->"));
      if (timing < 0) return [];
      const text = lines
        .slice(timing + 1)
        .join(" ")
        .replace(/<[^>]+>/g, "")
        .trim();
      if (!text) return [];
      return [{ start: seconds(lines[timing].split("-->")[0].trim()), text }];
    });

// "1:05" for 65 seconds, with hours when needed.
export const clockTime = (time: number) => {
  const whole = Math.floor(time);
  const h = Math.floor(whole / 3600);
  const m = Math.floor((whole % 3600) / 60);
  const s = String(whole % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
};
