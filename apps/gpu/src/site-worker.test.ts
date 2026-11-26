import { describe, expect, test } from 'vitest'

import worker from './site-worker'

const assets = {
  fetch: async (request: Request) => new Response(request.url),
}

describe('GPU hosting', () => {
  test('old public scene URLs redirect to Research with their query intact', async () => {
    const paths = [
      '/',
      '/scenes/random-dots',
      '/scenes/noise-beams',
      '/scenes/image-mosaic',
      '/scenes/mosaic-mirror',
    ]

    await Promise.all(
      paths.map(async path => {
        const response = await worker.fetch(
          new Request(`https://gpu.guidefari.com${path}?seed=123`),
          { ASSETS: assets },
        )

        expect(response.status).toBe(308)
        expect(response.headers.get('location')).toBe(
          `https://research.guidefari.com/gpu${path}?seed=123`,
        )
      }),
    )
  })

  test('an already-prefixed legacy URL does not gain a second prefix', async () => {
    const response = await worker.fetch(
      new Request('https://gpu.guidefari.com/gpu/scenes/noise-beams'),
      { ASSETS: assets },
    )

    expect(response.headers.get('location')).toBe(
      'https://research.guidefari.com/gpu/scenes/noise-beams',
    )
  })

  test('the service binding serves assets from the GPU build without redirecting', async () => {
    const response = await worker.fetch(
      new Request(
        'https://research.guidefari.com/gpu/assets/example.js?version=2',
      ),
      { ASSETS: assets },
    )

    expect(response.status).toBe(200)
    expect(await response.text()).toBe(
      'https://research.guidefari.com/assets/example.js?version=2',
    )
  })

  test('the Research root of the GPU app maps to the GPU asset index', async () => {
    const response = await worker.fetch(
      new Request('https://research.guidefari.com/gpu/'),
      { ASSETS: assets },
    )

    expect(await response.text()).toBe('https://research.guidefari.com/')
  })
})
