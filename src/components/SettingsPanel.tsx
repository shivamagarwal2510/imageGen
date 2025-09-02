import React from 'react';
import { Settings, Sliders, Shield, Image } from 'lucide-react';
import { GenerationSettings } from '../types/image-generation';

interface SettingsPanelProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: GenerationSettings) => void;
  isGenerating: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  onSettingsChange, 
  isGenerating 
}) => {
  const updateSetting = <K extends keyof GenerationSettings>(
    key: K, 
    value: GenerationSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const aspectRatios = [
    { value: '1:1', label: 'Square (1:1)', icon: '□' },
    { value: '16:9', label: 'Landscape (16:9)', icon: '▭' },
    { value: '9:16', label: 'Portrait (9:16)', icon: '▯' },
    { value: '4:3', label: 'Standard (4:3)', icon: '▬' },
    { value: '3:4', label: 'Photo (3:4)', icon: '▮' }
  ] as const;

  const safetyLevels = [
    { value: 'block_most', label: 'Strict', description: 'Block most content' },
    { value: 'block_some', label: 'Moderate', description: 'Block some content' },
    { value: 'block_few', label: 'Relaxed', description: 'Block minimal content' },
    { value: 'block_none', label: 'Off', description: 'No content blocking' }
  ] as const;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center mb-6">
        <Settings className="w-5 h-5 text-gray-700 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Generation Settings</h3>
      </div>

      <div className="space-y-6">
        {/* Aspect Ratio */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Image className="w-4 h-4 mr-2" />
            Aspect Ratio
          </label>
          <div className="grid grid-cols-1 gap-2">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.value}
                onClick={() => updateSetting('aspectRatio', ratio.value)}
                disabled={isGenerating}
                className={`flex items-center p-3 rounded-lg border-2 transition-all ${
                  settings.aspectRatio === ratio.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                } ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-lg mr-3">{ratio.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{ratio.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Guidance Scale */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Sliders className="w-4 h-4 mr-2" />
            Guidance Scale: {settings.guidanceScale}
          </label>
          <input
            type="range"
            min="1"
            max="20"
            step="0.5"
            value={settings.guidanceScale}
            onChange={(e) => updateSetting('guidanceScale', parseFloat(e.target.value))}
            disabled={isGenerating}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Creative</span>
            <span>Precise</span>
          </div>
        </div>

        {/* Sample Count */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            Number of Images: {settings.sampleCount}
          </label>
          <input
            type="range"
            min="1"
            max="4"
            step="1"
            value={settings.sampleCount}
            onChange={(e) => updateSetting('sampleCount', parseInt(e.target.value))}
            disabled={isGenerating}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>4</span>
          </div>
        </div>

        {/* Safety Settings */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Shield className="w-4 h-4 mr-2" />
            Safety Filter
          </label>
          <div className="space-y-2">
            {safetyLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => updateSetting('safetySettings', level.value)}
                disabled={isGenerating}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  settings.safetySettings === level.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                } ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="text-left">
                  <div className="font-medium">{level.label}</div>
                  <div className="text-xs opacity-70">{level.description}</div>
                </div>
                {settings.safetySettings === level.value && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
