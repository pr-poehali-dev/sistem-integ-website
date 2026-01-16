import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { getContent } from '@/lib/content-manager';
import { useState, useEffect } from 'react';

const certificates = [
  {
    title: 'ISO 9001:2015',
    description: 'Система менеджмента качества',
    icon: 'Award',
    year: '2023'
  },
  {
    title: 'ISO 14001:2015',
    description: 'Экологический менеджмент',
    icon: 'Leaf',
    year: '2023'
  },
  {
    title: 'Лицензия МЧС',
    description: 'Монтаж систем пожарной безопасности',
    icon: 'FileCheck',
    year: '2024'
  },
  {
    title: 'СРО',
    description: 'Строительно-монтажные работы',
    icon: 'Building',
    year: '2024'
  },
  {
    title: 'Партнер Schneider Electric',
    description: 'Сертифицированный интегратор',
    icon: 'Handshake',
    year: '2023'
  },
  {
    title: 'Партнер Hikvision',
    description: 'Официальный дистрибьютор',
    icon: 'CheckCircle',
    year: '2024'
  }
];

export default function CertificatesSection() {
  const [content, setContent] = useState(getContent().certificates);

  useEffect(() => {
    const handleUpdate = () => setContent(getContent().certificates);
    window.addEventListener('content-updated', handleUpdate);
    return () => window.removeEventListener('content-updated', handleUpdate);
  }, []);

  return (
    <section id="certificates" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            <Icon name="Medal" size={14} className="mr-2" />
            Квалификация
          </Badge>
          <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {content.title}
          </h3>
          <p className="text-muted-foreground">
            Подтвержденная экспертиза и соответствие международным стандартам
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.items.map((cert, index) => (
            <Card key={cert.id} className="group text-center hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in cursor-pointer overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={cert.image} 
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <CardContent className="pt-6">
                <CardTitle className="text-lg font-heading">{cert.title}</CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}