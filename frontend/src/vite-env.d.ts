/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENVIRONMENT: string
  readonly VITE_ENABLE_GOOGLE_AUTH: string
  readonly VITE_ENABLE_GITHUB_AUTH: string
  readonly VITE_ENABLE_STRIPE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}