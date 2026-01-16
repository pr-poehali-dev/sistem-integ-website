import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  getUnits,
  createUnit,
  updateUnit,
  deleteUnit,
  type Unit
} from '@/lib/unit-manager';

export default function UnitManager() {
  const { toast } = useToast();
  const [units, setUnits] = useState<Unit[]>([]);
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newUnit, setNewUnit] = useState({
    code: '',
    name: '',
    fullName: '',
    type: 'piece' as const
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUnits(getUnits());
  };

  const filteredUnits = units.filter((unit) => {
    const matchesType = filterType === 'all' || unit.type === filterType;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = unit.code.toLowerCase().includes(searchLower) ||
                         unit.name.toLowerCase().includes(searchLower) ||
                         unit.fullName.toLowerCase().includes(searchLower);
    return matchesType && matchesSearch;
  });

  const handleAddUnit = () => {
    if (!newUnit.code || !newUnit.name) {
      toast({
        title: 'Ошибка',
        description: 'Заполните код и название',
        variant: 'destructive'
      });
      return;
    }

    createUnit(newUnit);
    setNewUnit({
      code: '',
      name: '',
      fullName: '',
      type: 'piece'
    });
    setShowAddUnit(false);
    loadData();
    
    toast({
      title: 'Успех',
      description: 'Единица измерения создана'
    });
  };

  const handleUpdateUnit = () => {
    if (!editingUnit) return;

    updateUnit(editingUnit.id, {
      code: editingUnit.code,
      name: editingUnit.name,
      fullName: editingUnit.fullName,
      type: editingUnit.type
    });

    setEditingUnit(null);
    loadData();
    
    toast({
      title: 'Успех',
      description: 'Единица измерения обновлена'
    });
  };

  const handleDeleteUnit = (unitId: string) => {
    if (confirm('Удалить единицу измерения?')) {
      deleteUnit(unitId);
      loadData();
      toast({
        title: 'Успех',
        description: 'Единица измерения удалена'
      });
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      weight: 'Вес',
      length: 'Длина',
      volume: 'Объем',
      area: 'Площадь',
      time: 'Время',
      piece: 'Штуки',
      other: 'Другое'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      weight: 'bg-blue-50 text-blue-600',
      length: 'bg-green-50 text-green-600',
      volume: 'bg-purple-50 text-purple-600',
      area: 'bg-yellow-50 text-yellow-600',
      time: 'bg-red-50 text-red-600',
      piece: 'bg-gray-50 text-gray-600',
      other: 'bg-orange-50 text-orange-600'
    };
    return colors[type] || 'bg-gray-50 text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Справочник единиц измерения</h2>
        <Button onClick={() => setShowAddUnit(!showAddUnit)}>
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить единицу измерения
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <Icon name="Search" size={14} className="inline mr-1" />
              Поиск
            </label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по коду или названию..."
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <Icon name="Filter" size={14} className="inline mr-1" />
              Фильтр по типу
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">Все типы</option>
              <option value="weight">Вес</option>
              <option value="length">Длина</option>
              <option value="volume">Объем</option>
              <option value="area">Площадь</option>
              <option value="time">Время</option>
              <option value="piece">Штуки</option>
              <option value="other">Другое</option>
            </select>
          </div>
        </div>
        {(searchQuery || filterType !== 'all') && (
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span>Найдено: {filteredUnits.length}</span>
            <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setFilterType('all'); }}>
              <Icon name="X" size={14} className="mr-1" />
              Сбросить фильтры
            </Button>
          </div>
        )}
      </Card>

      {showAddUnit && (
        <Card className="p-6 space-y-4 border-2 border-primary/20">
          <h3 className="font-semibold">Новая единица измерения</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Код *</label>
              <Input
                value={newUnit.code}
                onChange={(e) => setNewUnit({ ...newUnit, code: e.target.value })}
                placeholder="796"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Название *</label>
              <Input
                value={newUnit.name}
                onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                placeholder="шт"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Полное название</label>
              <Input
                value={newUnit.fullName}
                onChange={(e) => setNewUnit({ ...newUnit, fullName: e.target.value })}
                placeholder="Штука"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Тип</label>
              <select
                value={newUnit.type}
                onChange={(e) => setNewUnit({ ...newUnit, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="weight">Вес</option>
                <option value="length">Длина</option>
                <option value="volume">Объем</option>
                <option value="area">Площадь</option>
                <option value="time">Время</option>
                <option value="piece">Штуки</option>
                <option value="other">Другое</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddUnit}>
              <Icon name="Check" size={16} className="mr-2" />
              Создать
            </Button>
            <Button variant="outline" onClick={() => setShowAddUnit(false)}>
              Отмена
            </Button>
          </div>
        </Card>
      )}

      {editingUnit && (
        <Card className="p-6 space-y-4 border-2 border-orange-500/30">
          <h3 className="font-semibold">Редактирование единицы измерения</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Код *</label>
              <Input
                value={editingUnit.code}
                onChange={(e) => setEditingUnit({ ...editingUnit, code: e.target.value })}
                placeholder="796"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Название *</label>
              <Input
                value={editingUnit.name}
                onChange={(e) => setEditingUnit({ ...editingUnit, name: e.target.value })}
                placeholder="шт"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Полное название</label>
              <Input
                value={editingUnit.fullName}
                onChange={(e) => setEditingUnit({ ...editingUnit, fullName: e.target.value })}
                placeholder="Штука"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Тип</label>
              <select
                value={editingUnit.type}
                onChange={(e) => setEditingUnit({ ...editingUnit, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="weight">Вес</option>
                <option value="length">Длина</option>
                <option value="volume">Объем</option>
                <option value="area">Площадь</option>
                <option value="time">Время</option>
                <option value="piece">Штуки</option>
                <option value="other">Другое</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpdateUnit}>
              <Icon name="Check" size={16} className="mr-2" />
              Сохранить
            </Button>
            <Button variant="outline" onClick={() => setEditingUnit(null)}>
              Отмена
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredUnits.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="Ruler" size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">
              {units.length === 0 ? 'Нет единиц измерения' : 'Единицы измерения не найдены'}
            </p>
          </Card>
        ) : (
          filteredUnits.map((unit) => (
            <Card key={unit.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="Ruler" size={20} className="text-gray-500" />
                    <h3 className="text-lg font-semibold">{unit.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(unit.type)}`}>
                      {getTypeLabel(unit.type)}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Код:</span>
                      <span className="ml-2 font-medium">{unit.code}</span>
                    </div>
                    {unit.fullName && (
                      <div>
                        <span className="text-gray-500">Полное название:</span>
                        <span className="ml-2">{unit.fullName}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingUnit(unit)}
                  >
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteUnit(unit.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
