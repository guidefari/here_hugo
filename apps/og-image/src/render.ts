import jetBrainsMonoBold from "@expo-google-fonts/jetbrains-mono/700Bold/JetBrainsMono_700Bold.ttf?arraybuffer&base64";
import { ImageResponse } from "@cf-wasm/og/workerd";
import { createElement } from "react";
import type { ReactNode } from "react";
import cardTemplate from "./card.png?inline";

const WIDTH = 1012;
const HEIGHT = 506;
const IMAGE_HEADERS = {
  "Cache-Control": "public, max-age=31536000, immutable",
  "Content-Disposition": 'inline; filename="og-image.png"',
  "Content-Type": "image/png",
  "X-Content-Type-Options": "nosniff",
} as const;

function titleSize(title: string): number {
  const length = Array.from(title).length;
  if (length <= 34) return 55;
  if (length <= 64) return 46;
  if (length <= 104) return 38;
  return 31;
}

function card(title: string): ReactNode {
  return createElement(
    "div",
    {
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        fontFamily: "JetBrains Mono",
        position: "relative",
        overflow: "hidden",
      },
    },
    createElement("img", {
      src: cardTemplate,
      style: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      },
    }),
    createElement(
      "div",
      {
        style: {
          display: "flex",
          position: "absolute",
          left: 374,
          top: 128,
          width: 600,
          color: "#e9eb9e",
          fontSize: titleSize(title),
          fontWeight: 700,
          lineHeight: 1.12,
          letterSpacing: -2,
          wordBreak: "break-word",
        },
      },
      title,
    ),
    createElement(
      "div",
      {
        style: {
          display: "flex",
          position: "absolute",
          left: 374,
          bottom: 53,
          width: 600,
          color: "#7da9b9",
          fontSize: 48,
          fontWeight: 700,
          letterSpacing: -2,
        },
      },
      "guidefari.com",
    ),
  );
}

/** Renders the deterministic social card returned by the Worker. */
export async function renderOgImage(title: string): Promise<Response> {
  return ImageResponse.async(card(title), {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      {
        name: "JetBrains Mono",
        data: jetBrainsMonoBold,
        weight: 700,
        style: "normal",
      },
    ],
    headers: IMAGE_HEADERS,
  });
}
