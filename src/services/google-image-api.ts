import axios from "axios";
import {
  ImageGenerationRequest,
  ImageGenerationResponse,
  GeneratedImage
} from "../types/image-generation";

class GoogleImageAPI {
  private projectId: string;
  private clientId: string;
  private location: string;
  private accessToken: string | null = null;

  constructor() {
    this.projectId = import.meta.env.VITE_GOOGLE_CLOUD_PROJECT_ID || "";
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
    this.location = import.meta.env.VITE_VERTEX_AI_LOCATION || "us-central1";
  }

  private getEndpoint(): string {
    return `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/imagen-3.0-generate-001:predict`;
  }

  public async signIn(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.clientId || this.clientId === "your-client-id-here") {
        console.warn("Google Client ID not configured");
        resolve(false);
        return;
      }

      // Initialize Google Identity Services
      (
        window as unknown as {
          google: {
            accounts: {
              oauth2: {
                initTokenClient: (config: {
                  client_id: string;
                  scope: string;
                  callback: (response: { access_token?: string }) => void;
                }) => { requestAccessToken: () => void };
              };
            };
          };
        }
      ).google.accounts.oauth2
        .initTokenClient({
          client_id: this.clientId,
          scope: "https://www.googleapis.com/auth/cloud-platform",
          callback: (response: { access_token?: string }) => {
            if (response.access_token) {
              this.accessToken = response.access_token;
              console.log("Successfully authenticated with Google Cloud");
              resolve(true);
            } else {
              console.error("Failed to obtain access token");
              resolve(false);
            }
          }
        })
        .requestAccessToken();
    });
  }

  public signOut(): void {
    const token = this.accessToken;
    this.accessToken = null;
    if (
      (
        window as unknown as {
          google?: { accounts?: { oauth2?: { revoke: (token: string | null) => void } } };
        }
      ).google?.accounts?.oauth2
    ) {
      (
        window as unknown as {
          google: { accounts: { oauth2: { revoke: (token: string | null) => void } } };
        }
      ).google.accounts.oauth2.revoke(token);
    }
  }

  public isSignedIn(): boolean {
    return !!this.accessToken;
  }

  async generateImages(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    try {
      // Check if access token is available
      if (!this.accessToken || !this.projectId || this.projectId === "your-project-id-here") {
        console.warn(
          "Google Cloud credentials not configured or user not signed in. Using mock generation."
        );
        return this.mockGeneration(request);
      }

      const payload = {
        instances: [
          {
            prompt: request.prompt,
            negativePrompt: request.negativePrompt || "",
            aspectRatio: request.aspectRatio || "1:1",
            guidanceScale: request.guidanceScale || 7.5,
            seed: request.seed,
            sampleCount: request.sampleCount || 1,
            safetySettings: request.safetySettings || "block_some"
          }
        ],
        parameters: {
          sampleCount: request.sampleCount || 1
        }
      };

      const response = await axios.post(this.getEndpoint(), payload, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json"
        }
      });

      const images: GeneratedImage[] = response.data.predictions.map(
        (prediction: { bytesBase64Encoded: string }, index: number) => ({
          id: `${Date.now()}-${index}`,
          url: `data:image/png;base64,${prediction.bytesBase64Encoded}`,
          prompt: request.prompt,
          timestamp: new Date(),
          aspectRatio: request.aspectRatio || "1:1"
        })
      );

      return { images };
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } };
      console.error("Error generating images:", error);

      // Fallback to mock generation for demo purposes
      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        return {
          images: [],
          error:
            "Authentication failed. Please check your Google Cloud API key and project configuration."
        };
      }

      return this.mockGeneration(request);
    }
  }

  private async mockGeneration(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000));

    const count = request.sampleCount || 1;
    const images: GeneratedImage[] = [];

    for (let i = 0; i < count; i++) {
      // Using placeholder images for demo
      const width =
        request.aspectRatio === "16:9"
          ? 1024
          : request.aspectRatio === "9:16"
          ? 576
          : request.aspectRatio === "4:3"
          ? 1024
          : request.aspectRatio === "3:4"
          ? 768
          : 1024;

      const height =
        request.aspectRatio === "16:9"
          ? 576
          : request.aspectRatio === "9:16"
          ? 1024
          : request.aspectRatio === "4:3"
          ? 768
          : request.aspectRatio === "3:4"
          ? 1024
          : 1024;

      images.push({
        id: `mock-${Date.now()}-${i}`,
        url: `https://picsum.photos/${width}/${height}?random=${Date.now() + i}&blur=1`,
        prompt: request.prompt,
        timestamp: new Date(),
        aspectRatio: request.aspectRatio || "1:1"
      });
    }

    return { images };
  }
}

export const googleImageAPI = new GoogleImageAPI();
