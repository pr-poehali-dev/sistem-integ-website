import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '@/lib/user-manager';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface LegalEntity {
  id: number;
  name: string;
  inn: string;
  kpp: string;
  ogrn: string;
  legalAddress: string;
  actualAddress: string;
  directorName: string;
  phone: string;
  email: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  budget: number | null;
  userRole: string;
}

interface ProjectData {
  project: Project;
  legalEntity: LegalEntity | null;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || (user.role !== 'client' && user.role !== 'employee')) {
      navigate('/');
      return;
    }
    setCurrentUser(user);
    loadUserData(user.email);
  }, [navigate]);

  const loadUserData = async (email: string) => {
    try {
      const response = await fetch(
        `https://functions.poehali.dev/e7c5eaf3-03c2-41ec-9a8f-0b3b96b21a6e?email=${encodeURIComponent(email)}`
      );
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }

      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU');
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '—';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      active: { label: 'Активен', className: 'bg-green-100 text-green-700' },
      completed: { label: 'Завершен', className: 'bg-blue-100 text-blue-700' },
      pending: { label: 'В ожидании', className: 'bg-yellow-100 text-yellow-700' },
      cancelled: { label: 'Отменен', className: 'bg-red-100 text-red-700' }
    };
    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    if (role === 'employee') {
      return <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">Сотрудник</span>;
    }
    return <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">Клиент</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Icon name="Loader" size={48} className="animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Личный кабинет</h1>
            {currentUser && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Привет, {currentUser.name}</span>
                {getRoleBadge(currentUser.role)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/')}>
              <Icon name="Home" size={16} className="mr-2" />
              На главную
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выход
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Мои проекты</h2>
          <p className="text-gray-600">
            {projects.length === 0 
              ? 'У вас пока нет проектов' 
              : `Всего проектов: ${projects.length}`}
          </p>
        </div>

        {projects.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="FolderOpen" size={64} className="mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-semibold mb-2">Нет проектов</h3>
            <p className="text-muted-foreground">
              Свяжитесь с администратором для добавления проектов
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((item) => (
              <Card 
                key={item.project.id} 
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedProject(item)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{item.project.title}</h3>
                    {getStatusBadge(item.project.status)}
                  </div>
                  <Icon name="ChevronRight" size={24} className="text-gray-400" />
                </div>

                {item.project.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.project.description}</p>
                )}

                <div className="space-y-2 text-sm">
                  {item.project.startDate && (
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={14} className="text-gray-400" />
                      <span className="text-gray-600">
                        {formatDate(item.project.startDate)}
                        {item.project.endDate && ` — ${formatDate(item.project.endDate)}`}
                      </span>
                    </div>
                  )}

                  {item.project.budget && (
                    <div className="flex items-center gap-2">
                      <Icon name="DollarSign" size={14} className="text-gray-400" />
                      <span className="text-gray-600">{formatCurrency(item.project.budget)}</span>
                    </div>
                  )}

                  {item.legalEntity && (
                    <div className="flex items-center gap-2">
                      <Icon name="Building2" size={14} className="text-gray-400" />
                      <span className="text-gray-600">{item.legalEntity.name}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {selectedProject && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProject(null)}
          >
            <Card 
              className="max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedProject.project.title}</h2>
                  {getStatusBadge(selectedProject.project.status)}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProject(null)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>

              {selectedProject.project.description && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Описание</h3>
                  <p className="text-gray-600">{selectedProject.project.description}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-3">Информация о проекте</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Дата начала:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedProject.project.startDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Дата окончания:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedProject.project.endDate)}</span>
                    </div>
                    {selectedProject.project.budget && (
                      <div>
                        <span className="text-gray-500">Бюджет:</span>
                        <span className="ml-2 font-medium">{formatCurrency(selectedProject.project.budget)}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Ваша роль:</span>
                      <span className="ml-2">{getRoleBadge(selectedProject.project.userRole)}</span>
                    </div>
                  </div>
                </div>

                {selectedProject.legalEntity && (
                  <div>
                    <h3 className="font-semibold mb-3">Юридическое лицо</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Название:</span>
                        <span className="ml-2 font-medium">{selectedProject.legalEntity.name}</span>
                      </div>
                      {selectedProject.legalEntity.inn && (
                        <div>
                          <span className="text-gray-500">ИНН:</span>
                          <span className="ml-2 font-medium">{selectedProject.legalEntity.inn}</span>
                        </div>
                      )}
                      {selectedProject.legalEntity.kpp && (
                        <div>
                          <span className="text-gray-500">КПП:</span>
                          <span className="ml-2 font-medium">{selectedProject.legalEntity.kpp}</span>
                        </div>
                      )}
                      {selectedProject.legalEntity.ogrn && (
                        <div>
                          <span className="text-gray-500">ОГРН:</span>
                          <span className="ml-2 font-medium">{selectedProject.legalEntity.ogrn}</span>
                        </div>
                      )}
                      {selectedProject.legalEntity.directorName && (
                        <div>
                          <span className="text-gray-500">Директор:</span>
                          <span className="ml-2 font-medium">{selectedProject.legalEntity.directorName}</span>
                        </div>
                      )}
                      {selectedProject.legalEntity.phone && (
                        <div>
                          <span className="text-gray-500">Телефон:</span>
                          <span className="ml-2 font-medium">{selectedProject.legalEntity.phone}</span>
                        </div>
                      )}
                      {selectedProject.legalEntity.email && (
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <span className="ml-2 font-medium">{selectedProject.legalEntity.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedProject.legalEntity && (
                <div>
                  <h3 className="font-semibold mb-3">Адреса</h3>
                  <div className="space-y-3 text-sm">
                    {selectedProject.legalEntity.legalAddress && (
                      <div>
                        <span className="text-gray-500 block mb-1">Юридический адрес:</span>
                        <span className="font-medium">{selectedProject.legalEntity.legalAddress}</span>
                      </div>
                    )}
                    {selectedProject.legalEntity.actualAddress && (
                      <div>
                        <span className="text-gray-500 block mb-1">Фактический адрес:</span>
                        <span className="font-medium">{selectedProject.legalEntity.actualAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
