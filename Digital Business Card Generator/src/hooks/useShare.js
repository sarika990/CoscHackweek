import { useState } from "react";

export const useShare = () => {
  const [shareStatus, setShareStatus] = useState({ success: false, message: "" });

  const shareCard = async (cardData) => {
    let finalUrl = window.location.href;
    
    try {
      // Serialize card fields without the heavy base64 image data to keep URL length safe
      const dataToShare = {
        name: cardData.name,
        jobTitle: cardData.jobTitle,
        company: cardData.company,
        email: cardData.email,
        phone: cardData.phone,
        website: cardData.website,
        address: cardData.address,
        bio: cardData.bio,
        socials: cardData.socials
      };
      
      const serialized = btoa(encodeURIComponent(JSON.stringify(dataToShare)));
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set("card", serialized);
      finalUrl = url.toString();
    } catch (e) {
      console.error("Serialization failed, fallback to plain URL", e);
    }

    const shareDetails = {
      title: `${cardData.name || "Digital Business Card"}`,
      text: `View my Digital Business Card - ${cardData.name || ""} (${cardData.jobTitle || ""})`,
      url: finalUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareDetails);
        setShareStatus({ success: true, message: "Card shared successfully!" });
        setTimeout(() => setShareStatus({ success: false, message: "" }), 3000);
      } catch (err) {
        if (err.name !== "AbortError") {
          copyToClipboard(finalUrl);
        }
      }
    } else {
      copyToClipboard(finalUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setShareStatus({ success: true, message: "Share link copied to clipboard!" });
        setTimeout(() => setShareStatus({ success: false, message: "" }), 3000);
      })
      .catch(() => {
        setShareStatus({ success: false, message: "Could not copy link." });
      });
  };

  return { shareCard, shareStatus, copyToClipboard };
};
