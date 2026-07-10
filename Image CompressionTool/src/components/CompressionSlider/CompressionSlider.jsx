import React from 'react';
import { Sliders, Settings2, Image } from 'lucide-react';
import './CompressionSlider.css';

const PRESETS = [
  { name: 'Max Quality', value: 100 },
  { name: 'High', value: 85 },
  { name: 'Balanced', value: 70 },
  { name: 'Medium', value: 50 },
  { name: 'Aggressive', value: 20 },
];

export default function CompressionSlider({ 
  quality, 
  onQualityChange, 
  format, 
  onFormatChange,
  isProcessing
}) {
  const handlePresetClick = (val) => {
    onQualityChange(val);
  };

  const getActivePreset = () => {
    const matched = PRESETS.find(p => p.value === quality);
    return matched ? matched.name : 'Custom';
  };

  const currentPreset = getActivePreset();

  return (
    <div className="controls-card glass-card">
      <div className="controls-header">
        <Settings2 size={18} className="controls-icon" />
        <h4 className="controls-title">Compression Parameters</h4>
      </div>

      {/* Format Options */}
      <div className="control-group">
        <label className="control-label">
          <Image size={14} /> Output Format
        </label>
        <div className="format-selector">
          {['image/jpeg', 'image/png', 'image/webp'].map((fmt) => {
            const label = fmt.split('/')[1].toUpperCase();
            return (
              <button
                key={fmt}
                className={`format-btn ${format === fmt ? 'active' : ''}`}
                onClick={() => onFormatChange(fmt)}
                disabled={isProcessing}
              >
                {label}
              </button>
            );
          })}
        </div>
        {format === 'image/png' && (
          <p className="format-warning">
            Note: PNG is a lossless format. Quality optimization slider will be disabled.
          </p>
        )}
      </div>

      {/* Quality Slider */}
      <div className={`control-group ${format === 'image/png' ? 'disabled-group' : ''}`}>
        <div className="slider-header">
          <label className="control-label">
            <Sliders size={14} /> Compression Quality
          </label>
          <span className="quality-value">{quality}%</span>
        </div>

        <input
          type="range"
          min="1"
          max="100"
          value={quality}
          onChange={(e) => onQualityChange(parseInt(e.target.value))}
          disabled={format === 'image/png' || isProcessing}
          aria-label="Compression quality slider"
        />

        {/* Presets */}
        <div className="presets-wrapper">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              className={`preset-btn ${currentPreset === preset.name ? 'active' : ''}`}
              onClick={() => handlePresetClick(preset.value)}
              disabled={format === 'image/png' || isProcessing}
            >
              {preset.name}
            </button>
          ))}
          <button
            className={`preset-btn ${currentPreset === 'Custom' ? 'active' : ''}`}
            disabled
          >
            Custom
          </button>
        </div>
      </div>
    </div>
  );
}
