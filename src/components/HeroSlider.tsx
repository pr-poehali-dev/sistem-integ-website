import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 'sks',
    title: 'СКС',
    subtitle: 'Структурированные кабельные системы',
    description: 'Современная кабельная инфраструктура с гарантией до 25 лет',
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=1920&h=600&fit=crop'
  },
  {
    id: 'sot',
    title: 'Видеонаблюдение',
    subtitle: 'Система охранного телевидения',
    description: 'IP-камеры 4K с интеллектуальной аналитикой и облачным хранением',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1920&h=600&fit=crop'
  },
  {
    id: 'skud',
    title: 'СКУД',
    subtitle: 'Контроль и управление доступом',
    description: 'Биометрия, карты доступа и учет рабочего времени',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1920&h=600&fit=crop'
  },
  {
    id: 'saps',
    title: 'Пожарная безопасность',
    subtitle: 'САПС и СОУЭ под ключ',
    description: 'Автоматическая пожарная сигнализация и система оповещения',
    image: 'https://images.unsplash.com/photo-1583266851420-ac79173d31c5?w=1920&h=600&fit=crop'
  },
  {
    id: 'ovik',
    title: 'ОВИК',
    subtitle: 'Климатические системы',
    description: 'Вентиляция, кондиционирование и отопление для комфорта',
    image: 'https://images.unsplash.com/photo-1631545806608-bfa0f5a7fc1e?w=1920&h=600&fit=crop'
  }
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-muted">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSlide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl text-white"
            >
              <Badge variant="secondary" className="mb-4 bg-primary/20 text-white border-white/20">
                {currentSlide.title}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
                {currentSlide.subtitle}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                {currentSlide.description}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
