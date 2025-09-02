import React, { useState } from 'react';
import { Download, Maximize2, Copy, Heart, Share2, Trash2 } from 'lucide-react';
import { GeneratedImage } from '../types/image-generation';

interface ImageGalleryProps {
  images: GeneratedImage[];
  onImageRemove?: (imageId: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onImageRemove }) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch (error) {
      console.error('Error copying prompt:', error);
    }
  };

  const handleShare = async (image: GeneratedImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Generated Image',
          text: `Check out this AI-generated image: "${image.prompt}"`,
          url: image.url
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(image.url);
        alert('Image URL copied to clipboard!');
      } catch (error) {
        console.error('Error copying URL:', error);
      }
    }
  };

  if (images.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-200 text-center">
        <div className="text-gray-400 mb-4">
          <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-gray-100 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded"></div>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No images generated yet</h3>
        <p className="text-gray-500">Enter a prompt above to start creating amazing AI-generated images</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Generated Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="group relative bg-gray-50 rounded-lg overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                
                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all"
                    title="View full size"
                  >
                    <Maximize2 className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDownload(image)}
                    className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-gray-700" />
                  </button>
                  {onImageRemove && (
                    <button
                      onClick={() => onImageRemove(image.id)}
                      className="p-2 bg-red-500 bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-gray-700 line-clamp-2 mb-3">{image.prompt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {image.timestamp.toLocaleDateString()}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleCopyPrompt(image.prompt)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy prompt"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleShare(image)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-size image modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full relative">
            <img
              src={selectedImage.url}
              alt={selectedImage.prompt}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all"
            >
              ✕
            </button>
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg">
              <p className="text-sm">{selectedImage.prompt}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs opacity-75">
                  {selectedImage.timestamp.toLocaleString()}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(selectedImage)}
                    className="flex items-center space-x-1 text-xs hover:text-blue-300 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
