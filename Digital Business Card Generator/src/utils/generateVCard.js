export const generateVCard = (data) => {
  const { name, jobTitle, company, email, phone, website, address } = data;
  
  // Build vCard standard fields, escaping or omitting empty fields
  const parts = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${name || ""}`,
    `ORG:${company || ""}`,
    `TITLE:${jobTitle || ""}`,
    `TEL;TYPE=CELL:${phone || ""}`,
    `EMAIL;TYPE=PREF,INTERNET:${email || ""}`,
    `URL:${website || ""}`,
    `ADR;TYPE=WORK:;;${address ? address.replace(/;/g, "\\;") : ""};;;;`,
    "REV:" + new Date().toISOString(),
    "END:VCARD"
  ];
  
  return parts.filter(part => !part.endsWith(":")).join("\n");
};
