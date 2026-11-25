import { describe, expect, it } from "vitest";
import { clockTime, parseVtt, transcriptUrlFrom } from "./transcript";

describe("transcriptUrlFrom", () => {
  it("finds the WebVTT body of a supplementing annotation", () => {
    const manifest = {
      items: [
        {
          annotations: [
            {
              items: [
                { motivation: "commenting", body: { id: "/c", format: "text/vtt" } },
                {
                  motivation: ["supplementing"],
                  body: [
                    { id: "/t.txt", format: "text/plain" },
                    { id: "/t.vtt", format: "text/vtt" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    expect(transcriptUrlFrom(manifest)).toBe("/t.vtt");
  });

  it("gives nothing for manifests without one", () => {
    expect(transcriptUrlFrom({ items: [{}] })).toBeUndefined();
    expect(transcriptUrlFrom(null)).toBeUndefined();
  });
});

describe("parseVtt", () => {
  it("reads cue start times and text, without ids, notes or tags", () => {
    const vtt =
      "WEBVTT\r\n\r\nNOTE made by hand\r\n\r\n1\r\n00:00:00.330 --> 00:00:04.560 align:start\r\n<v George>George grew up</v>\r\nin Crawfordville.\r\n\r\n01:02:03.500 --> 01:02:05.000\r\nLater.\r\n";
    expect(parseVtt(vtt)).toEqual([
      { start: 0.33, text: "George grew up in Crawfordville." },
      { start: 3723.5, text: "Later." },
    ]);
  });
});

describe("clockTime", () => {
  it("formats minutes and seconds, with hours when needed", () => {
    expect(clockTime(5.9)).toBe("0:05");
    expect(clockTime(65)).toBe("1:05");
    expect(clockTime(3723.5)).toBe("1:02:03");
  });
});
