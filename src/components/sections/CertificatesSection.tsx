import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

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
  return (
    <section id="certificates" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            <Icon name="Medal" size={14} className="mr-2" />
            Квалификация
          </Badge>
          <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Сертификаты и лицензии
          </h3>
          <p className="text-muted-foreground">
            Подтвержденная экспертиза и соответствие международным стандартам
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, index) => (
            <Card key={index} className="group text-center hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in cursor-pointer" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary transition-all duration-500">
                  <Icon name={cert.icon as any} className="text-primary group-hover:text-white transition-colors duration-500" size={32} />
                </div>
                <CardTitle className="text-lg font-heading">{cert.title}</CardTitle>
                <CardDescription>{cert.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">Действителен с {cert.year}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
