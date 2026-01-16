export interface TitlePageTemplate {
  id: string;
  name: string;
  description: string;
  documentTitle: string;
  city: string;
  year: string;
  approvedBy: string;
  developerPosition: string;
  chiefEngineerPosition: string;
  isDefault: boolean;
  createdAt: number;
}

const TEMPLATES_KEY = 'title_page_templates';

export function getTemplates(): TitlePageTemplate[] {
  const stored = localStorage.getItem(TEMPLATES_KEY);
  return stored ? JSON.parse(stored) : getDefaultTemplates();
}

function saveTemplates(templates: TitlePageTemplate[]) {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

function getDefaultTemplates(): TitlePageTemplate[] {
  const defaults: TitlePageTemplate[] = [
    {
      id: 'template_default_1',
      name: 'Стандартный',
      description: 'Базовый шаблон исполнительной документации',
      documentTitle: 'ИСПОЛНИТЕЛЬНАЯ ДОКУМЕНТАЦИЯ',
      city: '',
      year: new Date().getFullYear().toString(),
      approvedBy: '',
      developerPosition: 'Производитель работ',
      chiefEngineerPosition: 'Главный инженер',
      isDefault: true,
      createdAt: Date.now()
    },
    {
      id: 'template_default_2',
      name: 'Строительство',
      description: 'Для строительных проектов',
      documentTitle: 'ИСПОЛНИТЕЛЬНАЯ ДОКУМЕНТАЦИЯ\nСТРОИТЕЛЬНЫХ РАБОТ',
      city: '',
      year: new Date().getFullYear().toString(),
      approvedBy: 'Главный инженер проекта',
      developerPosition: 'Производитель работ',
      chiefEngineerPosition: 'Главный инженер строительства',
      isDefault: true,
      createdAt: Date.now()
    },
    {
      id: 'template_default_3',
      name: 'Монтажные работы',
      description: 'Для монтажных и пусконаладочных работ',
      documentTitle: 'ИСПОЛНИТЕЛЬНАЯ ДОКУМЕНТАЦИЯ\nМОНТАЖНЫХ И ПУСКОНАЛАДОЧНЫХ РАБОТ',
      city: '',
      year: new Date().getFullYear().toString(),
      approvedBy: 'Технический директор',
      developerPosition: 'Начальник участка',
      chiefEngineerPosition: 'Главный инженер',
      isDefault: true,
      createdAt: Date.now()
    }
  ];
  
  saveTemplates(defaults);
  return defaults;
}

export function createTemplate(data: Omit<TitlePageTemplate, 'id' | 'createdAt' | 'isDefault'>): TitlePageTemplate {
  const templates = getTemplates();
  const newTemplate: TitlePageTemplate = {
    ...data,
    id: 'template_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    isDefault: false,
    createdAt: Date.now()
  };
  templates.push(newTemplate);
  saveTemplates(templates);
  return newTemplate;
}

export function updateTemplate(templateId: string, updates: Partial<Omit<TitlePageTemplate, 'id' | 'createdAt' | 'isDefault'>>): boolean {
  const templates = getTemplates();
  const index = templates.findIndex(t => t.id === templateId);
  
  if (index === -1) return false;
  if (templates[index].isDefault) return false; // Нельзя редактировать дефолтные
  
  templates[index] = { ...templates[index], ...updates };
  saveTemplates(templates);
  return true;
}

export function deleteTemplate(templateId: string): boolean {
  const templates = getTemplates();
  const template = templates.find(t => t.id === templateId);
  
  if (!template || template.isDefault) return false; // Нельзя удалять дефолтные
  
  const filtered = templates.filter(t => t.id !== templateId);
  saveTemplates(filtered);
  return true;
}

export function getTemplateById(templateId: string | null): TitlePageTemplate | null {
  if (!templateId) return null;
  return getTemplates().find(t => t.id === templateId) || null;
}

export function duplicateTemplate(templateId: string, newName: string): TitlePageTemplate | null {
  const template = getTemplateById(templateId);
  if (!template) return null;
  
  return createTemplate({
    name: newName,
    description: template.description,
    documentTitle: template.documentTitle,
    city: template.city,
    year: new Date().getFullYear().toString(),
    approvedBy: template.approvedBy,
    developerPosition: template.developerPosition,
    chiefEngineerPosition: template.chiefEngineerPosition
  });
}
