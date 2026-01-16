import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  getWorks,
  createWork,
  updateWork,
  deleteWork,
  type Work
} from '@/lib/work-manager';
import { getUnits, type Unit } from '@/lib/unit-manager';

export default function WorkManager() {
  const { toast } = useToast();
  const [works, setWorks] = useState<Work[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [showAddWork, setShowAddWork] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [newWork, setNewWork] = useState({
    code: '',
    name: '',
    unitId: null as string | null,
    pricePerUnit: null as number | null,
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setWorks(getWorks());
    setUnits(getUnits());
  };

  const filteredWorks = works.filter((work) => {
    const searchLower = searchQuery.toLowerCase();
    return work.code.toLowerCase().includes(searchLower) ||
           work.name.toLowerCase().includes(searchLower);
  });

  const handleAddWork = () => {
    if (!newWork.name) {
      toast({
        title: 'Ошибка',
        description: 'Заполните наименование работы',
        variant: 'destructive'
      });
      return;
    }

    createWork(newWork);
    setNewWork({
      code: '',
      name: '',
      unitId: null,
      pricePerUnit: null,
      description: ''
    });
    setShowAddWork(false);
    loadData();
    
    toast({
      title: 'Успех',
      description: 'Работа добавлена'
    });
  };

  const handleUpdateWork = () => {
    if (!editingWork) return;

    updateWork(editingWork.id, {
      code: editingWork.code,
      name: editingWork.name,
      unitId: editingWork.unitId,
      pricePerUnit: editingWork.pricePerUnit,
      description: editingWork.description
    });

    setEditingWork(null);
    loadData();
    
    toast({
      title: 'Успех',
      description: 'Работа обновлена'
    });
  };

  const handleDeleteWork = (workId: string) => {
    if (confirm('Удалить работу?')) {
      deleteWork(workId);
      loadData();
      toast({
        title: 'Успех',
        description: 'Работа удалена'
      });
    }
  };

  const getUnitName = (unitId: string | null) => {
    if (!unitId) return '';
    const unit = units.find(u => u.id === unitId);
    return unit ? unit.abbreviation : '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Справочник работ</h2>
        <Button onClick={() => setShowAddWork(!showAddWork)}>
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить работу
        </Button>
      </div>

      {showAddWork && (
        <Card>
          <CardHeader>
            <CardTitle>Новая работа</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Код</label>
                <Input
                  value={newWork.code}
                  onChange={(e) => setNewWork({ ...newWork, code: e.target.value })}
                  placeholder="Код работы"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Единица измерения</label>
                <select
                  value={newWork.unitId || ''}
                  onChange={(e) => setNewWork({ ...newWork, unitId: e.target.value || null })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Не выбрана</option>
                  {units.map(unit => (
                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Наименование *</label>
              <Input
                value={newWork.name}
                onChange={(e) => setNewWork({ ...newWork, name: e.target.value })}
                placeholder="Наименование работы"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Стоимость за единицу</label>
              <Input
                type="number"
                step="0.01"
                value={newWork.pricePerUnit || ''}
                onChange={(e) => setNewWork({ ...newWork, pricePerUnit: parseFloat(e.target.value) || null })}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <Input
                value={newWork.description}
                onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
                placeholder="Описание работы"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddWork}>
                <Icon name="Check" size={16} className="mr-2" />
                Добавить
              </Button>
              <Button variant="outline" onClick={() => setShowAddWork(false)}>
                <Icon name="X" size={16} className="mr-2" />
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {editingWork && (
        <Card>
          <CardHeader>
            <CardTitle>Редактирование работы</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Код</label>
                <Input
                  value={editingWork.code}
                  onChange={(e) => setEditingWork({ ...editingWork, code: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Единица измерения</label>
                <select
                  value={editingWork.unitId || ''}
                  onChange={(e) => setEditingWork({ ...editingWork, unitId: e.target.value || null })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Не выбрана</option>
                  {units.map(unit => (
                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Наименование *</label>
              <Input
                value={editingWork.name}
                onChange={(e) => setEditingWork({ ...editingWork, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Стоимость за единицу</label>
              <Input
                type="number"
                step="0.01"
                value={editingWork.pricePerUnit || ''}
                onChange={(e) => setEditingWork({ ...editingWork, pricePerUnit: parseFloat(e.target.value) || null })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <Input
                value={editingWork.description}
                onChange={(e) => setEditingWork({ ...editingWork, description: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleUpdateWork}>
                <Icon name="Check" size={16} className="mr-2" />
                Сохранить
              </Button>
              <Button variant="outline" onClick={() => setEditingWork(null)}>
                <Icon name="X" size={16} className="mr-2" />
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Поиск по коду или наименованию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredWorks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Icon name="Wrench" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Нет работ в справочнике</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Код</th>
                    <th className="text-left p-3">Наименование</th>
                    <th className="text-left p-3">Ед.изм.</th>
                    <th className="text-right p-3">Цена за ед.</th>
                    <th className="text-center p-3">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorks.map(work => (
                    <tr key={work.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">{work.code}</td>
                      <td className="p-3">{work.name}</td>
                      <td className="p-3">{getUnitName(work.unitId)}</td>
                      <td className="p-3 text-right">{work.pricePerUnit?.toLocaleString() || '-'}</td>
                      <td className="p-3">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingWork(work)}
                          >
                            <Icon name="Pencil" size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteWork(work.id)}
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
