import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const projectPhotos = [
  {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80',
    description: 'Монтаж кабельных трасс',
    systems: ['СКС']
  },
  {
    url: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&h=600&fit=crop&q=80',
    description: 'Установка пожарных извещателей',
    systems: ['САПС', 'СОУЭ']
  },
  {
    url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=600&fit=crop&q=80',
    description: 'IP-камеры видеонаблюдения',
    systems: ['СОТ']
  },
  {
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&q=80',
    description: 'Турникеты и считыватели карт',
    systems: ['СКУД']
  },
  {
    url: 'https://images.unsplash.com/photo-1581092918484-8313e1f7e8c6?w=800&h=600&fit=crop&q=80',
    description: 'Датчики охранной сигнализации',
    systems: ['СОТС']
  },
  {
    url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&q=80',
    description: 'Установка интеллектуальных счетчиков',
    systems: ['АСКУЭ']
  },
  {
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop&q=80',
    description: 'Монтаж распределительных щитов',
    systems: ['ЭОМ']
  },
  {
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop&q=80',
    description: 'Приточно-вытяжные установки',
    systems: ['ОВИК']
  },
  {
    url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop&q=80',
    description: 'Серверная комната',
    systems: ['СКС', 'СКУД']
  },
  {
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&q=80',
    description: 'Диспетчерская панель управления',
    systems: ['САПС', 'СОУЭ', 'СОТ']
  },
  {
    url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop&q=80',
    description: 'Офисное освещение',
    systems: ['ЭОМ']
  },
  {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
    description: 'Климатическое оборудование',
    systems: ['ОВИК']
  }
];

export default function ProjectGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSystem, setSelectedSystem] = useState<string>('all');

  const allSystems = ['all', ...Array.from(new Set(projectPhotos.flatMap(p => p.systems)))];
  
  const filteredPhotos = selectedSystem === 'all'
    ? projectPhotos
    : projectPhotos.filter(p => p.systems.includes(selectedSystem));

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
      {/* System Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {allSystems.map((system) => (
          <Button
            key={system}
            variant={selectedSystem === system ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSystem(system)}
            className="transition-all duration-300"
          >
            {system === 'all' ? 'Все системы' : system}
          </Button>
        ))}
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {filteredPhotos.map((photo, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4">
              <div className="relative group overflow-hidden rounded-xl border border-border shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={photo.url}
                    alt={photo.description}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-sm text-white/90 mb-3">{photo.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {photo.systems.map((system, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                          {system}
                        </Badge>
                      ))}
                    </div>
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
        {filteredPhotos.map((_, index) => (
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