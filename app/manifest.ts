import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Radical Camp 2025',
    short_name: 'Radical Camp',
    description: 'Campamento juvenil Radical Camp 2025 - 2026. ¡Es tiempo de volver!',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#3700b3',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
