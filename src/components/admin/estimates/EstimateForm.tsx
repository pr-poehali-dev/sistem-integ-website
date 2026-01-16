import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import type { Project } from '@/lib/project-manager';

interface EstimateFormData {
  number: string;
  name: string;
  projectId: string | null;
  date: number;
}

interface EstimateFormProps {
  data: EstimateFormData;
  projects: Project[];
  onDataChange: (data: EstimateFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  title: string;
}

export default function EstimateForm({
  data,
  projects,
  onDataChange,
  onSubmit,
  onCancel,
  title
}: EstimateFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Номер сметы *</label>
            <Input
              value={data.number}
              onChange={(e) => onDataChange({ ...data, number: e.target.value })}
              placeholder="Номер"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Дата</label>
            <Input
              type="date"
              value={new Date(data.date).toISOString().split('T')[0]}
              onChange={(e) => onDataChange({ ...data, date: new Date(e.target.value).getTime() })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Название сметы *</label>
          <Input
            value={data.name}
            onChange={(e) => onDataChange({ ...data, name: e.target.value })}
            placeholder="Название"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Проект</label>
          <select
            value={data.projectId || ''}
            onChange={(e) => onDataChange({ ...data, projectId: e.target.value || null })}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Не выбран</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button onClick={onSubmit}>
            <Icon name="Check" size={16} className="mr-2" />
            {title === 'Новая смета' ? 'Создать' : 'Сохранить'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <Icon name="X" size={16} className="mr-2" />
            Отмена
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
