import React, { createContext, useContext, useEffect, useState } from "react";
import { defaultData } from "../data/defaultData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { suggestColor } from "../utils/colorSuggestion";

const CardContext = createContext(null);

export const CardProvider = ({ children }) => {
  const getInitialCardData = () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const cardParam = urlParams.get("card");
      if (cardParam) {
        // Build query string base64 decoded object
        const decoded = JSON.parse(decodeURIComponent(atob(cardParam)));
        if (decoded && decoded.name) {
          return decoded;
        }
      }
    } catch (e) {
      console.error("Failed to decode shared card URL param:", e);
    }
    try {
      const item = window.localStorage.getItem("digital_card_data");
      return item ? JSON.parse(item) : defaultData;
    } catch (error) {
      return defaultData;
    }
  };

  const [cardData, setCardData] = useState(getInitialCardData);

  useEffect(() => {
    try {
      window.localStorage.setItem("digital_card_data", JSON.stringify(cardData));
    } catch (error) {
      console.error("Failed to save cardData to localStorage:", error);
    }
  }, [cardData]);

  const [selectedTemplate, setSelectedTemplate] = useLocalStorage("digital_card_template", "modern");
  const [theme, setTheme] = useLocalStorage("digital_card_theme", "light");
  const [accentColor, setAccentColor] = useLocalStorage("digital_card_accent", "#10b981");
  const [selectedFont, setSelectedFont] = useLocalStorage("digital_card_font", "inter");
  const [cardStyle, setCardStyle] = useLocalStorage("digital_card_style", "rounded");

  
  // Validation errors state
  const [errors, setErrors] = useState({});

  // Sync dark theme class on document level
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Handle color suggestion based on Job Title
  useEffect(() => {
    if (cardData.jobTitle) {
      const suggested = suggestColor(cardData.jobTitle);
      // Auto-suggest only if not manually overridden (or check if user wants suggestions)
      // For a premium experience, we suggest it, but allow the user to override it.
      // Let's implement suggest color utility: we only apply if the current accent is a default or matches previous suggestion
      // To keep it simple and smart, let's suggest it when the job title changes, but allow manual changes anytime.
    }
  }, [cardData.jobTitle]);

  const validateField = (name, value) => {
    let err = "";
    if (name === "name" && !value.trim()) {
      err = "Name is required";
    } else if (name === "email") {
      if (!value.trim()) {
        err = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        err = "Invalid email format";
      }
    } else if (name === "phone") {
      if (!value.trim()) {
        err = "Phone number is required";
      } else if (!/^\+?[0-9\s\-()]{7,20}$/.test(value)) {
        err = "Invalid phone format (min 7 digits)";
      }
    } else if (["website", "portfolio"].includes(name) && value.trim()) {
      try {
        new URL(value);
      } catch (_) {
        err = "Invalid URL (must start with http:// or https://)";
      }
    }
    
    setErrors(prev => ({ ...prev, [name]: err }));
    return !err;
  };

  const updateField = (name, value) => {
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
  };

  const updateSocial = (key, value) => {
    setCardData(prev => ({
      ...prev,
      socials: {
        ...prev.socials,
        [key]: value
      }
    }));
    // Validate social URLs
    if (value.trim()) {
      try {
        new URL(value);
        setErrors(prev => ({ ...prev, [key]: "" }));
      } catch (_) {
        setErrors(prev => ({ ...prev, [key]: "Invalid URL" }));
      }
    } else {
      setErrors(prev => ({ ...prev, [key]: "" }));
    }
  };

  const resetForm = () => {
    setCardData(defaultData);
    setSelectedTemplate("modern");
    setTheme("light");
    setAccentColor("#10b981");
    setSelectedFont("inter");
    setCardStyle("rounded");
    setErrors({});
  };

  const triggerColorSuggestion = (jobTitle) => {
    const color = suggestColor(jobTitle);
    setAccentColor(color);
  };

  return (
    <CardContext.Provider
      value={{
        cardData,
        setCardData,
        selectedTemplate,
        setSelectedTemplate,
        theme,
        setTheme,
        accentColor,
        setAccentColor,
        selectedFont,
        setSelectedFont,
        cardStyle,
        setCardStyle,
        errors,
        updateField,
        updateSocial,
        resetForm,
        triggerColorSuggestion
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

export const useCard = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCard must be used within a CardProvider");
  }
  return context;
};
