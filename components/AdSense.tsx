"use client";
import { useEffect } from "react";

interface AdSenseProps {
  slot: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
}

export default function AdSense({
  slot,
  format = "auto",
  responsive = true,
  style = { display: "block" },
}: AdSenseProps) {
  useEffect(() => {
    try {
      // ativa o anúncio depois que o componente monta
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Adsense error:", err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client="ca-pub-9307683513545162"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}

