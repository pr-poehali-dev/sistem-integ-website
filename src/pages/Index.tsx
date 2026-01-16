import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import ContactForm from '@/components/ContactForm';

const solutions = [
  {
    id: 'sks',
    title: 'СКС',
    fullTitle: 'Структурированная кабельная система',
    description: 'Проектирование и монтаж современных кабельных инфраструктур с использованием передовых технологий',
    icon: 'Network',
    features: ['Медные системы', 'Оптоволокно', 'Сертификация', 'Гарантия 25 лет']
  },
  {
    id: 'saps',
    title: 'САПС',
    fullTitle: 'Система автоматической пожарной сигнализации',
    description: 'Интеллектуальные системы раннего обнаружения возгораний',
    icon: 'Flame',
    features: ['Адресные датчики', 'Интеграция с СОУЭ', 'Мониторинг 24/7', 'Автоматическое тушение']
  },
  {
    id: 'soue',
    title: 'СОУЭ',
    fullTitle: 'Система оповещения и управления эвакуацией',
    description: 'Комплексные решения для безопасной эвакуации людей',
    icon: 'AlertTriangle',
    features: ['Речевое оповещение', 'Световые указатели', 'Управление эвакуацией', 'Интеграция с САПС']
  },
  {
    id: 'skud',
    title: 'СКУД',
    fullTitle: 'Система контроля и управления доступом',
    description: 'Многоуровневые системы разграничения доступа',
    icon: 'Shield',
    features: ['Биометрия', 'Карты доступа', 'Турникеты', 'Учет рабочего времени']
  },
  {
    id: 'sots',
    title: 'СОТС',
    fullTitle: 'Система охранного телевидения',
    description: 'Видеонаблюдение с интеллектуальной аналитикой',
    icon: 'Video',
    features: ['IP-камеры 4K', 'Аналитика AI', 'Облачное хранение', 'Мобильный доступ']
  },
  {
    id: 'sot',
    title: 'СОТ',
    fullTitle: 'Система охранной сигнализации',
    description: 'Надежная защита периметра и помещений',
    icon: 'Bell',
    features: ['Датчики движения', 'Периметральная защита', 'Интеграция со СКУД', 'Тревожная кнопка']
  },
  {
    id: 'askue',
    title: 'АСКУЭ',
    fullTitle: 'Автоматизированная система контроля и учета энергоресурсов',
    description: 'Мониторинг и оптимизация энергопотребления',
    icon: 'Zap',
    features: ['Учет электроэнергии', 'Анализ потребления', 'Прогнозирование', 'Отчетность']
  },
  {
    id: 'eom',
    title: 'ЭОМ',
    fullTitle: 'Электрооборудование и освещение',
    description: 'Полный комплекс электромонтажных работ',
    icon: 'Lightbulb',
    features: ['Силовые сети', 'Освещение', 'Заземление', 'Молниезащита']
  },
  {
    id: 'ovik',
    title: 'ОВИК',
    fullTitle: 'Отопление, вентиляция и кондиционирование',
    description: 'Климатические системы для комфортной среды',
    icon: 'Wind',
    features: ['Вентиляция', 'Кондиционирование', 'Отопление', 'Автоматизация']
  }
];

const portfolio = [
  {
    title: 'Бизнес-центр "Технопарк"',
    systems: ['СКС', 'СКУД', 'СОТС', 'ОВИК'],
    area: '15 000 м²',
    year: '2024',
    image: '🏢'
  },
  {
    title: 'Производственный комплекс',
    systems: ['САПС', 'СОУЭ', 'СОТ', 'АСКУЭ'],
    area: '8 500 м²',
    year: '2023',
    image: '🏭'
  },
  {
    title: 'Логистический центр',
    systems: ['СКС', 'СОТС', 'СКУД', 'ЭОМ'],
    area: '22 000 м²',
    year: '2024',
    image: '📦'
  },
  {
    title: 'Административное здание',
    systems: ['СКС', 'СКУД', 'СОУЭ', 'ОВИК'],
    area: '6 200 м²',
    year: '2023',
    image: '🏛️'
  }
];

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

export default function Index() {
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/LOGO TEXT SYSTEMCRAFT.png" 
                alt="СистемКрафт" 
                className="h-16 w-auto"
              />
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#solutions" className="text-sm font-medium hover:text-primary transition-colors">Решения</a>
              <a href="#portfolio" className="text-sm font-medium hover:text-primary transition-colors">Портфолио</a>
              <a href="#certificates" className="text-sm font-medium hover:text-primary transition-colors">Сертификаты</a>
            </nav>
            <Button className="hidden md:flex" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              <Icon name="Phone" size={16} className="mr-2" />
              Связаться
            </Button>
          </div>
        </div>
      </header>

      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <Badge variant="secondary" className="px-4 py-2">
              <Icon name="Sparkles" size={14} className="mr-2" />
              Инновационные технологии
            </Badge>
            <h2 className="text-4xl md:text-6xl font-heading font-extrabold leading-tight">
              Комплексная интеграция
              <span className="block mt-2 text-primary">
                инженерных систем
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Проектирование, комплектация и монтаж современных систем автоматизации зданий. 
              Полный цикл работ от концепции до пусконаладки.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                <Icon name="FileText" size={18} />
                Получить консультацию
              </Button>
              <Button size="lg" variant="outline" className="gap-2" onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}>
                <Icon name="Play" size={18} />
                Наши проекты
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-8 pt-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-heading font-bold text-primary">250+</div>
                <div className="text-sm text-muted-foreground mt-1">Реализованных проектов</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground mt-1">Лет на рынке</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground mt-1">Довольных клиентов</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <Badge variant="outline" className="mb-4">
              <Icon name="Boxes" size={14} className="mr-2" />
              Наши решения
            </Badge>
            <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Полный спектр инженерных систем
            </h3>
            <p className="text-muted-foreground">
              Интеграция всех типов систем автоматизации и безопасности
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution, index) => (
              <Card 
                key={solution.id}
                className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-primary/50 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedSolution(solution.id)}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon name={solution.icon as any} className="text-primary" size={28} />
                  </div>
                  <CardTitle className="text-xl font-heading">{solution.title}</CardTitle>
                  <CardDescription className="text-xs font-medium text-muted-foreground/80">
                    {solution.fullTitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{solution.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {solution.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              <Icon name="Briefcase" size={14} className="mr-2" />
              Портфолио
            </Badge>
            <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Реализованные проекты
            </h3>
            <p className="text-muted-foreground">
              Наш опыт в интеграции систем различной сложности
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {portfolio.map((project, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="aspect-video bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-500">
                  {project.image}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-heading mb-2">{project.title}</CardTitle>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Maximize" size={14} />
                          {project.area}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={14} />
                          {project.year}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.systems.map((system, idx) => (
                      <Badge key={idx} variant="outline" className="font-medium">
                        {system}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
                    <Icon name={cert.icon as any} className="text-primary" size={32} />
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

          <div className="mt-12 text-center">
            <Card className="inline-block px-8 py-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
              <div className="flex items-center gap-4">
                <Icon name="ShieldCheck" className="text-primary" size={40} />
                <div className="text-left">
                  <p className="font-heading font-bold text-lg">Гарантия качества</p>
                  <p className="text-sm text-muted-foreground">На все виды работ от 2 до 5 лет</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4">
              <Icon name="MessageSquare" size={14} className="mr-2" />
              Связаться с нами
            </Badge>
            <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Готовы начать проект?
            </h3>
            <p className="text-muted-foreground">
              Оставьте заявку и получите бесплатную консультацию эксперта
            </p>
          </div>
          
          <ContactForm />

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <Card className="text-center hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Icon name="Phone" className="text-primary" size={24} />
                </div>
                <p className="font-medium mb-1">Телефон</p>
                <a href="tel:+74951234567" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  +7 (495) 123-45-67
                </a>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Icon name="Mail" className="text-primary" size={24} />
                </div>
                <p className="font-medium mb-1">Email</p>
                <a href="mailto:info@systemcraft.ru" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  info@systemcraft.ru
                </a>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Icon name="MapPin" className="text-primary" size={24} />
                </div>
                <p className="font-medium mb-1">Офис</p>
                <p className="text-sm text-muted-foreground">
                  Москва, ул. Примерная, 123
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img 
                src="https://cdn.poehali.dev/files/LOGO TEXT SYSTEMCRAFT.png" 
                alt="СистемКрафт" 
                className="h-14 w-auto mb-4"
              />
              <p className="text-sm text-muted-foreground">
                Строим системы и сети
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Решения</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">СКС</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">САПС</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">СКУД</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">СОТС</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Портфолио</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Сертификаты</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={14} />
                  +7 (495) 123-45-67
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={14} />
                  info@systemcraft.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="MapPin" size={14} />
                  Москва, ул. Примерная, 123
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 СистемКрафт. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}