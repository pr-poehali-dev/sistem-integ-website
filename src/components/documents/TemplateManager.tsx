import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate,
  type TitlePageTemplate
} from '@/lib/title-page-template-manager';

interface TemplateManagerProps {
  onSelectTemplate: (template: TitlePageTemplate) => void;
  onClose: () => void;
}

export default function TemplateManager({ onSelectTemplate, onClose }: TemplateManagerProps) {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<TitlePageTemplate[]>([]);
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TitlePageTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    documentTitle: 'ИСПОЛНИТЕЛЬНАЯ ДОКУМЕНТАЦИЯ',
    city: '',
    year: new Date().getFullYear().toString(),
    approvedBy: '',
    developerPosition: 'Производитель работ',
    chiefEngineerPosition: 'Главный инженер'
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    setTemplates(getTemplates());
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      documentTitle: 'ИСПОЛНИТЕЛЬНАЯ ДОКУМЕНТАЦИЯ',
      city: '',
      year: new Date().getFullYear().toString(),
      approvedBy: '',
      developerPosition: 'Производитель работ',
      chiefEngineerPosition: 'Главный инженер'
    });
  };

  const handleCreate = () => {
    if (!formData.name) {
      toast({
        title: 'Ошибка',
        description: 'Укажите название шаблона',
        variant: 'destructive'
      });
      return;
    }

    createTemplate(formData);
    loadTemplates();
    resetForm();
    setShowAddTemplate(false);
    
    toast({
      title: 'Успех',
      description: 'Шаблон создан'
    });
  };

  const handleUpdate = () => {
    if (!editingTemplate) return;

    updateTemplate(editingTemplate.id, formData);
    loadTemplates();
    setEditingTemplate(null);
    resetForm();
    
    toast({
      title: 'Успех',
      description: 'Шаблон обновлен'
    });
  };

  const handleEdit = (template: TitlePageTemplate) => {
    if (template.isDefault) {
      toast({
        title: 'Внимание',
        description: 'Системные шаблоны нельзя редактировать. Создайте копию.',
        variant: 'destructive'
      });
      return;
    }

    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      documentTitle: template.documentTitle,
      city: template.city,
      year: template.year,
      approvedBy: template.approvedBy,
      developerPosition: template.developerPosition,
      chiefEngineerPosition: template.chiefEngineerPosition
    });
    setShowAddTemplate(false);
  };

  const handleDelete = (templateId: string) => {
    if (confirm('Удалить шаблон?')) {
      const success = deleteTemplate(templateId);
      if (success) {
        loadTemplates();
        toast({
          title: 'Успех',
          description: 'Шаблон удален'
        });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Системные шаблоны нельзя удалять',
          variant: 'destructive'
        });
      }
    }
  };

  const handleDuplicate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const newName = prompt('Введите название нового шаблона:', `${template.name} (копия)`);
    if (!newName) return;

    const newTemplate = duplicateTemplate(templateId, newName);
    if (newTemplate) {
      loadTemplates();
      toast({
        title: 'Успех',
        description: 'Копия шаблона создана'
      });
    }
  };

  const handleSelect = (template: TitlePageTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  const filteredTemplates = templates.filter(template => {
    const searchLower = searchQuery.toLowerCase();
    return template.name.toLowerCase().includes(searchLower) ||
           template.description.toLowerCase().includes(searchLower) ||
           template.documentTitle.toLowerCase().includes(searchLower);
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
      <Card className="w-full max-w-6xl bg-white max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <h3 className="text-lg font-semibold">Управление шаблонами</h3>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddTemplate(!showAddTemplate)} variant="default">
              <Icon name="Plus" size={16} className="mr-2" />
              Создать шаблон
            </Button>
            <Button onClick={onClose} variant="outline">
              <Icon name="X" size={16} className="mr-2" />
              Закрыть
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              <Icon name="Search" size={14} className="inline mr-1" />
              Поиск шаблонов
            </label>
            <Input
              placeholder="Поиск по названию, описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {(showAddTemplate || editingTemplate) && (
            <Card className="p-6 bg-gray-50">
              <h4 className="text-md font-semibold mb-4">
                {editingTemplate ? 'Редактировать шаблон' : 'Создать новый шаблон'}
              </h4>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Название шаблона *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Мой шаблон"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Краткое описание"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Название документа</label>
                  <Input
                    value={formData.documentTitle}
                    onChange={(e) => setFormData({ ...formData, documentTitle: e.target.value })}
                    placeholder="ИСПОЛНИТЕЛЬНАЯ ДОКУМЕНТАЦИЯ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Город по умолчанию</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Москва"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Год по умолчанию</label>
                  <Input
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Утверждено (по умолчанию)</label>
                  <Input
                    value={formData.approvedBy}
                    onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                    placeholder="Директор"
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
                  <label className="block text-sm font-medium mb-2">Должность главного инженера</label>
                  <Input
                    value={formData.chiefEngineerPosition}
                    onChange={(e) => setFormData({ ...formData, chiefEngineerPosition: e.target.value })}
                    placeholder="Главный инженер"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {editingTemplate ? (
                  <>
                    <Button onClick={handleUpdate}>
                      <Icon name="Save" size={16} className="mr-2" />
                      Сохранить
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setEditingTemplate(null);
                      resetForm();
                    }}>
                      Отмена
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleCreate}>
                      <Icon name="Plus" size={16} className="mr-2" />
                      Создать
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setShowAddTemplate(false);
                      resetForm();
                    }}>
                      Отмена
                    </Button>
                  </>
                )}
              </div>
            </Card>
          )}

          <div>
            <h4 className="text-md font-semibold mb-3">Доступные шаблоны</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <Card key={template.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold text-sm truncate">{template.name}</h5>
                        {template.isDefault && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                            Системный
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 mb-3 text-gray-600">
                    <div className="line-clamp-2">{template.documentTitle}</div>
                    {template.city && <div>Город: {template.city}</div>}
                    <div>Год: {template.year}</div>
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    <Button
                      size="sm"
                      onClick={() => handleSelect(template)}
                      className="flex-1"
                    >
                      <Icon name="Check" size={14} className="mr-1" />
                      Применить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDuplicate(template.id)}
                      title="Создать копию"
                    >
                      <Icon name="Copy" size={14} />
                    </Button>
                    {!template.isDefault && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(template)}
                          title="Редактировать"
                        >
                          <Icon name="Edit" size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(template.id)}
                          title="Удалить"
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </>
                    )}
                  </div>

                  {!template.isDefault && (
                    <div className="text-xs text-gray-400 mt-2">
                      Создан: {new Date(template.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {filteredTemplates.length === 0 && (
            <Card className="p-8 text-center text-gray-500">
              <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Шаблоны не найдены</p>
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
}
