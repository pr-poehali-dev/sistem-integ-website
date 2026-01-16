import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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

export default function SolutionsSection() {
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);

  return (
    <section id="solutions" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            <Icon name="Cpu" size={14} className="mr-2" />
            Решения
          </Badge>
          <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Инженерные системы под ключ
          </h3>
          <p className="text-muted-foreground">
            Полный спектр услуг по проектированию, монтажу и обслуживанию современных систем автоматизации зданий
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution, index) => (
            <Card key={solution.id} className="group relative overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-slide-up cursor-pointer" style={{ animationDelay: `${index * 0.05}s` }}>
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
  );
}
