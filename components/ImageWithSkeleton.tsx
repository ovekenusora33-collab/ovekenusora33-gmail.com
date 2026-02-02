
import React, { useState } from 'react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({ 
  src, 
  alt, 
  className = "", 
  containerClassName = "",
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-beige/30 ${containerClassName}`}>
      {/* 骨架屏占位 */}
      <div 
        className={`absolute inset-0 bg-gray-200/50 animate-pulse transition-opacity duration-500 z-10 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} 
      />
      
      {/* 实际图片 */}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
};

export default ImageWithSkeleton;
