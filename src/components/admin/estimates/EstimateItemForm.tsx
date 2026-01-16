import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { calculateItemTotal } from '@/lib/estimate-manager';
import type { Material } from '@/lib/material-manager';
import type { Unit } from '@/lib/unit-manager';

interface ItemFormData {
  number: number;
  code: string;
  name: string;
  unitId: string | null;
  quantity: number;
  price: number | null;
  notes: string;
}

interface EstimateItemFormProps {
  data: ItemFormData;
  materials: Material[];
  units: Unit[];
  selectedMaterialId: string;
  onDataChange: (data: ItemFormData) => void;
  onSelectMaterial: (materialId: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function EstimateItemForm({
  data,
  materials,
  units,
  selectedMaterialId,
  onDataChange,
  onSelectMaterial,
  onSubmit,
  onCancel
}: EstimateItemFormProps) {
  return (
    <Card className="p-4 mb-4 bg-muted">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">Выбрать из справочника</label>
          <select
            value={selectedMaterialId}
            onChange={(e) => onSelectMaterial(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Выбрать материал/оборудование</option>
            {materials.map(material => (
              <option key={material.id} value={material.id}>
                {material.code} - {material.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2">№</label>
            <Input
              type="number"
              value={data.number}
              onChange={(e) => onDataChange({ ...data, number: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Код</label>
            <Input
              value={data.code}
              onChange={(e) => onDataChange({ ...data, code: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Кол-во</label>
            <Input
              type="number"
              step="0.01"
              value={data.quantity}
              onChange={(e) => onDataChange({ ...data, quantity: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Цена</label>
            <Input
              type="number"
              step="0.01"
              value={data.price || ''}
              onChange={(e) => onDataChange({ ...data, price: parseFloat(e.target.value) || null })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Наименование *</label>
          <Input
            value={data.name}
            onChange={(e) => onDataChange({ ...data, name: e.target.value })}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2">Единица измерения</label>
            <select
              value={data.unitId || ''}
              onChange={(e) => onDataChange({ ...data, unitId: e.target.value || null })}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Не выбрана</option>
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Итого</label>
            <Input
              value={calculateItemTotal(data.price, data.quantity)?.toFixed(2) || '0.00'}
              readOnly
              className="bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Примечание</label>
          <Input
            value={data.notes}
            onChange={(e) => onDataChange({ ...data, notes: e.target.value })}
          />
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={onSubmit}>
            <Icon name="Check" size={14} className="mr-2" />
            Добавить
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            <Icon name="X" size={14} className="mr-2" />
            Отмена
          </Button>
        </div>
      </div>
    </Card>
  );
}
