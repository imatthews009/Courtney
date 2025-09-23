import React, { useState } from 'react';
// import { Saying } from '../App';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
type CarouselProps = {
  sayings: Saying[];
};
export type Saying = {
  id: string;
  text: string;
  imageUrl: string | null | undefined;
};
export const Carousel2: React.FC<CarouselProps> = ({
  sayings
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? sayings.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const goToNext = () => {
    const isLastSlide = currentIndex === sayings.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };
  // If there are no sayings, show a placeholder
  if (sayings.length === 0) {
    return <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-500 text-lg">
          No sayings yet. Add your first one below!
        </p>
      </div>;
  }
  return <div className="relative w-full">
      {/* Carousel Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Image Section */}
          {sayings[currentIndex].imageUrl && (<div className="md:w-1/2 h-64 md:h-96 relative">
            <img src={sayings[currentIndex].imageUrl} alt={`Illustration for saying ${currentIndex + 1}`} className="w-full h-full object-cover" />
          </div>)}
          {/* Text Section */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <div className="mb-4">
              <span className="text-sm font-medium text-indigo-600">
                Saying {currentIndex + 1} of {sayings.length}
              </span>
            </div>
            <blockquote className="text-xl md:text-2xl font-medium text-gray-800 mb-6">
              "{sayings[currentIndex].text}"
            </blockquote>
          </div>
        </div>
      </div>
      {/* Navigation Arrows */}
      <button onClick={goToPrevious} className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all" aria-label="Previous saying">
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <button onClick={goToNext} className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all" aria-label="Next saying">
        <ChevronRightIcon className="w-6 h-6" />
      </button>
      {/* Dots Navigation */}
      <div className="flex justify-center mt-4 gap-2">
        {sayings.map((_, slideIndex) => <button key={slideIndex} onClick={() => goToSlide(slideIndex)} className={`w-3 h-3 rounded-full transition-all ${currentIndex === slideIndex ? 'bg-indigo-600 w-6' : 'bg-gray-300'}`} aria-label={`Go to saying ${slideIndex + 1}`} />)}
      </div>
    </div>;
};