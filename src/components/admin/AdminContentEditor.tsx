import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ImagePicker from '@/components/admin/ImagePicker';
import type { SiteContent } from '@/lib/content-manager';

type TabId = 'hero' | 'solutions' | 'advantages' | 'portfolio' | 'certificates' | 'contact';

interface AdminContentEditorProps {
  activeTab: TabId;
  content: SiteContent;
  onContentChange: (content: SiteContent) => void;
}

export default function AdminContentEditor({ activeTab, content, onContentChange }: AdminContentEditorProps) {
  return (
    <Card className="p-6">
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Слайдер на главной</h2>
          <div className="space-y-6">
            {content.hero.slides.map((slide, index) => (
              <Card key={slide.id} className="p-4">
                <h3 className="font-semibold mb-4">Слайд {index + 1}: {slide.title}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Заголовок (badge)</label>
                    <Input
                      value={slide.title}
                      onChange={(e) => {
                        const newSlides = [...content.hero.slides];
                        newSlides[index].title = e.target.value;
                        onContentChange({ ...content, hero: { ...content.hero, slides: newSlides } });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Подзаголовок</label>
                    <Input
                      value={slide.subtitle}
                      onChange={(e) => {
                        const newSlides = [...content.hero.slides];
                        newSlides[index].subtitle = e.target.value;
                        onContentChange({ ...content, hero: { ...content.hero, slides: newSlides } });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Описание</label>
                    <Textarea
                      value={slide.description}
                      onChange={(e) => {
                        const newSlides = [...content.hero.slides];
                        newSlides[index].description = e.target.value;
                        onContentChange({ ...content, hero: { ...content.hero, slides: newSlides } });
                      }}
                      rows={3}
                    />
                  </div>
                  <ImagePicker
                    label="Изображение слайда"
                    value={slide.image}
                    category="slider"
                    onChange={(url) => {
                      const newSlides = [...content.hero.slides];
                      newSlides[index].image = url;
                      onContentChange({ ...content, hero: { ...content.hero, slides: newSlides } });
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'solutions' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Решения</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Заголовок раздела</label>
            <Input
              value={content.solutions.title}
              onChange={(e) => onContentChange({ ...content, solutions: { ...content.solutions, title: e.target.value } })}
            />
          </div>
          <div className="space-y-4">
            {content.solutions.items.map((item, index) => (
              <Card key={item.id} className="p-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Название"
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...content.solutions.items];
                      newItems[index].title = e.target.value;
                      onContentChange({ ...content, solutions: { ...content.solutions, items: newItems } });
                    }}
                  />
                  <Textarea
                    placeholder="Описание"
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...content.solutions.items];
                      newItems[index].description = e.target.value;
                      onContentChange({ ...content, solutions: { ...content.solutions, items: newItems } });
                    }}
                    rows={2}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'advantages' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Преимущества</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Заголовок раздела</label>
            <Input
              value={content.advantages.title}
              onChange={(e) => onContentChange({ ...content, advantages: { ...content.advantages, title: e.target.value } })}
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Преимущества</h3>
            {content.advantages.items.map((item, index) => (
              <Card key={item.id} className="p-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Название"
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...content.advantages.items];
                      newItems[index].title = e.target.value;
                      onContentChange({ ...content, advantages: { ...content.advantages, items: newItems } });
                    }}
                  />
                  <Textarea
                    placeholder="Описание"
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...content.advantages.items];
                      newItems[index].description = e.target.value;
                      onContentChange({ ...content, advantages: { ...content.advantages, items: newItems } });
                    }}
                    rows={2}
                  />
                </div>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Статистика</h3>
            {content.advantages.stats.map((stat, index) => (
              <Card key={stat.id} className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Значение"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...content.advantages.stats];
                      newStats[index].value = e.target.value;
                      onContentChange({ ...content, advantages: { ...content.advantages, stats: newStats } });
                    }}
                  />
                  <Input
                    placeholder="Подпись"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...content.advantages.stats];
                      newStats[index].label = e.target.value;
                      onContentChange({ ...content, advantages: { ...content.advantages, stats: newStats } });
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Портфолио</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Заголовок раздела</label>
            <Input
              value={content.portfolio.title}
              onChange={(e) => onContentChange({ ...content, portfolio: { ...content.portfolio, title: e.target.value } })}
            />
          </div>
          <div className="space-y-4">
            {content.portfolio.projects.map((project, index) => (
              <Card key={project.id} className="p-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Название проекта"
                    value={project.title}
                    onChange={(e) => {
                      const newProjects = [...content.portfolio.projects];
                      newProjects[index].title = e.target.value;
                      onContentChange({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                    }}
                  />
                  <Input
                    placeholder="Категория"
                    value={project.category}
                    onChange={(e) => {
                      const newProjects = [...content.portfolio.projects];
                      newProjects[index].category = e.target.value;
                      onContentChange({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                    }}
                  />
                  <Textarea
                    placeholder="Описание"
                    value={project.description}
                    onChange={(e) => {
                      const newProjects = [...content.portfolio.projects];
                      newProjects[index].description = e.target.value;
                      onContentChange({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                    }}
                    rows={2}
                  />
                  <ImagePicker
                    label="Изображение проекта"
                    value={project.image}
                    category="portfolio"
                    onChange={(url) => {
                      const newProjects = [...content.portfolio.projects];
                      newProjects[index].image = url;
                      onContentChange({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newProjects = content.portfolio.projects.filter((_, i) => i !== index);
                      onContentChange({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                    }}
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить проект
                  </Button>
                </div>
              </Card>
            ))}
            <Button
              onClick={() => {
                const newProject = {
                  id: Date.now().toString(),
                  title: 'Новый проект',
                  description: 'Описание проекта',
                  image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
                  category: 'Категория',
                };
                onContentChange({ ...content, portfolio: { ...content.portfolio, projects: [...content.portfolio.projects, newProject] } });
              }}
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить проект
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Сертификаты</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Заголовок раздела</label>
            <Input
              value={content.certificates.title}
              onChange={(e) => onContentChange({ ...content, certificates: { ...content.certificates, title: e.target.value } })}
            />
          </div>
          <div className="space-y-4">
            {content.certificates.items.map((cert, index) => (
              <Card key={cert.id} className="p-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Название сертификата"
                    value={cert.title}
                    onChange={(e) => {
                      const newCerts = [...content.certificates.items];
                      newCerts[index].title = e.target.value;
                      onContentChange({ ...content, certificates: { ...content.certificates, items: newCerts } });
                    }}
                  />
                  <ImagePicker
                    label="Изображение сертификата"
                    value={cert.image}
                    category="certificates"
                    onChange={(url) => {
                      const newCerts = [...content.certificates.items];
                      newCerts[index].image = url;
                      onContentChange({ ...content, certificates: { ...content.certificates, items: newCerts } });
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newCerts = content.certificates.items.filter((_, i) => i !== index);
                      onContentChange({ ...content, certificates: { ...content.certificates, items: newCerts } });
                    }}
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить
                  </Button>
                </div>
              </Card>
            ))}
            <Button
              onClick={() => {
                const newCert = {
                  id: Date.now().toString(),
                  title: 'Новый сертификат',
                  image: 'https://images.unsplash.com/photo-1554224311-beee1249cd19?w=400&h=600&fit=crop',
                };
                onContentChange({ ...content, certificates: { ...content.certificates, items: [...content.certificates.items, newCert] } });
              }}
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить сертификат
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Контакты</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Заголовок</label>
              <Input
                value={content.contact.title}
                onChange={(e) => onContentChange({ ...content, contact: { ...content.contact, title: e.target.value } })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Телефон</label>
              <Input
                value={content.contact.phone}
                onChange={(e) => onContentChange({ ...content, contact: { ...content.contact, phone: e.target.value } })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={content.contact.email}
                onChange={(e) => onContentChange({ ...content, contact: { ...content.contact, email: e.target.value } })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Адрес</label>
              <Input
                value={content.contact.address}
                onChange={(e) => onContentChange({ ...content, contact: { ...content.contact, address: e.target.value } })}
              />
            </div>
            <div>
              <h3 className="font-semibold mb-3">Социальные сети</h3>
              <div className="space-y-3">
                <Input
                  placeholder="VK (ссылка)"
                  value={content.contact.socials.vk || ''}
                  onChange={(e) => onContentChange({ ...content, contact: { ...content.contact, socials: { ...content.contact.socials, vk: e.target.value } } })}
                />
                <Input
                  placeholder="Telegram (ссылка)"
                  value={content.contact.socials.telegram || ''}
                  onChange={(e) => onContentChange({ ...content, contact: { ...content.contact, socials: { ...content.contact.socials, telegram: e.target.value } } })}
                />
                <Input
                  placeholder="WhatsApp (ссылка)"
                  value={content.contact.socials.whatsapp || ''}
                  onChange={(e) => onContentChange({ ...content, contact: { ...content.contact, socials: { ...content.contact.socials, whatsapp: e.target.value } } })}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}