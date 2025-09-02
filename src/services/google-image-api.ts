import axios from 'axios';
import { ImageGenerationRequest, ImageGenerationResponse, GeneratedImage } from '../types/image-generation';

class GoogleImageAPI {
  private projectId: string;
  private apiKey: string;
  private location: string;

  constructor() {
    this.projectId = import.meta.env.VITE_GOOGLE_CLOUD_PROJECT_ID || '';
    this.apiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY || '';
    this.location = import.meta.env.VITE_VERTEX_AI_LOCATION || 'us-central1';
  }

  private getEndpoint(): string {
    return `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/imagen-3.0-generate-001:predict`;
  }

  async generateImages(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    try {
      // Check if API key is configured
      if (!this.apiKey || this.apiKey === 'YOUR_API_KEY') {
        return this.mockGeneration(request);
      }

      const payload = {
        instances: [
          {
            prompt: request.prompt,
            negativePrompt: request.negativePrompt || '',
            aspectRatio: request.aspectRatio || '1:1',
            guidanceScale: request.guidanceScale || 7.5,
            seed: request.seed,
            sampleCount: request.sampleCount || 1,
            safetySettings: request.safetySettings || 'block_some'
          }
        ],
        parameters: {
          sampleCount: request.sampleCount || 1
        }
      };

      const response = await axios.post(this.getEndpoint(), payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const images: GeneratedImage[] = response.data.predictions.map((prediction: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        url: `data:image/png;base64,${prediction.bytesBase64Encoded}`,
        prompt: request.prompt,
        timestamp: new Date(),
        aspectRatio: request.aspectRatio || '1:1'
      }));

      return { images };
    } catch (error: any) {
      console.error('Error generating images:', error);
      
      // Fallback to mock generation for demo purposes
      if (error.response?.status === 401 || error.response?.status === 403) {
        return {
          images: [],
          error: 'Authentication failed. Please check your Google Cloud API key and project configuration.'
        };
      }
      
      return this.mockGeneration(request);
    }
  }

  private async mockGeneration(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    const count = request.sampleCount || 1;
    const images: GeneratedImage[] = [];

    for (let i = 0; i < count; i++) {
      // Using placeholder images for demo
      const width = request.aspectRatio === '16:9' ? 1024 : 
                   request.aspectRatio === '9:16' ? 576 : 
                   request.aspectRatio === '4:3' ? 1024 : 
                   request.aspectRatio === '3:4' ? 768 : 1024;
      
      const height = request.aspectRatio === '16:9' ? 576 : 
                    request.aspectRatio === '9:16' ? 1024 : 
                    request.aspectRatio === '4:3' ? 768 : 
                    request.aspectRatio === '3:4' ? 1024 : 1024;

      images.push({
        id: `mock-${Date.now()}-${i}`,
        url: `https://picsum.photos/${width}/${height}?random=${Date.now() + i}&blur=1`,
        prompt: request.prompt,
        timestamp: new Date(),
        aspectRatio: request.aspectRatio || '1:1'
      });
    }

    return { images };
  }
}

export const googleImageAPI = new GoogleImageAPI();
