import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'
import type { SanityImage } from '../queries'
import { client } from './client'

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export function imageUrl(image: SanityImage, width = 1800): string {
  return builder
    .image({ asset: { _ref: image.assetRef }, hotspot: image.hotspot, crop: image.crop })
    .width(width)
    .auto('format')
    .url()
}

export function imageUrls(images: SanityImage[] | undefined, width = 1800): string[] {
  return (images ?? []).map((image) => imageUrl(image, width))
}
