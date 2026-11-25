import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AudioMedium from "./AudioMedium";
import type { TTourMedium } from "~/types";

const medium = {
  title: "Antioch 1- Memories",
  audio: "https://example.org/antioch.mp3",
  files: {},
} as unknown as TTourMedium;

const player = (container: HTMLElement) => container.querySelector("audio")!;

describe("AudioMedium", () => {
  it("names the player after the recording's title", () => {
    const { container } = render(<AudioMedium medium={medium} />);
    const audio = player(container);
    const title = screen.getByText("Antioch 1- Memories", {
      selector: "figcaption",
    });
    expect(audio).toHaveAttribute("aria-labelledby", title.id);
    expect(audio).toHaveAttribute("src", "https://example.org/antioch.mp3");
  });

  it("never autoplays, and only loads the metadata up front", () => {
    const { container } = render(<AudioMedium medium={medium} />);
    expect(player(container)).toHaveAttribute("controls");
    expect(player(container)).toHaveAttribute("preload", "metadata");
    expect(player(container)).not.toHaveAttribute("autoplay");
  });

  it("offers a download", () => {
    render(<AudioMedium medium={medium} />);
    expect(
      screen.getByRole("link", { name: "Download Antioch 1- Memories" }),
    ).toHaveAttribute("href", "https://example.org/antioch.mp3");
  });

  it("says when there's no transcript yet", () => {
    render(<AudioMedium medium={medium} />);
    expect(screen.getByText(/transcript .* isn't available/)).toBeVisible();
  });

  describe("with a manifest", () => {
    const manifest = {
      items: [
        {
          annotations: [
            {
              items: [
                {
                  motivation: "supplementing",
                  body: { id: "https://example.org/t.vtt", format: "text/vtt" },
                },
              ],
            },
          ],
        },
      ],
    };
    const vtt =
      "WEBVTT\n\n1\n00:00:00.330 --> 00:00:04.560\nGeorge grew up.\n\n2\n00:01:05.000 --> 00:01:06.000\nBack then,\n";

    afterEach(() => vi.unstubAllGlobals());

    const withManifest = () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(async (url: string) =>
          url.endsWith(".vtt")
            ? new Response(vtt)
            : new Response(JSON.stringify(manifest)),
        ),
      );
      return render(
        <AudioMedium
          medium={{ ...medium, manifest: "https://example.org/manifest" }}
        />,
      );
    };

    it("shows the transcript the manifest lists", async () => {
      withManifest();
      expect(await screen.findByText("George grew up.")).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: "Download the transcript of Antioch 1- Memories",
        }),
      ).toHaveAttribute("href", "https://example.org/t.vtt");
      expect(screen.queryByText(/isn't available/)).not.toBeInTheDocument();
    });

    it("plays from a line's time", async () => {
      const { container } = withManifest();
      const audio = player(container);
      const play = vi.spyOn(audio, "play").mockResolvedValue();
      fireEvent.click(
        await screen.findByRole("button", { name: "Play from 1:05" }),
      );
      expect(audio.currentTime).toBe(65);
      expect(play).toHaveBeenCalled();
    });

    it("highlights the line being spoken", async () => {
      const { container } = withManifest();
      const audio = player(container);
      const line = (await screen.findByText("Back then,")).closest("li")!;
      expect(line).not.toHaveAttribute("aria-current");
      audio.currentTime = 65.5;
      fireEvent(audio, new Event("timeupdate"));
      expect(line).toHaveAttribute("aria-current", "true");
      expect(
        screen.getByText("George grew up.").closest("li"),
      ).not.toHaveAttribute("aria-current");
    });

    it("says there's no transcript when the manifest lists none", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(async () => new Response(JSON.stringify({ items: [{}] }))),
      );
      render(<AudioMedium medium={{ ...medium, manifest: "/m" }} />);
      expect(await screen.findByText(/isn't available/)).toBeVisible();
    });
  });

  it("shows the picture without making it a separate image when decorative", () => {
    const { container } = render(
      <AudioMedium medium={{ ...medium, decorative: true }} picture="/p.jpg" />,
    );
    expect(container.innerHTML).toContain("/p.jpg");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
