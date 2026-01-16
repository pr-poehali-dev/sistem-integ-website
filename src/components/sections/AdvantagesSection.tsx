import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { getContent } from '@/lib/content-manager';
import { useState, useEffect } from 'react';

const advantages = [
  {
    icon: 'ClipboardCheck',
    title: 'Полный цикл работ',
    description: 'От проектирования до пусконаладки и гарантийного обслуживания',
    color: 'from-blue-500/20 to-blue-500/10'
  },
  {
    icon: 'Award',
    title: 'Сертифицированные специалисты',
    description: 'Команда инженеров с подтвержденной квалификацией и опытом 15+ лет',
    color: 'from-purple-500/20 to-purple-500/10'
  },
  {
    icon: 'TrendingUp',
    title: 'Прозрачное ценообразование',
    description: 'Детальная смета, фиксированные цены без скрытых доплат',
    color: 'from-green-500/20 to-green-500/10'
  },
  {
    icon: 'Clock',
    title: 'Соблюдение сроков',
    description: 'Поэтапный график работ с четкими дедлайнами и отчетностью',
    color: 'from-orange-500/20 to-orange-500/10'
  },
  {
    icon: 'ShieldCheck',
    title: 'Гарантия от 2 до 25 лет',
    description: 'Гарантия качества на все виды работ в зависимости от типа системы',
    color: 'from-red-500/20 to-red-500/10'
  },
  {
    icon: 'Headphones',
    title: 'Техподдержка 24/7',
    description: 'Круглосуточная диспетчерская служба и выезд специалистов',
    color: 'from-cyan-500/20 to-cyan-500/10'
  }
];

export default function AdvantagesSection() {
  const [content, setContent] = useState(getContent().advantages);

  useEffect(() => {
    const handleUpdate = () => setContent(getContent().advantages);
    window.addEventListener('content-updated', handleUpdate);
    return () => window.removeEventListener('content-updated', handleUpdate);
  }, []);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            <Icon name="Star" size={14} className="mr-2" />
            Преимущества
          </Badge>
          <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {content.title}
          </h3>
          <p className="text-muted-foreground">
            Мы создаем долгосрочные партнерские отношения, обеспечивая качество на каждом этапе
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.items.map((item, index) => (
            <Card 
              key={item.id} 
              className="group relative overflow-hidden border-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Icon name={item.icon as any} className="text-primary" size={28} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {content.stats.map((stat, index) => (
            <div key={stat.id} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                <Icon name={index === 0 ? "Users" : index === 1 ? "Building2" : "ThumbsUp"} className="text-primary group-hover:text-white transition-colors" size={32} />
              </div>
              <div className="text-3xl font-heading font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}