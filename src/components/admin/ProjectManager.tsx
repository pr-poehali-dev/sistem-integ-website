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
  getLegalEntitiesByProject,
  type Project
} from '@/lib/project-manager';
import ProjectAccessManager from './ProjectAccessManager';

export default function ProjectManager() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'active' as const,
    startDate: '',
    endDate: '',
    budget: '',
    legalEntityId: null as string | null
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    setProjects(getProjects());
  };

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
      legalEntityId: newProject.legalEntityId
    });

    setNewProject({
      title: '',
      description: '',
      status: 'active',
      startDate: '',
      endDate: '',
      budget: '',
      legalEntityId: null
    });
    setShowAddProject(false);
    loadProjects();
    
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
    loadProjects();
    
    toast({
      title: 'Успех',
      description: 'Проект обновлен'
    });
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Удалить проект? Это также удалит все связанные юрлица и доступы.')) {
      deleteProject(projectId);
      loadProjects();
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
        <Button variant="outline" onClick={() => setSelectedProject(null)}>
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад к проектам
        </Button>
        <ProjectAccessManager project={selectedProject} />
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
        {projects.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="FolderOpen" size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Нет проектов</p>
          </Card>
        ) : (
          projects.map((project) => {
            const entities = getLegalEntitiesByProject(project.id);
            
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

                    {entities.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          <Icon name="Building2" size={14} className="inline mr-1" />
                          Юридические лица ({entities.length}):
                        </p>
                        <div className="space-y-1">
                          {entities.map((entity) => (
                            <div key={entity.id} className="text-sm text-gray-600 pl-5">
                              • {entity.name} <span className="text-gray-400">(ИНН: {entity.inn})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedProject(project)}
                      title="Управление доступами"
                    >
                      <Icon name="Users" size={16} />
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
