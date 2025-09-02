export interface ImageGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: '1:1' | '9:16' | '16:9' | '4:3' | '3:4';
  guidanceScale?: number;
  seed?: number;
  sampleCount?: number;
  safetySettings?: 'block_most' | 'block_some' | 'block_few' | 'block_none';
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
  aspectRatio: string;
}

export interface ImageGenerationResponse {
  images: GeneratedImage[];
  error?: string;
}

export interface GenerationSettings {
  aspectRatio: '1:1' | '9:16' | '16:9' | '4:3' | '3:4';
  guidanceScale: number;
  sampleCount: number;
  safetySettings: 'block_most' | 'block_some' | 'block_few' | 'block_none';
}
