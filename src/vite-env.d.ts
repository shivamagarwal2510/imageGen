/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLOUD_PROJECT_ID: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_VERTEX_AI_LOCATION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
