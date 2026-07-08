/**
 * Format a Date object or timestamp into standard HH:MM meridiem style
 */
export const formatTimestamp = (dateValue) => {
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Copy text content to the clipboard
 */
export const copyToClipboard = async (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // Avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Local storage manager for chat conversations
 */
export const storage = {
  getChats() {
    try {
      const data = localStorage.getItem('ollama_chats');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading localStorage', e);
      return [];
    }
  },

  saveChats(chats) {
    try {
      localStorage.setItem('ollama_chats', JSON.stringify(chats));
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  }
};
