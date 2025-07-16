import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { SLIDER_CONSTANTS } from '@/constants/mock-data-slider';

export default function AutoSlider({ className }: { className?: string }) {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 5000, disableOnInteraction: true }}
      loop
      speed={1300}
    >
      {SLIDER_CONSTANTS.map((slide) => (
        <SwiperSlide key={slide.id}>
          <img
            src={slide.image}
            alt={slide.title}
            className={`h-[36vh] w-full object-cover ${className}`}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
