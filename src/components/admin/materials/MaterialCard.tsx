import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { type Material } from '@/lib/material-manager';

interface MaterialCardProps {
  material: Material;
  unitName: string;
  onEdit: (material: Material) => void;
  onDelete: (materialId: string) => void;
  getTypeLabel: (type: string) => string;
  getTypeColor: (type: string) => string;
  getTypeIcon: (type: string) => string;
}

export default function MaterialCard({
  material,
  unitName,
  onEdit,
  onDelete,
  getTypeLabel,
  getTypeColor,
  getTypeIcon
}: MaterialCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
            <Icon name={getTypeIcon(material.type)} size={14} className="inline mr-1" />
            {getTypeLabel(material.type)}
          </span>
          <span className="text-sm text-gray-500">Код: {material.code}</span>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(material)}
          >
            <Icon name="Edit" size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(material.id)}
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">{material.name}</h3>

      {material.articleNumber && (
        <div className="text-sm text-gray-600 mb-2">
          <Icon name="Hash" size={14} className="inline mr-1" />
          Артикул: {material.articleNumber}
        </div>
      )}

      {material.description && (
        <p className="text-sm text-gray-600 mb-2">{material.description}</p>
      )}

      <div className="grid grid-cols-2 gap-2 text-sm">
        {unitName && (
          <div>
            <span className="text-gray-500">Ед. изм.:</span>
            <span className="ml-1 font-medium">{unitName}</span>
          </div>
        )}

        {material.price && (
          <div>
            <span className="text-gray-500">Цена:</span>
            <span className="ml-1 font-medium text-green-600">
              {material.price.toLocaleString()} ₽
            </span>
          </div>
        )}

        {material.manufacturer && (
          <div className="col-span-2">
            <span className="text-gray-500">Производитель:</span>
            <span className="ml-1 font-medium">{material.manufacturer}</span>
          </div>
        )}

        {material.notes && (
          <div className="col-span-2">
            <span className="text-gray-500">Примечания:</span>
            <p className="text-xs text-gray-600 mt-1">{material.notes}</p>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 mt-3">
        Создан: {new Date(material.createdAt).toLocaleDateString()}
      </div>
    </Card>
  );
}
