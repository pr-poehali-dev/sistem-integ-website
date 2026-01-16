import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import HeroSection from '@/components/sections/HeroSection';
import SolutionsSection from '@/components/sections/SolutionsSection';
import AdvantagesSection from '@/components/sections/AdvantagesSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import CertificatesSection from '@/components/sections/CertificatesSection';
import ContactSection from '@/components/sections/ContactSection';
import TelegramButton from '@/components/TelegramButton';
import ScrollToTop from '@/components/ScrollToTop';
import { getContent } from '@/lib/content-manager';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Index() {
  const [content, setContent] = useState(getContent().contact);

  useEffect(() => {
    const handleUpdate = () => setContent(getContent().contact);
    window.addEventListener('content-updated', handleUpdate);
    return () => window.removeEventListener('content-updated', handleUpdate);
  }, []);

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
              <a href="#solutions" className="text-sm font-medium hover:text-primary transition-colors">Системы и сети</a>
              <a href="#portfolio" className="text-sm font-medium hover:text-primary transition-colors">Портфолио</a>
              <a href="#certificates" className="text-sm font-medium hover:text-primary transition-colors">Сертификаты и лицензии</a>
            </nav>
            <div className="flex gap-2">
              <Button className="hidden md:flex" variant="outline" asChild>
                <a href={`tel:${content.phone.replace(/[^0-9+]/g, '')}`}>
                  <Icon name="Phone" size={16} className="mr-2" />
                  {content.phone}
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

      <HeroSection />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <SolutionsSection />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <AdvantagesSection />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <PortfolioSection />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <CertificatesSection />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <ContactSection />
      </motion.div>
      
      <TelegramButton />
      <ScrollToTop />

      <footer className="border-t border-border/40 py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img 
                src="https://cdn.poehali.dev/files/LOGO TEXT SYSTEMCRAFT.png" 
                alt="СистемКрафт" 
                className="h-14 w-auto mb-4 transition-transform duration-300 hover:scale-105"
              />
              <p className="text-sm text-muted-foreground mb-3">
                Строим системы и сети
              </p>
              <p className="text-xs text-muted-foreground">
                На рынке с 2009 года
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Системы и сети</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#solutions" className="hover:text-primary transition-colors">СКС</a></li>
                <li><a href="#solutions" className="hover:text-primary transition-colors">САПС</a></li>
                <li><a href="#solutions" className="hover:text-primary transition-colors">СОУЭ</a></li>
                <li><a href="#solutions" className="hover:text-primary transition-colors">СКУД</a></li>
                <li><a href="#solutions" className="hover:text-primary transition-colors">СОТС</a></li>
                <li><a href="#solutions" className="hover:text-primary transition-colors">СОТ</a></li>
                <li><a href="#solutions" className="hover:text-primary transition-colors">АСКУЭ</a></li>
                <li><a href="#solutions" className="hover:text-primary transition-colors">ЭОМ</a></li>
                <li><a href="#solutions" className="hover:text-primary transition-colors">ОВИК</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">О нас</a></li>
                <li><a href="#portfolio" className="hover:text-primary transition-colors">Портфолио</a></li>
                <li><a href="#certificates" className="hover:text-primary transition-colors">Сертификаты и лицензии</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Контакты</a></li>
                <li><a href="/privacy-policy" className="hover:text-primary transition-colors">Политика конфиденциальности</a></li>
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
            <p>© 2024 ООО Компания "Системкрафт". Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}