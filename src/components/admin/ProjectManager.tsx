import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import ProjectForm from './project/ProjectForm';
import ProjectDetail from './project/ProjectDetail';
import ProjectListFilters from './project/ProjectListFilters';
import ProjectCard from './project/ProjectCard';

export default function ProjectManager() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [legalEntities, setLegalEntities] = useState<LegalEntity[]>([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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
      <ProjectDetail
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
      />
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

      <ProjectListFilters
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        resultsCount={filteredProjects.length}
        onSearchChange={setSearchQuery}
        onFilterChange={setFilterStatus}
        onReset={() => {
          setSearchQuery('');
          setFilterStatus('all');
        }}
      />

      {showAddProject && (
        <ProjectForm
          mode="add"
          project={newProject}
          legalEntities={legalEntities}
          onSubmit={handleAddProject}
          onCancel={() => setShowAddProject(false)}
          onChange={(updates) => setNewProject({ ...newProject, ...updates })}
        />
      )}

      {editingProject && (
        <ProjectForm
          mode="edit"
          project={editingProject}
          legalEntities={legalEntities}
          onSubmit={handleUpdateProject}
          onCancel={() => setEditingProject(null)}
          onChange={(updates) => setEditingProject({ ...editingProject, ...updates })}
        />
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
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              legalEntity={getLegalEntityById(project.legalEntityId)}
              onOpen={setSelectedProject}
              onEdit={setEditingProject}
              onDelete={handleDeleteProject}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          ))
        )}
      </div>
    </div>
  );
}
