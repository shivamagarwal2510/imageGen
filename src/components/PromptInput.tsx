import React, { useState } from 'react';
import { Send, Wand2, Sparkles } from 'lucide-react';

interface PromptInputProps {
  onGenerate: (prompt: string, negativePrompt?: string) => void;
  isGenerating: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt.trim(), negativePrompt.trim() || undefined);
    }
  };

  const examplePrompts = [
    "A majestic dragon soaring through a cloudy sky at sunset",
    "A futuristic city with flying cars and neon lights",
    "A peaceful meadow with wildflowers and butterflies",
    "An astronaut exploring an alien landscape with purple mountains"
  ];

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            <Wand2 className="inline-block w-4 h-4 mr-2" />
            Describe your image
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A beautiful landscape with mountains and a lake at golden hour..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            disabled={isGenerating}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 mr-2">Try these examples:</span>
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleExampleClick(example)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
              disabled={isGenerating}
            >
              {example.substring(0, 30)}...
            </button>
          ))}
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </button>
        </div>

        {showAdvanced && (
          <div className="pt-4 border-t border-gray-200">
            <label htmlFor="negativePrompt" className="block text-sm font-medium text-gray-700 mb-2">
              Negative prompt (what to avoid)
            </label>
            <textarea
              id="negativePrompt"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="blurry, low quality, distorted, nsfw..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
              disabled={isGenerating}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Generate Image
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PromptInput;
