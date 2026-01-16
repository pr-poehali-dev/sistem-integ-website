import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    systems: [] as string[],
    file: null as File | null
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let fileData = null;
      if (formData.file) {
        const reader = new FileReader();
        const filePromise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(formData.file!);
        });
        const base64Content = await filePromise;
        fileData = {
          name: formData.file.name,
          type: formData.file.type,
          content: base64Content
        };
      }

      const requestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        message: formData.message,
        systems: formData.systems,
        file: fileData
      };

      const response = await fetch('https://functions.poehali.dev/c59964d9-2255-42f3-93ce-55264ab2dfdb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Заявка отправлена!',
          description: 'Мы свяжемся с вами в ближайшее время',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: '',
          systems: [],
          file: null
        });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось отправить заявку',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Проблема с подключением. Попробуйте позже.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSystemToggle = (system: string) => {
    setFormData({
      ...formData,
      systems: formData.systems.includes(system)
        ? formData.systems.filter(s => s !== system)
        : [...formData.systems, system]
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      file
    });
  };

  const availableSystems = [
    { id: 'sks', label: 'СКС - Структурированные кабельные системы' },
    { id: 'saps', label: 'САПС - Система автоматической пожарной сигнализации' },
    { id: 'soue', label: 'СОУЭ - Система оповещения и управления эвакуацией' },
    { id: 'skud', label: 'СКУД - Система контроля и управления доступом' },
    { id: 'sots', label: 'СОТС - Система охранно-тревожной сигнализации' },
    { id: 'sot', label: 'СОТ - Система охранного телевидения' },
    { id: 'askue', label: 'АСКУЭ - Автоматизированная система коммерческого учета электроэнергии' },
    { id: 'eom', label: 'ЭОМ - Электрооборудование и молниезащита' },
    { id: 'ovik', label: 'ОВИК - Отопление, вентиляция и кондиционирование' },
  ];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Icon name="Send" className="text-primary" size={24} />
          </div>
          <div>
            <CardTitle className="text-2xl font-heading">Оставить заявку</CardTitle>
            <CardDescription>Заполните форму и мы свяжемся с вами в течение 24 часов</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                Имя <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Иван Иванов"
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ivan@example.com"
                required
                className="bg-background"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Телефон
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+7 (999) 123-45-67"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">
                Компания
              </label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="ООО Название"
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Интересующие системы
            </label>
            <div className="grid md:grid-cols-2 gap-3 p-4 border rounded-lg bg-background">
              {availableSystems.map((system) => (
                <div key={system.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={system.id}
                    checked={formData.systems.includes(system.id)}
                    onCheckedChange={() => handleSystemToggle(system.id)}
                  />
                  <label
                    htmlFor={system.id}
                    className="text-sm leading-tight cursor-pointer hover:text-primary transition-colors"
                  >
                    {system.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium flex items-center gap-1">
              Сообщение <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Расскажите о вашем проекте..."
              required
              rows={5}
              className="bg-background resize-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-medium flex items-center gap-2">
              <Icon name="Paperclip" size={16} />
              Прикрепить файл
            </label>
            <div className="relative">
              <Input
                id="file"
                name="file"
                type="file"
                onChange={handleFileChange}
                className="bg-background cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
              />
              {formData.file && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Icon name="FileText" size={14} />
                  {formData.file.name} ({Math.round(formData.file.size / 1024)} КБ)
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Поддерживаемые форматы: PDF, DOC, DOCX, JPG, PNG, ZIP. Максимальный размер: 10 МБ
            </p>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Icon name="Loader2" className="animate-spin" size={18} />
                Отправка...
              </>
            ) : (
              <>
                <Icon name="Send" size={18} />
                Отправить заявку
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
          </p>
        </form>
      </CardContent>
    </Card>
  );
}