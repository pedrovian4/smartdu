"use client";
import { useEffect } from "react";
import { GoogleAdSense, ResponsiveAdUnit } from "nextjs-google-adsense";



export default function AdSense() {
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
    <>
      <GoogleAdSense publisherId="pub-9307683513545162" />





    </>

  );
}

