import { useState, useEffect, useRef } from 'react';
import imageCompression from 'browser-image-compression';

// Image lazy loading component
export const LazyImage = ({ 
  src, 
  alt, 
  placeholder = '/placeholder.webp',
  className = '',
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className} {...props}>
      <img
        src={inView ? src : placeholder}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          transition: 'opacity 0.3s',
          opacity: loaded ? 1 : 0.5,
        }}
      />
    </div>
  );
};

// Image compression utility
export const compressImage = async (file, options = {}) => {
  const defaultOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp', // Modern format
    quality: 0.8,
    ...options
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    return file; // Return original if compression fails
  }
};

// Preload critical images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
};

// Responsive image srcSet generator
export const generateSrcSet = (baseSrc, sizes = [400, 800, 1200, 1600]) => {
  return sizes
    .map(size => `${baseSrc}?w=${size} ${size}w`)
    .join(', ');
};

// WebP format detection and fallback
export const supportsWebP = () => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Get optimized image URL based on browser support
export const getOptimizedImageUrl = (src, options = {}) => {
  const { width, height, quality = 80, format } = options;
  const isWebPSupported = supportsWebP();
  
  let optimizedSrc = src;
  
  // Add query parameters for optimization
  const params = new URLSearchParams();
  
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  if (quality !== 80) params.append('q', quality);
  if (format || isWebPSupported) {
    params.append('f', format || 'webp');
  }
  
  if (params.toString()) {
    optimizedSrc = `${src}${src.includes('?') ? '&' : '?'}${params.toString()}`;
  }
  
  return optimizedSrc;
};
