# Google Text-to-Image Generator

A React application that uses Google Cloud's Vertex AI Imagen API to generate images from text prompts.

## Prerequisites

1. **Google Cloud Account**: You need a Google Cloud account with billing enabled
2. **Google Cloud Project**: Create a new project or use an existing one
3. **Vertex AI API**: Enable the Vertex AI API in your project
4. **API Key**: Create an API key with Vertex AI permissions

## Google Cloud Setup

### Step 1: Create/Select a Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID (you'll need this later)

### Step 2: Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - **Vertex AI API**
   - **Cloud Resource Manager API** (if not already enabled)

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application" as the application type
4. Add your domain to "Authorized JavaScript origins" (e.g., `http://localhost:5173` for development)
5. Copy the generated Client ID

### Step 4: Set up Billing

- Ensure your Google Cloud project has billing enabled
- Note: Image generation will incur charges based on usage

## Local Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Environment File

Create a `.env` file in the root directory with the following content:

```env
# Google Cloud Configuration
VITE_GOOGLE_CLOUD_PROJECT_ID=your-actual-project-id
VITE_GOOGLE_CLIENT_ID=your-oauth-client-id
VITE_VERTEX_AI_LOCATION=us-central1
```

Replace:

- `your-actual-project-id` with your Google Cloud Project ID
- `your-oauth-client-id` with the OAuth 2.0 Client ID you created

### Step 3: Run the Development Server

```bash
npm run dev
```

## Important Notes

- **Mock Mode**: If environment variables are not configured, the app will run in mock mode using placeholder images
- **Security**: Never commit your `.env` file to version control
- **Billing**: Each image generation request will incur costs on your Google Cloud account
- **Quota**: Be aware of API quotas and rate limits

## Troubleshooting

### Authentication Error (401)

- Verify your OAuth 2.0 Client ID is correct
- Make sure you're signed in through the app's "Sign In with Google" button
- Check that your domain is added to authorized JavaScript origins in OAuth settings
- Ensure your Project ID is correct
- Check that Vertex AI API is enabled in your project
- Verify billing is enabled on your Google Cloud project

### Generation Failures

- Check the browser console for detailed error messages
- Ensure you have sufficient quota and billing setup
- Try with simpler prompts first

## Features

- Generate images from text prompts using Google's Imagen 3.0
- Adjustable generation settings (aspect ratio, guidance scale, etc.)
- Image gallery with download capabilities
- Safety settings configuration
- Responsive design with modern UI

This project was generated through Alpha. For more information, visit [dualite.dev](https://dualite.dev).
