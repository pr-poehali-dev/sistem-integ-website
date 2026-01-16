import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const projectPhotos = [
  {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
    title: 'Бизнес-центр "Технопарк"',
    description: 'Монтаж СКС и СКУД'
  },
  {
    url: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1200&h=800&fit=crop',
    title: 'Производственный комплекс',
    description: 'Система пожарной сигнализации'
  },
  {
    url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&h=800&fit=crop',
    title: 'Логистический центр',
    description: 'Видеонаблюдение и контроль доступа'
  },
  {
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
    title: 'Административное здание',
    description: 'Системы автоматизации'
  },
  {
    url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop',
    title: 'ТРЦ "Гринвич"',
    description: 'Комплексная интеграция систем'
  },
  {
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop',
    title: 'Медицинский центр',
    description: 'ОВИК и электрооборудование'
  }
];

export default function ProjectGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {projectPhotos.map((photo, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4">
              <div className="relative group overflow-hidden rounded-xl border border-border shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h4 className="font-heading font-bold text-lg mb-1">{photo.title}</h4>
                    <p className="text-sm text-white/80">{photo.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
        onClick={scrollPrev}
      >
        <Icon name="ChevronLeft" size={24} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
        onClick={scrollNext}
      >
        <Icon name="ChevronRight" size={24} />
      </Button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {projectPhotos.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
