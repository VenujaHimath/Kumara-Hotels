import Image, { ImageProps } from 'next/image';

interface HotelImageProps extends Omit<ImageProps, 'src'> {
  src: string;
}

/** Renders hotel images with cache-busting for admin-uploaded local files. */
export default function HotelImage({ src, alt, className, ...props }: HotelImageProps) {
  const isLocal = src.startsWith('/images/');

  return (
    <Image
      key={src}
      src={src}
      alt={alt}
      className={className}
      unoptimized={isLocal}
      {...props}
    />
  );
}
