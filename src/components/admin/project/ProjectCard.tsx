import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { Project, LegalEntity } from '@/lib/project-manager';

interface ProjectCardProps {
  project: Project;
  legalEntity: LegalEntity | null;
  onOpen: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export default function ProjectCard({
  project,
  legalEntity,
  onOpen,
  onEdit,
  onDelete,
  getStatusColor,
  getStatusLabel
}: ProjectCardProps) {
  return (
    <Card className="p-6">
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
            onClick={() => onOpen(project)}
            title="Открыть проект"
          >
            <Icon name="FolderOpen" size={16} className="mr-1" />
            Открыть
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(project)}
          >
            <Icon name="Edit" size={16} />
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onDelete(project.id)}
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
