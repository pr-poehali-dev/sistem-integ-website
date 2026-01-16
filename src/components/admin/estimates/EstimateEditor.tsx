import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import type { Estimate, EstimateItem } from '@/lib/estimate-manager';
import type { Project } from '@/lib/project-manager';
import type { Unit } from '@/lib/unit-manager';
import type { Material } from '@/lib/material-manager';
import EstimateItemForm from './EstimateItemForm';

interface ItemFormData {
  number: number;
  code: string;
  name: string;
  unitId: string | null;
  quantity: number;
  price: number | null;
  notes: string;
}

interface EstimateEditorProps {
  estimate: Estimate;
  projects: Project[];
  units: Unit[];
  materials: Material[];
  showAddItem: boolean;
  newItem: ItemFormData;
  selectedMaterialId: string;
  onEstimateChange: (estimate: Estimate) => void;
  onNewItemChange: (item: ItemFormData) => void;
  onSelectMaterial: (materialId: string) => void;
  onAddItem: () => void;
  onDeleteItem: (itemId: string) => void;
  onSetShowAddItem: (show: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  getUnitName: (unitId: string | null) => string;
}

export default function EstimateEditor({
  estimate,
  projects,
  units,
  materials,
  showAddItem,
  newItem,
  selectedMaterialId,
  onEstimateChange,
  onNewItemChange,
  onSelectMaterial,
  onAddItem,
  onDeleteItem,
  onSetShowAddItem,
  onSave,
  onCancel,
  getUnitName
}: EstimateEditorProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Редактирование сметы: {estimate.number}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <Icon name="X" size={20} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Номер сметы *</label>
            <Input
              value={estimate.number}
              onChange={(e) => onEstimateChange({ ...estimate, number: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Дата</label>
            <Input
              type="date"
              value={new Date(estimate.date).toISOString().split('T')[0]}
              onChange={(e) => onEstimateChange({ ...estimate, date: new Date(e.target.value).getTime() })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Название сметы *</label>
          <Input
            value={estimate.name}
            onChange={(e) => onEstimateChange({ ...estimate, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Проект</label>
          <select
            value={estimate.projectId || ''}
            onChange={(e) => onEstimateChange({ ...estimate, projectId: e.target.value || null })}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Не выбран</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Позиции сметы</h3>
            <Button size="sm" onClick={() => onSetShowAddItem(true)}>
              <Icon name="Plus" size={14} className="mr-2" />
              Добавить позицию
            </Button>
          </div>

          {showAddItem && (
            <EstimateItemForm
              data={newItem}
              materials={materials}
              units={units}
              selectedMaterialId={selectedMaterialId}
              onDataChange={onNewItemChange}
              onSelectMaterial={onSelectMaterial}
              onSubmit={onAddItem}
              onCancel={() => onSetShowAddItem(false)}
            />
          )}

          {estimate.items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <Icon name="FileText" size={48} className="mx-auto mb-2 opacity-20" />
              <p>Нет позиций в смете</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">№</th>
                    <th className="text-left p-2">Код</th>
                    <th className="text-left p-2">Наименование</th>
                    <th className="text-left p-2">Ед.изм.</th>
                    <th className="text-right p-2">Кол-во</th>
                    <th className="text-right p-2">Цена</th>
                    <th className="text-right p-2">Сумма</th>
                    <th className="text-center p-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {estimate.items.map(item => (
                    <tr key={item.id} className="border-b hover:bg-muted">
                      <td className="p-2">{item.number}</td>
                      <td className="p-2 font-mono text-xs">{item.code}</td>
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{getUnitName(item.unitId)}</td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">{item.price?.toLocaleString() || '-'}</td>
                      <td className="p-2 text-right font-semibold">{item.totalCost?.toLocaleString() || '-'}</td>
                      <td className="p-2 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteItem(item.id)}
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted font-semibold">
                    <td colSpan={6} className="p-2 text-right">Итого:</td>
                    <td className="p-2 text-right">{estimate.items.reduce((sum, item) => sum + (item.totalCost || 0), 0).toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={onSave}>
            <Icon name="Check" size={16} className="mr-2" />
            Сохранить
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
