import React, { useState, useCallback } from 'react';
import { Palette, Sparkles, Info, AlertCircle } from 'lucide-react';
import PromptInput from './components/PromptInput';
import SettingsPanel from './components/SettingsPanel';
import ImageGallery from './components/ImageGallery';
import { googleImageAPI } from './services/google-image-api';
import { GeneratedImage, GenerationSettings } from './types/image-generation';

function App() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: '1:1',
    guidanceScale: 7.5,
    sampleCount: 1,
    safetySettings: 'block_some'
  });

  const handleGenerate = useCallback(async (prompt: string, negativePrompt?: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await googleImageAPI.generateImages({
        prompt,
        negativePrompt,
        ...settings
      });

      if (response.error) {
        setError(response.error);
      } else {
        setImages(prev => [...response.images, ...prev]);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [settings]);

  const handleImageRemove = useCallback((imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  }, []);

  const isConfigured = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY && 
                     import.meta.env.VITE_GOOGLE_CLOUD_API_KEY !== 'YOUR_API_KEY';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Google AI Image Generator
              </h1>
              <p className="text-gray-600 mt-1">
                Create stunning images from text using Google's advanced AI models
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Configuration Notice */}
        {!isConfigured && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">
                  Demo Mode Active
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  This app is running in demo mode with placeholder images. To generate real images, 
                  configure your Google Cloud credentials in the .env file.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Generation Error
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input and Settings */}
          <div className="lg:col-span-1 space-y-6">
            <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
            <SettingsPanel 
              settings={settings}
              onSettingsChange={setSettings}
              isGenerating={isGenerating}
            />
          </div>

          {/* Right Column - Image Gallery */}
          <div className="lg:col-span-2">
            <ImageGallery images={images} onImageRemove={handleImageRemove} />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-gray-200">
          <div className="flex items-start space-x-4">
            <Info className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How to Use Google AI Image Generation
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium mb-2">Writing Effective Prompts:</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Be specific and descriptive</li>
                    <li>Include style, lighting, and mood</li>
                    <li>Mention artistic techniques or artists</li>
                    <li>Specify image composition and details</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Configuration Required:</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Google Cloud Project with Vertex AI enabled</li>
                    <li>Valid API key with appropriate permissions</li>
                    <li>Imagen API access (may require approval)</li>
                    <li>Billing account configured</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
