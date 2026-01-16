import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import type { Project, LegalEntity } from '@/lib/project-manager';

interface ProjectFormProps {
  mode: 'add' | 'edit';
  project: {
    title: string;
    description: string;
    status: 'active' | 'pending' | 'completed' | 'cancelled';
    startDate: string;
    endDate: string;
    budget: string;
    legalEntityId: string;
  } | Project;
  legalEntities: LegalEntity[];
  onSubmit: () => void;
  onCancel: () => void;
  onChange: (updates: Partial<typeof project>) => void;
}

export default function ProjectForm({
  mode,
  project,
  legalEntities,
  onSubmit,
  onCancel,
  onChange
}: ProjectFormProps) {
  return (
    <Card className={`p-6 space-y-4 ${mode === 'edit' ? 'border-2 border-orange-500/30' : 'border-2 border-primary/20'}`}>
      <h3 className="font-semibold">
        {mode === 'add' ? 'Новый проект' : 'Редактирование проекта'}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2">Название проекта *</label>
          <Input
            value={project.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Название проекта"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2">Описание</label>
          <textarea
            value={project.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Описание проекта"
            className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[100px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Статус</label>
          <select
            value={project.status}
            onChange={(e) => onChange({ status: e.target.value as 'active' | 'pending' | 'completed' | 'cancelled' })}
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
            value={'legalEntityId' in project ? (project.legalEntityId || '') : project.legalEntityId}
            onChange={(e) => onChange({ legalEntityId: e.target.value })}
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
            value={'startDate' in project && project.startDate ? project.startDate : ''}
            onChange={(e) => onChange({ startDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Дата окончания</label>
          <Input
            type="date"
            value={'endDate' in project && project.endDate ? project.endDate : ''}
            onChange={(e) => onChange({ endDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Бюджет (₽)</label>
          <Input
            type="number"
            value={typeof project.budget === 'number' ? project.budget : project.budget}
            onChange={(e) => onChange({ budget: e.target.value })}
            placeholder="0.00"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onSubmit}>
          <Icon name="Check" size={16} className="mr-2" />
          {mode === 'add' ? 'Создать' : 'Сохранить'}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </Card>
  );
}
