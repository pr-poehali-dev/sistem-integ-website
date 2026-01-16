import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { Project } from '@/lib/project-manager';
import { getLegalEntityById } from '@/lib/project-manager';
import ProjectAccessManager from '../ProjectAccessManager';
import SystemManager from '../SystemManager';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export default function ProjectDetail({
  project,
  onBack,
  getStatusColor,
  getStatusLabel
}: ProjectDetailProps) {
  const [projectTab, setProjectTab] = useState<'info' | 'access' | 'systems'>('info');

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack}>
        <Icon name="ArrowLeft" size={16} className="mr-2" />
        Назад к проектам
      </Button>

      <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Icon name="FolderOpen" size={24} className="text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">{project.title}</h3>
            {project.description && (
              <p className="text-sm text-gray-600">{project.description}</p>
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
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {getStatusLabel(project.status)}
              </span>
            </div>
            {project.startDate && (
              <div>
                <span className="text-sm font-medium text-gray-500">Дата начала:</span>
                <span className="ml-2">{new Date(project.startDate).toLocaleDateString()}</span>
              </div>
            )}
            {project.endDate && (
              <div>
                <span className="text-sm font-medium text-gray-500">Дата окончания:</span>
                <span className="ml-2">{new Date(project.endDate).toLocaleDateString()}</span>
              </div>
            )}
            {project.budget && (
              <div>
                <span className="text-sm font-medium text-gray-500">Бюджет:</span>
                <span className="ml-2">{project.budget.toLocaleString()} ₽</span>
              </div>
            )}
            {project.legalEntityId && (() => {
              const entity = getLegalEntityById(project.legalEntityId);
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
        <SystemManager project={project} />
      )}

      {projectTab === 'access' && (
        <ProjectAccessManager project={project} />
      )}
    </div>
  );
}
