import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface LegalEntity {
  id: number;
  name: string;
  inn: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  budget: number | null;
  legalEntityId: number | null;
  legalEntityName: string | null;
}

export default function ProjectManager() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [legalEntities, setLegalEntities] = useState<LegalEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'active',
    startDate: '',
    endDate: '',
    budget: '',
    legalEntityId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const projectsResp = await fetch('https://functions.poehali.dev/TODO_PROJECT_LIST_URL');
      const entitiesResp = await fetch('https://functions.poehali.dev/TODO_LEGAL_ENTITY_LIST_URL');
      
      if (projectsResp.ok) {
        const data = await projectsResp.json();
        setProjects(data.projects || []);
      }
      
      if (entitiesResp.ok) {
        const data = await entitiesResp.json();
        setLegalEntities(data.entities || []);
      }
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

  const handleAddProject = async () => {
    if (!newProject.title) {
      toast({
        title: 'Ошибка',
        description: 'Заполните название проекта',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'В разработке',
      description: 'Функция добавления проектов будет доступна после создания backend API'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader" size={48} className="animate-spin text-orange-600" />
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
                onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
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

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="FolderOpen" size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Нет проектов</p>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                  )}
                  {project.legalEntityName && (
                    <p className="text-sm text-gray-600">
                      <Icon name="Building2" size={14} className="inline mr-1" />
                      {project.legalEntityName}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
