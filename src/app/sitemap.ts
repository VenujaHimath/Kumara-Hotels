import { MetadataRoute } from 'next';
import { hotels } from '@/data/hotelsData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kumarahotels.com';

  const hotelUrls = hotels.map((h) => ({
    url: `${baseUrl}/hotels/${h.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hotels`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...hotelUrls,
  ];
}
