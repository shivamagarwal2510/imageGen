import { useState, useCallback } from "react";
import { Palette, Info, AlertCircle } from "lucide-react";
import PromptInput from "./components/PromptInput";
import SettingsPanel from "./components/SettingsPanel";
import ImageGallery from "./components/ImageGallery";
import { googleImageAPI } from "./services/google-image-api";
import { GeneratedImage, GenerationSettings } from "./types/image-generation";

function App() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: "1:1",
    guidanceScale: 7.5,
    sampleCount: 1,
    safetySettings: "block_some"
  });

  const handleSignIn = useCallback(async () => {
    setIsSigningIn(true);
    setError(null);

    try {
      const success = await googleImageAPI.signIn();
      setIsSignedIn(success);
      if (!success) {
        setError("Failed to sign in with Google. Please check your configuration.");
      }
    } catch (err) {
      setError("Sign-in failed. Please try again.");
      console.error("Sign-in error:", err);
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const handleSignOut = useCallback(() => {
    googleImageAPI.signOut();
    setIsSignedIn(false);
    setImages([]);
  }, []);

  const handleGenerate = useCallback(
    async (prompt: string, negativePrompt?: string) => {
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
          setImages((prev) => [...response.images, ...prev]);
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
        console.error("Generation error:", err);
      } finally {
        setIsGenerating(false);
      }
    },
    [settings]
  );

  const handleImageRemove = useCallback((imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  }, []);

  const isConfigured =
    import.meta.env.VITE_GOOGLE_CLIENT_ID &&
    import.meta.env.VITE_GOOGLE_CLIENT_ID !== "YOUR_CLIENT_ID";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Google AI Image Generator</h1>
              <p className="text-gray-600 mt-1">
                Create stunning images from text using Google's advanced AI models
              </p>
            </div>

            {/* Authentication */}
            {isConfigured && (
              <div className="flex items-center space-x-4">
                {isSignedIn ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Signed In</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSigningIn ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>Sign In with Google</span>
                    )}
                  </button>
                )}
              </div>
            )}
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
                <p className="text-amber-800 font-medium">Configuration Required</p>
                <p className="text-amber-700 mt-1">
                  Please set up your Google Cloud OAuth2 credentials in the{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded text-xs">.env</code> file to use
                  the real API.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Authentication Notice */}
        {isConfigured && !isSignedIn && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 mr-3" />
              <div>
                <p className="text-blue-800 font-medium">Authentication Required</p>
                <p className="text-blue-700 mt-1">
                  Please sign in with your Google account to generate images using the Vertex AI
                  API.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 mt-1">{error}</p>
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
