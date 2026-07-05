import React from 'react';
import { hotels } from '@/data/hotelsData';

export default function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HotelGroup",
    "name": "Kumara Hotels Group",
    "description": "Luxurious parent hospitality brand owning four distinct luxury resort locations across Sri Lanka.",
    "url": "https://kumarahotels.com",
    "logo": "https://kumarahotels.com/logo.png",
    "member": hotels.map((h) => ({
      "@type": "Hotel",
      "name": h.name,
      "description": h.description,
      "image": h.image,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": h.location.split(',')[0].trim(),
        "addressCountry": "Sri Lanka"
      },
      "url": `https://kumarahotels.com/hotels/${h.slug}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
