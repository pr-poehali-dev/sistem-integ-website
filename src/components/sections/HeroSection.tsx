import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { getContent } from '@/lib/content-manager';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [content, setContent] = useState(getContent().hero);

  useEffect(() => {
    const handleUpdate = () => setContent(getContent().hero);
    window.addEventListener('content-updated', handleUpdate);
    return () => window.removeEventListener('content-updated', handleUpdate);
  }, []);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-muted">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <Badge variant="secondary" className="px-4 py-2">
            <Icon name="Sparkles" size={14} className="mr-2" />
            {content.subtitle}
          </Badge>
          <h2 className="text-4xl md:text-6xl font-heading font-extrabold leading-tight">
            {content.title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {content.description}
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
  );
}