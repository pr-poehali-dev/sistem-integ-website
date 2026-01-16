import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import TitlePageGenerator from './TitlePageGenerator';
import { getProjects, getSystems, type Project, type System } from '@/lib/project-manager';
import { 
  getExecutionDocuments, 
  createExecutionDocument, 
  deleteExecutionDocument,
  type ExecutionDocument 
} from '@/lib/execution-docs-manager';
import { getCurrentUser } from '@/lib/user-manager';

export default function ExecutionDocsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<ExecutionDocument[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProjects(getProjects());
    setDocuments(getExecutionDocuments());
  };

  const currentUser = getCurrentUser();
  const systems = selectedProject ? getSystems().filter(s => s.projectId === selectedProject) : [];
  
  const project = projects.find(p => p.id === selectedProject);
  const system = systems.find(s => s.id === selectedSystem);

  const handleCreateDocument = () => {
    if (!selectedProject || !selectedSystem || !currentUser) return;
    
    createExecutionDocument(selectedProject, selectedSystem, 'title-page', currentUser.id);
    loadData();
    setShowGenerator(true);
  };

  const handleDeleteDocument = (docId: string) => {
    if (confirm('Удалить документ?')) {
      deleteExecutionDocument(docId);
      loadData();
    }
  };

  const projectDocs = selectedProject 
    ? documents.filter(d => d.projectId === selectedProject)
    : documents;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Исполнительная документация</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Проект</label>
            <select
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setSelectedSystem('');
              }}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Выберите проект</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          {selectedProject && systems.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Система</label>
              <select
                value={selectedSystem}
                onChange={(e) => setSelectedSystem(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Выберите систему</option>
                {systems.map(system => (
                  <option key={system.id} value={system.id}>
                    {system.name} - {system.type}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedProject && systems.length === 0 && (
            <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
              В выбранном проекте нет систем. Создайте систему в разделе "Проекты".
            </div>
          )}

          {selectedProject && selectedSystem && (
            <Button onClick={handleCreateDocument} className="w-full">
              <Icon name="FileText" size={16} className="mr-2" />
              Создать титульный лист
            </Button>
          )}
        </div>
      </Card>

      {projectDocs.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Созданные документы</h3>
          <div className="space-y-3">
            {projectDocs.map(doc => {
              const docProject = projects.find(p => p.id === doc.projectId);
              const docSystem = getSystems().find(s => s.id === doc.systemId);
              
              return (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{docProject?.title}</div>
                    <div className="text-sm text-muted-foreground">{docSystem?.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Создан: {new Date(doc.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Титульный лист</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedProject(doc.projectId);
                        setSelectedSystem(doc.systemId);
                        setShowGenerator(true);
                      }}
                    >
                      <Icon name="Eye" size={14} className="mr-1" />
                      Просмотр
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {showGenerator && project && system && (
        <TitlePageGenerator
          project={project}
          system={system}
          onClose={() => setShowGenerator(false)}
        />
      )}
    </div>
  );
}
