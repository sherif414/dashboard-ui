import defaultProfileImg from '~/assets/img/profile.jpg'
import defaultProductImg from '~/assets/img/iphone14.png'

export function getProfileImageUrl(image?: string | null): string {
  if (!image) return defaultProfileImg
  if (image.startsWith('data:') || image.startsWith('http') || image.startsWith('blob:') || image.startsWith('/')) {
    return image
  }
  return defaultProfileImg
}

export function getProductImageUrl(image?: string | null): string {
  if (!image) return defaultProductImg
  if (image.startsWith('data:') || image.startsWith('http') || image.startsWith('blob:') || image.startsWith('/')) {
    return image
  }
  return defaultProductImg
}
