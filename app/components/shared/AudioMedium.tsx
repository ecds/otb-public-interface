import { useEffect, useId, useRef, useState } from "react";
import { useTranscript } from "~/hooks/useTranscript";
import { altFor } from "~/utils/altText";
import { clockTime } from "~/utils/transcript";
import type { TTourMedium } from "~/types";

interface Props {
  medium: TTourMedium;
  // Where the picture comes from; mobile and desktop use different sizes.
  picture?: string;
  // Text and link colors, so it reads on light and dark backgrounds.
  className?: string;
  linkClassName?: string;
}

// An audio medium: its picture (if it has one), a native player named after
// the title, and its transcript or a note that there isn't one yet. Native
// controls are used because they work with keyboards and screen readers.
// Each transcript line's time is a button that plays from there.
const AudioMedium = ({
  medium,
  picture,
  className = "text-gray-900",
  linkClassName = "text-blue-700 visited:text-purple-800",
}: Props) => {
  const titleId = useId();
  const alt = altFor(medium);
  const player = useRef<HTMLAudioElement>(null);
  const transcript = useTranscript(medium);
  const list = useRef<HTMLOListElement>(null);
  const [current, setCurrent] = useState(-1);

  // The line being spoken: the last one that has started.
  useEffect(() => {
    const audio = player.current;
    const cues = transcript.cues;
    if (!audio || !cues?.length) return;
    const update = () => {
      let index = -1;
      while (
        index + 1 < cues.length &&
        cues[index + 1].start <= audio.currentTime
      )
        index += 1;
      setCurrent(index);
    };
    update();
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("seeked", update);
    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("seeked", update);
    };
  }, [transcript.cues]);

  // Keeps the line in view while playing, scrolling only the list, not the
  // page, and leaving it alone when paused so readers can scroll freely.
  useEffect(() => {
    const box = list.current;
    const line = box?.children[current] as HTMLElement | undefined;
    if (!box || !line || player.current?.paused) return;
    const top = line.offsetTop - box.offsetTop;
    if (
      top < box.scrollTop ||
      top + line.offsetHeight > box.scrollTop + box.clientHeight
    )
      box.scrollTop = top - box.clientHeight / 3;
  }, [current]);

  const playFrom = (start: number) => {
    const audio = player.current;
    if (!audio) return;
    audio.currentTime = start;
    void audio.play().catch(() => {});
  };

  return (
    <figure className={`flex flex-col justify-center h-full gap-2 p-2 ${className}`}>
      {picture && (
        <div
          className="grow min-h-0 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${picture})` }}
          // A CSS background, so the alt text goes on the element.
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
        />
      )}
      <figcaption id={titleId} className="font-semibold text-center">
        {medium.title}
      </figcaption>
      {/* These recordings have no caption files; the transcript below is
          their text alternative. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={player}
        className="w-full"
        controls
        // Only the length and the like until someone presses play.
        preload="metadata"
        src={medium.audio}
        aria-labelledby={titleId}
      />
      {transcript.cues?.length ? (
        <details className="text-sm min-h-0 shrink">
          <summary className="cursor-pointer text-center font-semibold">
            Transcript<span className="sr-only"> of {medium.title}</span>
          </summary>
          <ol
            ref={list}
            className="relative max-h-48 overflow-y-auto mt-1 space-y-1 text-left"
          >
            {transcript.cues.map((cue, index) => (
              <li
                key={index}
                // Shown by color and weight; aria-current tells screen readers.
                aria-current={index === current ? "true" : undefined}
                className="flex gap-2 rounded px-1 aria-[current]:bg-yellow-200 aria-[current]:text-gray-900 aria-[current]:font-semibold"
              >
                <button
                  type="button"
                  className={`underline tabular-nums shrink-0 ${linkClassName}`}
                  onClick={() => playFrom(cue.start)}
                >
                  <span className="sr-only">Play from </span>
                  {clockTime(cue.start)}
                </button>
                <span>{cue.text}</span>
              </li>
            ))}
          </ol>
        </details>
      ) : null}
      <p className="text-sm text-center flex flex-wrap justify-center gap-x-3">
        {transcript.loading ? null : transcript.url ? (
          <a
            className={`underline ${linkClassName}`}
            href={transcript.url}
            download
          >
            Download the transcript
            <span className="sr-only"> of {medium.title}</span>
          </a>
        ) : (
          <span>A transcript of this recording isn&apos;t available yet.</span>
        )}
        {/* For players that can't play it, and for listening offline. */}
        <a
          className={`underline ${linkClassName}`}
          href={medium.audio}
          download
        >
          Download<span className="sr-only"> {medium.title}</span>
        </a>
      </p>
    </figure>
  );
};

export default AudioMedium;
