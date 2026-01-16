import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { getProjects, type Project } from '@/lib/project-manager';
import {
  getTitlePagesByProject,
  createTitlePage,
  updateTitlePage,
  deleteTitlePage,
  type TitlePage
} from '@/lib/title-page-manager';
import TitlePagePreview from './TitlePagePreview';

export default function TitlePageEditor() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [titlePages, setTitlePages] = useState<TitlePage[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [editingPage, setEditingPage] = useState<TitlePage | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPage, setPreviewPage] = useState<TitlePage | null>(null);

  const [formData, setFormData] = useState({
    documentTitle: 'ИСПОЛНИТЕЛЬНАЯ ДОКУМЕНТАЦИЯ',
    city: '',
    address: '',
    year: new Date().getFullYear().toString(),
    approvedBy: '',
    approvedDate: new Date().toISOString().split('T')[0],
    developerName: '',
    developerPosition: 'Производитель работ',
    chiefEngineerName: '',
    chiefEngineerPosition: 'Главный инженер'
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadTitlePages();
    }
  }, [selectedProjectId]);

  const loadData = () => {
    setProjects(getProjects());
  };

  const loadTitlePages = () => {
    if (selectedProjectId) {
      setTitlePages(getTitlePagesByProject(selectedProjectId));
    }
  };

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    setEditingPage(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      documentTitle: 'ИСПОЛНИТЕЛЬНАЯ ДОКУМЕНТАЦИЯ',
      city: '',
      address: '',
      year: new Date().getFullYear().toString(),
      approvedBy: '',
      approvedDate: new Date().toISOString().split('T')[0],
      developerName: '',
      developerPosition: 'Производитель работ',
      chiefEngineerName: '',
      chiefEngineerPosition: 'Главный инженер'
    });
  };

  const handleCreate = () => {
    if (!selectedProjectId) {
      toast({
        title: 'Ошибка',
        description: 'Выберите проект',
        variant: 'destructive'
      });
      return;
    }

    const newPage = createTitlePage({
      projectId: selectedProjectId,
      ...formData
    });

    loadTitlePages();
    resetForm();
    
    toast({
      title: 'Успех',
      description: 'Титульный лист создан'
    });
  };

  const handleUpdate = () => {
    if (!editingPage) return;

    updateTitlePage(editingPage.id, formData);
    loadTitlePages();
    setEditingPage(null);
    resetForm();
    
    toast({
      title: 'Успех',
      description: 'Титульный лист обновлен'
    });
  };

  const handleEdit = (page: TitlePage) => {
    setEditingPage(page);
    setFormData({
      documentTitle: page.documentTitle,
      city: page.city,
      address: page.address,
      year: page.year,
      approvedBy: page.approvedBy,
      approvedDate: page.approvedDate,
      developerName: page.developerName,
      developerPosition: page.developerPosition,
      chiefEngineerName: page.chiefEngineerName,
      chiefEngineerPosition: page.chiefEngineerPosition
    });
  };

  const handleDelete = (pageId: string) => {
    if (confirm('Удалить титульный лист?')) {
      deleteTitlePage(pageId);
      loadTitlePages();
      toast({
        title: 'Успех',
        description: 'Титульный лист удален'
      });
    }
  };

  const handlePreview = (page: TitlePage) => {
    setPreviewPage(page);
    setShowPreview(true);
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.title : '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Титульные листы исполнительной документации</h2>
      </div>

      <Card className="p-4">
        <label className="block text-sm font-medium mb-2">
          <Icon name="FolderOpen" size={14} className="inline mr-1" />
          Выберите проект
        </label>
        <select
          value={selectedProjectId}
          onChange={(e) => handleProjectChange(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">Не выбран</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </Card>

      {selectedProjectId && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingPage ? 'Редактировать титульный лист' : 'Создать титульный лист'}
          </h3>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Название документа</label>
              <Input
                value={formData.documentTitle}
                onChange={(e) => setFormData({ ...formData, documentTitle: e.target.value })}
                placeholder="ИСПОЛНИТЕЛЬНАЯ ДОКУМЕНТАЦИЯ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Город</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Москва"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Год</label>
              <Input
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2024"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Адрес объекта</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="ул. Примерная, д. 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Утверждено (кем)</label>
              <Input
                value={formData.approvedBy}
                onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                placeholder="Директор ООО Компания"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Дата утверждения</label>
              <Input
                type="date"
                value={formData.approvedDate}
                onChange={(e) => setFormData({ ...formData, approvedDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Производитель работ (ФИО)</label>
              <Input
                value={formData.developerName}
                onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                placeholder="Иванов И.И."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Должность производителя</label>
              <Input
                value={formData.developerPosition}
                onChange={(e) => setFormData({ ...formData, developerPosition: e.target.value })}
                placeholder="Производитель работ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Главный инженер (ФИО)</label>
              <Input
                value={formData.chiefEngineerName}
                onChange={(e) => setFormData({ ...formData, chiefEngineerName: e.target.value })}
                placeholder="Петров П.П."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Должность главного инженера</label>
              <Input
                value={formData.chiefEngineerPosition}
                onChange={(e) => setFormData({ ...formData, chiefEngineerPosition: e.target.value })}
                placeholder="Главный инженер"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {editingPage ? (
              <>
                <Button onClick={handleUpdate}>
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить
                </Button>
                <Button variant="outline" onClick={() => {
                  setEditingPage(null);
                  resetForm();
                }}>
                  Отмена
                </Button>
              </>
            ) : (
              <Button onClick={handleCreate}>
                <Icon name="Plus" size={16} className="mr-2" />
                Создать
              </Button>
            )}
          </div>
        </Card>
      )}

      {selectedProjectId && titlePages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Созданные титульные листы</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {titlePages.map(page => (
              <Card key={page.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{page.documentTitle}</h4>
                    <p className="text-xs text-gray-600">
                      {getProjectName(page.projectId)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreview(page)}
                      title="Просмотр и печать"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(page)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(page.id)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <div><span className="text-gray-500">Город:</span> {page.city}</div>
                  <div><span className="text-gray-500">Адрес:</span> {page.address}</div>
                  <div><span className="text-gray-500">Год:</span> {page.year}</div>
                </div>

                <div className="text-xs text-gray-400 mt-3">
                  Создан: {new Date(page.createdAt).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {showPreview && previewPage && (
        <TitlePagePreview
          page={previewPage}
          projectName={getProjectName(previewPage.projectId)}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
