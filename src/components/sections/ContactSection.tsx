import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import ContactForm from '@/components/ContactForm';

export default function ContactSection() {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            <Icon name="MessageSquare" size={14} className="mr-2" />
            Связь
          </Badge>
          <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Свяжитесь с нами
          </h3>
          <p className="text-muted-foreground">
            Готовы обсудить ваш проект. Оставьте заявку, и мы свяжемся с вами в ближайшее время
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
  );
}
