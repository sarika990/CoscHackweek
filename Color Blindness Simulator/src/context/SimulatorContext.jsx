import React, { createContext, useState, useEffect, useContext } from 'react';
import { loadImage } from '../utils/imageLoader';
import { MAX_FILE_SIZE, SUPPORTED_FORMATS } from '../constants/constants';

const SimulatorContext = createContext();

export function SimulatorProvider({ children }) {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageSize, setImageSize] = useState(0);
  const [imageResolution, setImageResolution] = useState(null);
  const [activeMode, setActiveMode] = useState('original');
  const [compareMode, setCompareMode] = useState('sideBySide'); // sideBySide, slider, split, overlay
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: null, message: null });

  // Clear URL object on unmount or replacement to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const clearNotification = () => {
    setNotification({ type: null, message: null });
  };

  const resetSimulator = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImage(null);
    setImageUrl(null);
    setImageName('');
    setImageSize(0);
    setImageResolution(null);
    setActiveMode('original');
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsFullscreen(false);
    showNotification('info', 'Simulator reset. Upload a new image to begin.');
  };

  const handleImageFile = async (file) => {
    if (!file) return;

    if (!SUPPORTED_FORMATS.includes(file.type)) {
      showNotification('error', 'Unsupported format! Please upload PNG, JPG, JPEG or WEBP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showNotification('error', 'File is too large! Maximum limit is 10MB.');
      return;
    }

    setIsLoading(true);
    try {
      const url = URL.createObjectURL(file);
      const loadedImg = await loadImage(url);

      // Successfully loaded image
      setImage(loadedImg);
      setImageUrl(url);
      setImageName(file.name);
      setImageSize(file.size);
      setImageResolution({
        width: loadedImg.naturalWidth,
        height: loadedImg.naturalHeight
      });
      setZoom(1);
      setPan({ x: 0, y: 0 });
      showNotification('success', `Successfully loaded "${file.name}"`);
    } catch (error) {
      showNotification('error', error.message || 'Error processing the image.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SimulatorContext.Provider
      value={{
        image,
        imageUrl,
        imageName,
        imageSize,
        imageResolution,
        activeMode,
        compareMode,
        zoom,
        pan,
        sliderPosition,
        isFullscreen,
        isLoading,
        notification,
        setActiveMode,
        setCompareMode,
        setZoom,
        setPan,
        setSliderPosition,
        setIsFullscreen,
        showNotification,
        clearNotification,
        resetSimulator,
        handleImageFile,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
}
