import React, { useState } from 'react';
import { ZoomIn, X } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const activeImage = images[activeIndex] || images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar md:w-20 flex-shrink-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition flex-shrink-0 bg-amber-50 ${
              activeIndex === idx
                ? 'border-amber-600 ring-2 ring-amber-600/30'
                : 'border-stone-200 hover:border-amber-300'
            }`}
          >
            <img src={img} alt={`${title} thumb ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image with Zoom preview */}
      <div className="flex-1 relative aspect-square rounded-2xl overflow-hidden bg-amber-50/50 border border-amber-200">
        <div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsZoomModalOpen(true)}
          className="w-full h-full cursor-zoom-in relative overflow-hidden"
        >
          <img
            src={activeImage}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-200 ${
              isHovering ? 'scale-125' : 'scale-100'
            }`}
            style={
              isHovering
                ? {
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                  }
                : undefined
            }
          />

          <button
            className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-xs text-stone-700 shadow-md hover:bg-white"
            title="Full zoom view"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomModalOpen && (
        <div
          onClick={() => setIsZoomModalOpen(false)}
          className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-stone-900/80 text-white rounded-full hover:bg-stone-800 z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={activeImage} alt={title} className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
};
