export const colorSuggestions = [
  { name: "Software Developer / Engineer", keywords: ["dev", "engineer", "coder", "programmer", "software", "tech"], color: "#2563eb", nameColor: "Blue" },
  { name: "Designer / Artist", keywords: ["design", "art", "creative", "ux", "ui", "illustrator", "photographer"], color: "#8b5cf6", nameColor: "Purple" },
  { name: "Marketing / Sales / Writer", keywords: ["market", "sale", "writer", "copy", "pr", "social", "media", "seo"], color: "#ea580c", nameColor: "Orange" },
  { name: "Medical / Doctor / Health", keywords: ["doctor", "nurse", "health", "medical", "physio", "dentist"], color: "#16a34a", nameColor: "Green" },
  { name: "Teacher / Educator", keywords: ["teach", "professor", "educator", "tutor", "instructor", "academic"], color: "#4f46e5", nameColor: "Indigo" },
  { name: "Business / Manager / Executive", keywords: ["manager", "ceo", "exec", "founder", "director", "lead", "business", "consultant"], color: "#0f172a", nameColor: "Slate" }
];

export const suggestColor = (jobTitle) => {
  if (!jobTitle) return "#10b981"; // Default green liquid accent
  const query = jobTitle.toLowerCase();
  
  for (const suggestion of colorSuggestions) {
    if (suggestion.keywords.some(keyword => query.includes(keyword))) {
      return suggestion.color;
    }
  }
  
  return "#10b981"; // Fallback to green accent
};
