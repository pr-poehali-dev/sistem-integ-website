import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import HeroSlider from '@/components/HeroSlider';
import SolutionsSection from '@/components/sections/SolutionsSection';
import AdvantagesSection from '@/components/sections/AdvantagesSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import CertificatesSection from '@/components/sections/CertificatesSection';
import ContactSection from '@/components/sections/ContactSection';
import TelegramButton from '@/components/TelegramButton';
import ScrollToTop from '@/components/ScrollToTop';
import CalculatorModal from '@/components/CalculatorModal';
import { getContent } from '@/lib/content-manager';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Index() {
  const [content, setContent] = useState(getContent());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setContent(getContent());
    window.addEventListener('content-updated', handleUpdate);
    return () => window.removeEventListener('content-updated', handleUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/95 transition-all duration-300 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-8">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-3 flex-shrink-0">
              <img 
                src="https://cdn.poehali.dev/files/LOGO TEXT SYSTEMCRAFT.png" 
                alt="СистемКрафт" 
                className="h-14 w-auto transition-transform duration-300 hover:scale-105 cursor-pointer"
              />
            </a>
            
            <nav className="hidden lg:flex gap-1 items-center flex-1 justify-center">
              <a href="#solutions" className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all relative group">
                <span>Системы и сети</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </a>
              <button onClick={() => setCalculatorOpen(true)} className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all relative group">
                <span>Калькулятор</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </button>
              <a href="#portfolio" className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all relative group">
                <span>Портфолио</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </a>
              <a href="#certificates" className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all relative group">
                <span>Сертификаты</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </a>
              <a href="#contact" className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all relative group">
                <span>Контакты</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </a>
            </nav>
            
            <div className="flex gap-2 items-center flex-shrink-0">
              <Button className="hidden lg:flex" size="sm" variant="ghost" asChild>
                <a href={`tel:${content.contact.phone.replace(/[^0-9+]/g, '')}`} className="gap-2">
                  <Icon name="Phone" size={16} />
                  <span className="font-semibold">{content.contact.phone}</span>
                </a>
              </Button>
              <Button className="hidden sm:flex" size="sm" variant="outline" asChild>
                <a href="/login" className="gap-2">
                  <Icon name="User" size={16} />
                  Личный кабинет
                </a>
              </Button>
              <Button className="hidden md:flex" size="sm" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                <Icon name="Send" size={16} className="mr-2" />
                Оставить заявку
              </Button>
              <Button 
                className="lg:hidden" 
                size="sm" 
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
              </Button>
            </div>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/40 bg-background"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <a 
                href="#solutions" 
                className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Системы и сети
              </a>
              <button 
                onClick={() => { setCalculatorOpen(true); setMobileMenuOpen(false); }}
                className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all text-left"
              >
                Калькулятор
              </button>
              <a 
                href="#portfolio" 
                className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Портфолио
              </a>
              <a 
                href="#certificates" 
                className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Сертификаты
              </a>
              <a 
                href="#contact" 
                className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Контакты
              </a>
              <div className="border-t border-border/40 mt-2 pt-2">
                <a 
                  href="/login" 
                  className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon name="User" size={16} />
                  Личный кабинет
                </a>
                <a 
                  href={`tel:${content.contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon name="Phone" size={16} />
                  {content.contact.phone}
                </a>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2"
                >
                  <Icon name="Send" size={16} />
                  Оставить заявку
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </header>

      <HeroSlider />
      
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
                {content.company.tagline}
              </p>
              <p className="text-xs text-muted-foreground">
                На рынке с {content.company.foundedYear} года
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
                <li><a href="/login" className="hover:text-primary transition-colors">Личный кабинет</a></li>
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
            <p>© 2024 {content.company.legalName}. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <TelegramButton />
      <ScrollToTop />
      <CalculatorModal isOpen={calculatorOpen} onClose={() => setCalculatorOpen(false)} />
    </div>
  );
}