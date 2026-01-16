import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { getContent, saveContent, checkPassword, changePassword, resetContent, type SiteContent } from '@/lib/content-manager';

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'solutions' | 'advantages' | 'portfolio' | 'certificates' | 'contact'>('hero');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      setContent(getContent());
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkPassword(password)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setContent(getContent());
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    navigate('/');
  };

  const handleSave = () => {
    if (content) {
      saveContent(content);
      alert('Изменения сохранены!');
    }
  };

  const handlePasswordChange = () => {
    if (changePassword(oldPassword, newPassword)) {
      alert('Пароль успешно изменен!');
      setShowPasswordChange(false);
      setOldPassword('');
      setNewPassword('');
    } else {
      alert('Неверный текущий пароль');
    }
  };

  const handleReset = () => {
    if (confirm('Вы уверены? Все изменения будут потеряны.')) {
      resetContent();
      setContent(getContent());
      alert('Контент сброшен к начальному состоянию');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Icon name="Lock" size={32} className="text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
            <p className="text-gray-600 mt-2">Введите пароль для доступа</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>
            <Button type="submit" className="w-full">
              Войти
            </Button>
            <p className="text-xs text-gray-500 text-center mt-4">
              По умолчанию пароль: admin
            </p>
          </form>
        </Card>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Управление сайтом</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPasswordChange(true)}>
              <Icon name="Key" size={16} className="mr-2" />
              Сменить пароль
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Сбросить
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <Icon name="Eye" size={16} className="mr-2" />
              Просмотр
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <Icon name="LogOut" size={16} />
            </Button>
          </div>
        </div>
      </header>

      {showPasswordChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Смена пароля</h2>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Текущий пароль"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handlePasswordChange} className="flex-1">
                  Изменить
                </Button>
                <Button variant="outline" onClick={() => setShowPasswordChange(false)} className="flex-1">
                  Отмена
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <Card className="p-4 sticky top-24">
              <nav className="space-y-2">
                {[
                  { id: 'hero', label: 'Главный экран', icon: 'Home' },
                  { id: 'solutions', label: 'Решения', icon: 'Lightbulb' },
                  { id: 'advantages', label: 'Преимущества', icon: 'Award' },
                  { id: 'portfolio', label: 'Портфолио', icon: 'Briefcase' },
                  { id: 'certificates', label: 'Сертификаты', icon: 'Shield' },
                  { id: 'contact', label: 'Контакты', icon: 'Phone' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-900 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Icon name={tab.icon as any} size={20} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </Card>
          </aside>

          <main className="lg:col-span-3">
            <Card className="p-6">
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Главный экран</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Заголовок</label>
                      <Input
                        value={content.hero.title}
                        onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Подзаголовок</label>
                      <Input
                        value={content.hero.subtitle}
                        onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Описание</label>
                      <Textarea
                        value={content.hero.description}
                        onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })}
                        rows={3}
                      />
                    </div>
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
                      onChange={(e) => setContent({ ...content, solutions: { ...content.solutions, title: e.target.value } })}
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
                              setContent({ ...content, solutions: { ...content.solutions, items: newItems } });
                            }}
                          />
                          <Textarea
                            placeholder="Описание"
                            value={item.description}
                            onChange={(e) => {
                              const newItems = [...content.solutions.items];
                              newItems[index].description = e.target.value;
                              setContent({ ...content, solutions: { ...content.solutions, items: newItems } });
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
                      onChange={(e) => setContent({ ...content, advantages: { ...content.advantages, title: e.target.value } })}
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
                              setContent({ ...content, advantages: { ...content.advantages, items: newItems } });
                            }}
                          />
                          <Textarea
                            placeholder="Описание"
                            value={item.description}
                            onChange={(e) => {
                              const newItems = [...content.advantages.items];
                              newItems[index].description = e.target.value;
                              setContent({ ...content, advantages: { ...content.advantages, items: newItems } });
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
                              setContent({ ...content, advantages: { ...content.advantages, stats: newStats } });
                            }}
                          />
                          <Input
                            placeholder="Подпись"
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...content.advantages.stats];
                              newStats[index].label = e.target.value;
                              setContent({ ...content, advantages: { ...content.advantages, stats: newStats } });
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
                      onChange={(e) => setContent({ ...content, portfolio: { ...content.portfolio, title: e.target.value } })}
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
                              setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                            }}
                          />
                          <Input
                            placeholder="Категория"
                            value={project.category}
                            onChange={(e) => {
                              const newProjects = [...content.portfolio.projects];
                              newProjects[index].category = e.target.value;
                              setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                            }}
                          />
                          <Textarea
                            placeholder="Описание"
                            value={project.description}
                            onChange={(e) => {
                              const newProjects = [...content.portfolio.projects];
                              newProjects[index].description = e.target.value;
                              setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                            }}
                            rows={2}
                          />
                          <Input
                            placeholder="URL изображения"
                            value={project.image}
                            onChange={(e) => {
                              const newProjects = [...content.portfolio.projects];
                              newProjects[index].image = e.target.value;
                              setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
                            }}
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newProjects = content.portfolio.projects.filter((_, i) => i !== index);
                              setContent({ ...content, portfolio: { ...content.portfolio, projects: newProjects } });
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
                        setContent({ ...content, portfolio: { ...content.portfolio, projects: [...content.portfolio.projects, newProject] } });
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
                      onChange={(e) => setContent({ ...content, certificates: { ...content.certificates, title: e.target.value } })}
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
                              setContent({ ...content, certificates: { ...content.certificates, items: newCerts } });
                            }}
                          />
                          <Input
                            placeholder="URL изображения"
                            value={cert.image}
                            onChange={(e) => {
                              const newCerts = [...content.certificates.items];
                              newCerts[index].image = e.target.value;
                              setContent({ ...content, certificates: { ...content.certificates, items: newCerts } });
                            }}
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newCerts = content.certificates.items.filter((_, i) => i !== index);
                              setContent({ ...content, certificates: { ...content.certificates, items: newCerts } });
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
                        setContent({ ...content, certificates: { ...content.certificates, items: [...content.certificates.items, newCert] } });
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
                        onChange={(e) => setContent({ ...content, contact: { ...content.contact, title: e.target.value } })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Телефон</label>
                      <Input
                        value={content.contact.phone}
                        onChange={(e) => setContent({ ...content, contact: { ...content.contact, phone: e.target.value } })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        value={content.contact.email}
                        onChange={(e) => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Адрес</label>
                      <Input
                        value={content.contact.address}
                        onChange={(e) => setContent({ ...content, contact: { ...content.contact, address: e.target.value } })}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Социальные сети</h3>
                      <div className="space-y-3">
                        <Input
                          placeholder="VK (ссылка)"
                          value={content.contact.socials.vk || ''}
                          onChange={(e) => setContent({ ...content, contact: { ...content.contact, socials: { ...content.contact.socials, vk: e.target.value } } })}
                        />
                        <Input
                          placeholder="Telegram (ссылка)"
                          value={content.contact.socials.telegram || ''}
                          onChange={(e) => setContent({ ...content, contact: { ...content.contact, socials: { ...content.contact.socials, telegram: e.target.value } } })}
                        />
                        <Input
                          placeholder="WhatsApp (ссылка)"
                          value={content.contact.socials.whatsapp || ''}
                          onChange={(e) => setContent({ ...content, contact: { ...content.contact, socials: { ...content.contact.socials, whatsapp: e.target.value } } })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
