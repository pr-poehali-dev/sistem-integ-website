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
    features: ['Медные системы', 'Оптоволокно', 'Сертификация', 'Гарантия 25 лет'],
    detailedDescription: 'СКС — это основа современной инфраструктуры любого здания. Мы проектируем и монтируем медные и оптоволоконные системы категории 5e, 6, 6A и 7A с использованием оборудования ведущих мировых производителей. Наши решения обеспечивают пропускную способность до 100 Гбит/с и гарантированную работу на протяжении 25 лет. Выполняем полный цикл: от проектирования до сертификации линий с выдачей протоколов тестирования.'
  },
  {
    id: 'saps',
    title: 'САПС',
    fullTitle: 'Система автоматической пожарной сигнализации',
    description: 'Интеллектуальные системы раннего обнаружения возгораний',
    icon: 'Flame',
    features: ['Адресные датчики', 'Интеграция с СОУЭ', 'Мониторинг 24/7', 'Автоматическое тушение'],
    detailedDescription: 'САПС — критически важная система безопасности объекта. Используем адресно-аналоговые извещатели с интеллектуальным алгоритмом обнаружения, исключающим ложные срабатывания. Системы интегрируются с СОУЭ, автоматическим пожаротушением и системами дымоудаления. Обеспечиваем круглосуточный мониторинг с выводом сигналов на пульт МЧС. Все работы выполняются по лицензии МЧС с гарантией до 5 лет.'
  },
  {
    id: 'soue',
    title: 'СОУЭ',
    fullTitle: 'Система оповещения и управления эвакуацией',
    description: 'Комплексные решения для безопасной эвакуации людей',
    icon: 'AlertTriangle',
    features: ['Речевое оповещение', 'Световые указатели', 'Управление эвакуацией', 'Интеграция с САПС'],
    detailedDescription: 'СОУЭ обеспечивает своевременное и понятное оповещение людей о необходимости эвакуации. Реализуем системы 1-5 типа согласно СП 3.13130.2009: от световых указателей "Выход" до полноценных речевых систем с зональным управлением. Оборудование размещается с учетом акустических расчетов для обеспечения разборчивости речи не менее 0.75. Интеграция с САПС происходит автоматически при возникновении пожара.'
  },
  {
    id: 'skud',
    title: 'СКУД',
    fullTitle: 'Система контроля и управления доступом',
    description: 'Многоуровневые системы разграничения доступа',
    icon: 'Shield',
    features: ['Биометрия', 'Карты доступа', 'Турникеты', 'Учет рабочего времени'],
    detailedDescription: 'СКУД контролирует перемещение людей и транспорта на объекте, ведет учет рабочего времени и интегрируется с системами безопасности. Применяем считыватели бесконтактных карт (Mifare, EM-Marine), биометрические терминалы (отпечаток пальца, распознавание лица) и турникеты всех типов. Система позволяет создавать гибкие графики доступа, формировать отчеты и интегрироваться с системами видеонаблюдения для видеоверификации проходов.'
  },
  {
    id: 'sots',
    title: 'СОТС',
    fullTitle: 'Система охранно-тревожной сигнализации',
    description: 'Надежная защита периметра и помещений с тревожным оповещением',
    icon: 'Bell',
    features: ['Датчики движения', 'Периметральная защита', 'Интеграция со СКУД', 'Тревожная кнопка'],
    detailedDescription: 'СОТС защищает объект от несанкционированного проникновения с помощью инфракрасных, микроволновых и комбинированных датчиков движения, магнитоконтактных извещателей на окна и двери, датчиков разбития стекла. Система включает в себя кнопки экстренного вызова и интегрируется с пультами охраны. Возможна настройка зонального управления для постановки на охрану отдельных помещений при работающем персонале.'
  },
  {
    id: 'sot',
    title: 'СОТ',
    fullTitle: 'Система охранного телевидения',
    description: 'Видеонаблюдение с интеллектуальной аналитикой',
    icon: 'Video',
    features: ['IP-камеры 4K', 'Аналитика AI', 'Облачное хранение', 'Мобильный доступ'],
    detailedDescription: 'СОТ — это видеонаблюдение нового поколения с поддержкой разрешения до 4K, видеоаналитикой на базе нейросетей и облачным хранением. Системы позволяют распознавать лица, номера автомобилей, детектировать оставленные предметы, пересечение линий и нахождение в зоне. Видеоархив хранится на локальных серверах или в облаке с возможностью удаленного просмотра через мобильные приложения. Интеграция с СКУД и СОТС для автоматической видеофиксации тревожных событий.'
  },
  {
    id: 'askue',
    title: 'АСКУЭ',
    fullTitle: 'Автоматизированная система контроля и учета энергоресурсов',
    description: 'Мониторинг и оптимизация энергопотребления',
    icon: 'Zap',
    features: ['Учет электроэнергии', 'Анализ потребления', 'Прогнозирование', 'Отчетность'],
    detailedDescription: 'АСКУЭ автоматизирует учет электроэнергии, воды, тепла и газа в режиме реального времени. Система собирает данные с интеллектуальных счетчиков, анализирует потребление по зонам и временным интервалам, выявляет перерасход и формирует отчеты для энергоаудита. Позволяет сократить издержки на 15-30% за счет выявления нерациональных режимов работы оборудования. Данные доступны через веб-интерфейс с построением графиков и прогнозов.'
  },
  {
    id: 'eom',
    title: 'ЭОМ',
    fullTitle: 'Электрооборудование и освещение',
    description: 'Полный комплекс электромонтажных работ',
    icon: 'Lightbulb',
    features: ['Силовые сети', 'Освещение', 'Заземление', 'Молниезащита'],
    detailedDescription: 'ЭОМ включает проектирование и монтаж внутренних и наружных электрических сетей, систем освещения, заземления и молниезащиты. Выполняем прокладку кабельных трасс, установку распределительных щитов, монтаж светильников всех типов (офисные, уличные, взрывозащищенные). Все работы ведутся по проектам с расчетом нагрузок и селективности защит. Используем оборудование ABB, Schneider Electric, Legrand с гарантией до 5 лет.'
  },
  {
    id: 'ovik',
    title: 'ОВИК',
    fullTitle: 'Отопление, вентиляция и кондиционирование',
    description: 'Климатические системы для комфортной среды',
    icon: 'Wind',
    features: ['Вентиляция', 'Кондиционирование', 'Отопление', 'Автоматизация'],
    detailedDescription: 'ОВИК обеспечивает комфортный микроклимат в помещениях круглый год. Проектируем и монтируем приточно-вытяжные установки с рекуперацией тепла (экономия до 70% энергии), системы кондиционирования (VRF, чиллер-фанкойл, сплит-системы), водяное и электрическое отопление. Системы управляются автоматически с поддержанием заданных параметров температуры, влажности и CO2. Используем оборудование Daikin, Mitsubishi Electric, Systemair.'
  }
];

const portfolio = [
  {
    title: 'Бизнес-центр "Технопарк"',
    systems: ['СКС', 'СКУД', 'СОТ', 'ОВИК'],
    area: 15000,
    systemsCount: 4,
    duration: '6 месяцев',
    year: '2024',
    quarter: 'Q2'
  },
  {
    title: 'Производственный комплекс "Металлург"',
    systems: ['САПС', 'СОУЭ', 'СОТС', 'АСКУЭ'],
    area: 8500,
    systemsCount: 4,
    duration: '4 месяца',
    year: '2024',
    quarter: 'Q1'
  },
  {
    title: 'Логистический центр "Урал-Транзит"',
    systems: ['СКС', 'СОТ', 'СКУД', 'ЭОМ'],
    area: 22000,
    systemsCount: 4,
    duration: '8 месяцев',
    year: '2023',
    quarter: 'Q4'
  },
  {
    title: 'Административное здание "Северный"',
    systems: ['СКС', 'СКУД', 'СОУЭ', 'ОВИК'],
    area: 6200,
    systemsCount: 4,
    duration: '3 месяца',
    year: '2023',
    quarter: 'Q3'
  },
  {
    title: 'ТРЦ "Гринвич"',
    systems: ['САПС', 'СОУЭ', 'СОТ', 'ЭОМ', 'ОВИК'],
    area: 35000,
    systemsCount: 5,
    duration: '12 месяцев',
    year: '2023',
    quarter: 'Q2'
  },
  {
    title: 'Медицинский центр "ЕвроМед"',
    systems: ['СКС', 'САПС', 'СОУЭ', 'СКУД', 'ОВИК'],
    area: 4500,
    systemsCount: 5,
    duration: '5 месяцев',
    year: '2023',
    quarter: 'Q1'
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
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [showAllProjects, setShowAllProjects] = useState(false);

  const years = ['all', ...Array.from(new Set(portfolio.map(p => p.year)))].sort().reverse();
  
  const filteredPortfolio = selectedYear === 'all' 
    ? portfolio 
    : portfolio.filter(p => p.year === selectedYear);
  
  const displayedProjects = showAllProjects ? filteredPortfolio : filteredPortfolio.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/LOGO TEXT SYSTEMCRAFT.png" 
                alt="СистемКрафт" 
                className="h-16 w-auto transition-transform duration-300 hover:scale-105 cursor-pointer"
              />
            </div>
            <nav className="hidden md:flex gap-6 items-center">
              <a href="#solutions" className="text-sm font-medium hover:text-primary transition-colors">Решения</a>
              <a href="#portfolio" className="text-sm font-medium hover:text-primary transition-colors">Портфолио</a>
              <a href="#certificates" className="text-sm font-medium hover:text-primary transition-colors">Сертификаты</a>
            </nav>
            <div className="flex gap-2">
              <Button className="hidden md:flex" variant="outline" asChild>
                <a href="tel:+73433799888">
                  <Icon name="Phone" size={16} className="mr-2" />
                  +7 (343) 379-98-88
                </a>
              </Button>
              <Button className="hidden md:flex" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                <Icon name="Mail" size={16} className="mr-2" />
                Заявка
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-muted">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDApLDAsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
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
              <div className="group cursor-default">
                <div className="text-3xl font-heading font-bold text-primary transition-all duration-300 group-hover:scale-110">250+</div>
                <div className="text-sm text-muted-foreground mt-1 transition-colors group-hover:text-foreground">Реализованных проектов</div>
              </div>
              <div className="group cursor-default">
                <div className="text-3xl font-heading font-bold text-primary transition-all duration-300 group-hover:scale-110">15+</div>
                <div className="text-sm text-muted-foreground mt-1 transition-colors group-hover:text-foreground">Лет на рынке</div>
              </div>
              <div className="group cursor-default">
                <div className="text-3xl font-heading font-bold text-primary transition-all duration-300 group-hover:scale-110">98%</div>
                <div className="text-sm text-muted-foreground mt-1 transition-colors group-hover:text-foreground">Довольных клиентов</div>
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
                className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 cursor-pointer hover:scale-[1.05] hover:border-primary hover:-translate-y-2 animate-scale-in bg-card/50 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedSolution(solution.id)}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 group-hover:bg-primary">
                    <Icon name={solution.icon as any} className="text-primary group-hover:text-white transition-colors duration-500" size={28} />
                  </div>
                  <CardTitle className="text-xl font-heading">{solution.title}</CardTitle>
                  <CardDescription className="text-xs font-medium text-muted-foreground/80">
                    {solution.fullTitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{solution.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {solution.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setSelectedSolution(selectedSolution === solution.id ? null : solution.id)}
                  >
                    <Icon name={selectedSolution === solution.id ? "ChevronUp" : "ChevronDown"} size={16} className="mr-2" />
                    {selectedSolution === solution.id ? "Скрыть детали" : "Подробнее"}
                  </Button>
                  {selectedSolution === solution.id && solution.detailedDescription && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {solution.detailedDescription}
                      </p>
                    </div>
                  )}
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

          {/* Filter by year */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {years.map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedYear(year);
                  setShowAllProjects(false);
                }}
                className="transition-all duration-300"
              >
                {year === 'all' ? 'Все проекты' : year}
              </Button>
            ))}
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block"></div>
            
            <div className="space-y-8">
              {displayedProjects.map((project, index) => (
                <div key={index} className="relative animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Timeline dot */}
                  <div className="absolute left-8 top-8 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg hidden md:block transform -translate-x-1/2"></div>
                  
                  <Card className="md:ml-20 group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl font-heading">{project.title}</CardTitle>
                            <Badge variant="secondary" className="text-xs">{project.year} {project.quarter}</Badge>
                          </div>
                          
                          {/* Metrics Grid */}
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="text-center p-3 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                              <div className="text-2xl font-bold text-primary">{project.area.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground mt-1">м² площадь</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                              <div className="text-2xl font-bold text-primary">{project.systemsCount}</div>
                              <div className="text-xs text-muted-foreground mt-1">системы</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                              <div className="text-2xl font-bold text-primary">{project.duration.split(' ')[0]}</div>
                              <div className="text-xs text-muted-foreground mt-1">{project.duration.split(' ')[1]}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.systems.map((system, idx) => (
                          <Badge key={idx} variant="outline" className="font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default">
                            {system}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Show All Button */}
          {filteredPortfolio.length > 3 && (
            <div className="text-center mt-12">
              <Button 
                size="lg" 
                variant={showAllProjects ? "outline" : "default"}
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="gap-2 group"
              >
                <Icon 
                  name={showAllProjects ? "ChevronUp" : "ChevronDown"} 
                  size={20} 
                  className="group-hover:translate-y-1 transition-transform"
                />
                {showAllProjects ? 'Скрыть проекты' : `Показать все проекты (${filteredPortfolio.length})`}
              </Button>
            </div>
          )}
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

          <div className="mt-12 text-center">
            <Card className="inline-block px-8 py-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 transition-all duration-500 cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Icon name="ShieldCheck" className="text-primary" size={40} />
                </div>
                <div className="text-left">
                  <p className="font-heading font-bold text-lg group-hover:text-primary transition-colors">Гарантия качества</p>
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
            <Card className="group text-center hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                  <Icon name="Phone" className="text-primary group-hover:text-white transition-colors duration-500" size={24} />
                </div>
                <p className="font-medium mb-1">Телефон</p>
                <a href="tel:+73433799888" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  +7 (343) 379-98-88
                </a>
                <p className="text-xs text-muted-foreground/70 mt-1">Многоканальный</p>
              </CardContent>
            </Card>
            <Card className="group text-center hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                  <Icon name="Mail" className="text-primary group-hover:text-white transition-colors duration-500" size={24} />
                </div>
                <p className="font-medium mb-1">Email</p>
                <a href="mailto:info@systemcraft.ru" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  info@systemcraft.ru
                </a>
              </CardContent>
            </Card>
            <Card className="group text-center hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                  <Icon name="MapPin" className="text-primary group-hover:text-white transition-colors duration-500" size={24} />
                </div>
                <p className="font-medium mb-1">Офис</p>
                <p className="text-sm text-muted-foreground">
                  г. Екатеринбург, ул. Крестинского, 46А, офис 702
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16">
            <h4 className="text-2xl font-heading font-bold mb-6 text-center">Как нас найти</h4>
            <div className="rounded-xl overflow-hidden border border-border shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <iframe 
                src="https://yandex.ru/map-widget/v1/?ll=60.630559%2C56.787834&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1MzExNDMyNRJL0KDQvtGB0YHQuNGPLCDQldC60LDRgtC10YDQuNC90LHRg9GA0LMsINGD0LvQuNGG0LAg0JrRgNC10YHRgtC40L3RgdC60L7Qs9C%2BICQ2JUEiCg23D0BCFbmZYEI%2C&z=17" 
                width="100%" 
                height="400" 
                frameBorder="0"
                allowFullScreen={true}
                className="w-full"
                title="Карта офиса"
              ></iframe>
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground mb-2">
                г. Екатеринбург, ул. Крестинского, 46А, офис 702
              </p>
              <Button variant="outline" asChild className="mt-2">
                <a 
                  href="https://yandex.ru/maps/54/yekaterinburg/house/ulitsa_krestinskogo_46a/YkkYcARgTEUBQFtsfXt5dnRhbA==/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Icon name="MapPin" size={16} className="mr-2" />
                  Открыть в Яндекс.Картах
                </a>
              </Button>
            </div>
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
                className="h-14 w-auto mb-4 transition-transform duration-300 hover:scale-105"
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
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a href="tel:+73433799888" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Icon name="Phone" size={14} />
                    <div>
                      <div>+7 (343) 379-98-88</div>
                      <div className="text-xs opacity-70">Многоканальный</div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="mailto:info@systemcraft.ru" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Icon name="Mail" size={14} />
                    info@systemcraft.ru
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="MapPin" size={14} className="mt-0.5" />
                  <div>
                    г. Екатеринбург,<br />
                    ул. Крестинского, 46А,<br />
                    офис 702
                  </div>
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