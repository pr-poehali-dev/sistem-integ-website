import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ProjectGallery from '@/components/ProjectGallery';

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

export default function PortfolioSection() {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [showAllProjects, setShowAllProjects] = useState(false);

  const years = ['all', ...Array.from(new Set(portfolio.map(p => p.year)))].sort().reverse();
  
  const filteredPortfolio = selectedYear === 'all' 
    ? portfolio 
    : portfolio.filter(p => p.year === selectedYear);
  
  const displayedProjects = showAllProjects ? filteredPortfolio : filteredPortfolio.slice(0, 3);

  return (
    <>
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

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              <Icon name="Camera" size={14} className="mr-2" />
              Галерея
            </Badge>
            <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Фото с объектов
            </h3>
            <p className="text-muted-foreground">
              Реальные объекты, на которых мы реализовали инженерные системы
            </p>
          </div>

          <ProjectGallery />
        </div>
      </section>
    </>
  );
}
