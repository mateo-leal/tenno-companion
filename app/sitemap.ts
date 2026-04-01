import type { MetadataRoute } from 'next'
import { CHATROOM_SOURCE_BY_ID } from '@/lib/chatrooms'
import { getSiteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/kim`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/checklist`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  const chatroomRoutes: MetadataRoute.Sitemap = Object.keys(
    CHATROOM_SOURCE_BY_ID
  ).map((chatroomId) => ({
    url: `${siteUrl}/kim/${chatroomId}`,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  return [...staticRoutes, ...chatroomRoutes]
}
