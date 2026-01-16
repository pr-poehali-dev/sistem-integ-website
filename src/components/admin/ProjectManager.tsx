import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getLegalEntities,
  getLegalEntityById,
  type Project,
  type LegalEntity
} from '@/lib/project-manager';
import ProjectAccessManager from './ProjectAccessManager';
import SystemManager from './SystemManager';

export default function ProjectManager() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [legalEntities, setLegalEntities] = useState<LegalEntity[]>([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectTab, setProjectTab] = useState<'info' | 'access' | 'systems'>('info');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'active' as const,
    startDate: '',
    endDate: '',
    budget: '',
    legalEntityId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProjects(getProjects());
    setLegalEntities(getLegalEntities());
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddProject = () => {
    if (!newProject.title) {
      toast({
        title: 'Ошибка',
        description: 'Заполните название проекта',
        variant: 'destructive'
      });
      return;
    }

    createProject({
      title: newProject.title,
      description: newProject.description,
      status: newProject.status,
      startDate: newProject.startDate || null,
      endDate: newProject.endDate || null,
      budget: newProject.budget ? parseFloat(newProject.budget) : null,
      legalEntityId: newProject.legalEntityId || null
    });

    setNewProject({
      title: '',
      description: '',
      status: 'active',
      startDate: '',
      endDate: '',
      budget: '',
      legalEntityId: ''
    });
    setShowAddProject(false);
    loadData();
    
    toast({
      title: 'Успех',
      description: 'Проект создан'
    });
  };

  const handleUpdateProject = () => {
    if (!editingProject) return;

    updateProject(editingProject.id, {
      title: editingProject.title,
      description: editingProject.description,
      status: editingProject.status,
      startDate: editingProject.startDate,
      endDate: editingProject.endDate,
      budget: editingProject.budget,
      legalEntityId: editingProject.legalEntityId
    });

    setEditingProject(null);
    loadData();
    
    toast({
      title: 'Успех',
      description: 'Проект обновлен'
    });
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Удалить проект? Это также удалит все связанные системы и доступы.')) {
      deleteProject(projectId);
      loadData();
      toast({
        title: 'Успех',
        description: 'Проект удален'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'pending': return 'В ожидании';
      case 'completed': return 'Завершен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  if (selectedProject) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => {
          setSelectedProject(null);
          setProjectTab('info');
        }}>
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад к проектам
        </Button>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Icon name="FolderOpen" size={24} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{selectedProject.title}</h3>
              {selectedProject.description && (
                <p className="text-sm text-gray-600">{selectedProject.description}</p>
              )}
            </div>
          </div>
        </Card>

        <div className="flex gap-2 border-b">
          <button
            onClick={() => setProjectTab('info')}
            className={`px-4 py-2 font-medium transition-colors ${
              projectTab === 'info'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon name="Info" size={16} className="inline mr-2" />
            Информация
          </button>
          <button
            onClick={() => setProjectTab('systems')}
            className={`px-4 py-2 font-medium transition-colors ${
              projectTab === 'systems'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon name="Server" size={16} className="inline mr-2" />
            Системы
          </button>
          <button
            onClick={() => setProjectTab('access')}
            className={`px-4 py-2 font-medium transition-colors ${
              projectTab === 'access'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon name="Users" size={16} className="inline mr-2" />
            Доступы
          </button>
        </div>

        {projectTab === 'info' && (
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Статус:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedProject.status)}`}>
                  {getStatusLabel(selectedProject.status)}
                </span>
              </div>
              {selectedProject.startDate && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Дата начала:</span>
                  <span className="ml-2">{new Date(selectedProject.startDate).toLocaleDateString()}</span>
                </div>
              )}
              {selectedProject.endDate && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Дата окончания:</span>
                  <span className="ml-2">{new Date(selectedProject.endDate).toLocaleDateString()}</span>
                </div>
              )}
              {selectedProject.budget && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Бюджет:</span>
                  <span className="ml-2">{selectedProject.budget.toLocaleString()} ₽</span>
                </div>
              )}
              {selectedProject.legalEntityId && (() => {
                const entity = getLegalEntityById(selectedProject.legalEntityId);
                return entity && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Юридическое лицо:</span>
                    <div className="ml-2 inline-block">
                      {entity.name} <span className="text-gray-400">(ИНН: {entity.inn})</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </Card>
        )}

        {projectTab === 'systems' && (
          <SystemManager project={selectedProject} />
        )}

        {projectTab === 'access' && (
          <ProjectAccessManager project={selectedProject} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление проектами</h2>
        <Button onClick={() => setShowAddProject(!showAddProject)}>
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить проект
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <Icon name="Search" size={14} className="inline mr-1" />
              Поиск по названию или описанию
            </label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Введите текст для поиска..."
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <Icon name="Filter" size={14} className="inline mr-1" />
              Фильтр по статусу
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активен</option>
              <option value="pending">В ожидании</option>
              <option value="completed">Завершен</option>
              <option value="cancelled">Отменен</option>
            </select>
          </div>
        </div>
        {(searchQuery || filterStatus !== 'all') && (
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span>Найдено проектов: {filteredProjects.length}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
              }}
            >
              <Icon name="X" size={14} className="mr-1" />
              Сбросить фильтры
            </Button>
          </div>
        )}
      </Card>

      {showAddProject && (
        <Card className="p-6 space-y-4 border-2 border-primary/20">
          <h3 className="font-semibold">Новый проект</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Название проекта *</label>
              <Input
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                placeholder="Название проекта"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Описание проекта"
                className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[100px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Статус</label>
              <select
                value={newProject.status}
                onChange={(e) => setNewProject({ ...newProject, status: e.target.value as 'active' | 'pending' | 'completed' | 'cancelled' })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="active">Активен</option>
                <option value="pending">В ожидании</option>
                <option value="completed">Завершен</option>
                <option value="cancelled">Отменен</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Юридическое лицо</label>
              <select
                value={newProject.legalEntityId}
                onChange={(e) => setNewProject({ ...newProject, legalEntityId: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Не выбрано</option>
                {legalEntities.map((entity) => (
                  <option key={entity.id} value={entity.id}>
                    {entity.name} (ИНН: {entity.inn})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Дата начала</label>
              <Input
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Дата окончания</label>
              <Input
                type="date"
                value={newProject.endDate}
                onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Бюджет (₽)</label>
              <Input
                type="number"
                value={newProject.budget}
                onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddProject}>
              <Icon name="Check" size={16} className="mr-2" />
              Создать
            </Button>
            <Button variant="outline" onClick={() => setShowAddProject(false)}>
              Отмена
            </Button>
          </div>
        </Card>
      )}

      {editingProject && (
        <Card className="p-6 space-y-4 border-2 border-orange-500/30">
          <h3 className="font-semibold">Редактирование проекта</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Название проекта *</label>
              <Input
                value={editingProject.title}
                onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                placeholder="Название проекта"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                value={editingProject.description}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                placeholder="Описание проекта"
                className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[100px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Статус</label>
              <select
                value={editingProject.status}
                onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as 'active' | 'pending' | 'completed' | 'cancelled' })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="active">Активен</option>
                <option value="pending">В ожидании</option>
                <option value="completed">Завершен</option>
                <option value="cancelled">Отменен</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Юридическое лицо</label>
              <select
                value={editingProject.legalEntityId || ''}
                onChange={(e) => setEditingProject({ ...editingProject, legalEntityId: e.target.value || null })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Не выбрано</option>
                {legalEntities.map((entity) => (
                  <option key={entity.id} value={entity.id}>
                    {entity.name} (ИНН: {entity.inn})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Дата начала</label>
              <Input
                type="date"
                value={editingProject.startDate || ''}
                onChange={(e) => setEditingProject({ ...editingProject, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Дата окончания</label>
              <Input
                type="date"
                value={editingProject.endDate || ''}
                onChange={(e) => setEditingProject({ ...editingProject, endDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Бюджет (₽)</label>
              <Input
                type="number"
                value={editingProject.budget || ''}
                onChange={(e) => setEditingProject({ ...editingProject, budget: parseFloat(e.target.value) || null })}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpdateProject}>
              <Icon name="Check" size={16} className="mr-2" />
              Сохранить
            </Button>
            <Button variant="outline" onClick={() => setEditingProject(null)}>
              Отмена
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredProjects.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="FolderOpen" size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">
              {projects.length === 0 ? 'Нет проектов' : 'Проекты не найдены. Попробуйте изменить параметры поиска.'}
            </p>
          </Card>
        ) : (
          filteredProjects.map((project) => {
            const legalEntity = getLegalEntityById(project.legalEntityId);
            
            return (
              <Card key={project.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                    )}
                    
                    <div className="grid md:grid-cols-2 gap-2 text-sm mb-3">
                      {project.startDate && (
                        <div>
                          <Icon name="Calendar" size={14} className="inline mr-1 text-gray-500" />
                          <span className="text-gray-600">Начало: {new Date(project.startDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {project.endDate && (
                        <div>
                          <Icon name="CalendarCheck" size={14} className="inline mr-1 text-gray-500" />
                          <span className="text-gray-600">Окончание: {new Date(project.endDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {project.budget && (
                        <div>
                          <Icon name="Wallet" size={14} className="inline mr-1 text-gray-500" />
                          <span className="text-gray-600">Бюджет: {project.budget.toLocaleString()} ₽</span>
                        </div>
                      )}
                    </div>

                    {legalEntity && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-600">
                          <Icon name="Building2" size={14} className="inline mr-1" />
                          <span className="font-medium">Юрлицо:</span> {legalEntity.name} <span className="text-gray-400">(ИНН: {legalEntity.inn})</span>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => setSelectedProject(project)}
                      title="Открыть проект"
                    >
                      <Icon name="FolderOpen" size={16} className="mr-1" />
                      Открыть
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingProject(project)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}