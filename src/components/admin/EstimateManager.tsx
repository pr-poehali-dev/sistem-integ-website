import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  getEstimates,
  createEstimate,
  updateEstimate,
  deleteEstimate,
  createEstimateItem,
  calculateItemTotal,
  type Estimate,
  type EstimateItem
} from '@/lib/estimate-manager';
import { getProjects, type Project } from '@/lib/project-manager';
import { getUnits, type Unit } from '@/lib/unit-manager';
import { getMaterials, type Material } from '@/lib/material-manager';

export default function EstimateManager() {
  const { toast } = useToast();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showAddEstimate, setShowAddEstimate] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState<Estimate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');

  const [newEstimate, setNewEstimate] = useState({
    number: '',
    name: '',
    projectId: null as string | null,
    date: Date.now(),
    items: [] as EstimateItem[]
  });

  const [newItem, setNewItem] = useState({
    number: 1,
    code: '',
    name: '',
    unitId: null as string | null,
    quantity: 1,
    price: null as number | null,
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setEstimates(getEstimates());
    setProjects(getProjects());
    setUnits(getUnits());
    setMaterials(getMaterials());
  };

  const filteredEstimates = estimates.filter((estimate) => {
    const searchLower = searchQuery.toLowerCase();
    return estimate.number.toLowerCase().includes(searchLower) ||
           estimate.name.toLowerCase().includes(searchLower);
  });

  const handleAddEstimate = () => {
    if (!newEstimate.number || !newEstimate.name) {
      toast({
        title: 'Ошибка',
        description: 'Заполните номер и название сметы',
        variant: 'destructive'
      });
      return;
    }

    createEstimate(newEstimate);
    setNewEstimate({
      number: '',
      name: '',
      projectId: null,
      date: Date.now(),
      items: []
    });
    setShowAddEstimate(false);
    loadData();
    
    toast({
      title: 'Успех',
      description: 'Смета создана'
    });
  };

  const handleUpdateEstimate = () => {
    if (!editingEstimate) return;

    updateEstimate(editingEstimate.id, {
      number: editingEstimate.number,
      name: editingEstimate.name,
      projectId: editingEstimate.projectId,
      date: editingEstimate.date,
      items: editingEstimate.items
    });

    setEditingEstimate(null);
    loadData();
    
    toast({
      title: 'Успех',
      description: 'Смета обновлена'
    });
  };

  const handleDeleteEstimate = (estimateId: string) => {
    if (confirm('Удалить смету?')) {
      deleteEstimate(estimateId);
      loadData();
      toast({
        title: 'Успех',
        description: 'Смета удалена'
      });
    }
  };

  const handleAddItemToEstimate = () => {
    if (!newItem.name) {
      toast({
        title: 'Ошибка',
        description: 'Заполните наименование позиции',
        variant: 'destructive'
      });
      return;
    }

    const item = createEstimateItem(newItem);
    
    if (editingEstimate) {
      const updatedItems = [...editingEstimate.items, item];
      setEditingEstimate({
        ...editingEstimate,
        items: updatedItems
      });
    }

    setNewItem({
      number: newItem.number + 1,
      code: '',
      name: '',
      unitId: null,
      quantity: 1,
      price: null,
      notes: ''
    });
    setSelectedMaterialId('');
    setShowAddItem(false);
    
    toast({
      title: 'Успех',
      description: 'Позиция добавлена'
    });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!editingEstimate) return;
    
    const updatedItems = editingEstimate.items.filter(item => item.id !== itemId);
    setEditingEstimate({
      ...editingEstimate,
      items: updatedItems
    });
  };

  const handleSelectMaterial = (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    if (material) {
      setNewItem({
        ...newItem,
        code: material.code,
        name: material.name,
        unitId: material.unitId,
        price: material.price
      });
      setSelectedMaterialId(materialId);
    }
  };

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return 'Не указан';
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Не найден';
  };

  const getUnitName = (unitId: string | null) => {
    if (!unitId) return '';
    const unit = units.find(u => u.id === unitId);
    return unit ? unit.abbreviation : '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Сметные расчеты</h2>
        <Button onClick={() => setShowAddEstimate(!showAddEstimate)}>
          <Icon name="Plus" size={16} className="mr-2" />
          Создать смету
        </Button>
      </div>

      <Card className="p-4">
        <Input
          placeholder="Поиск по номеру или названию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Card>

      {showAddEstimate && (
        <Card>
          <CardHeader>
            <CardTitle>Новая смета</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Номер сметы *</label>
                <Input
                  value={newEstimate.number}
                  onChange={(e) => setNewEstimate({ ...newEstimate, number: e.target.value })}
                  placeholder="Номер"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Дата</label>
                <Input
                  type="date"
                  value={new Date(newEstimate.date).toISOString().split('T')[0]}
                  onChange={(e) => setNewEstimate({ ...newEstimate, date: new Date(e.target.value).getTime() })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Название сметы *</label>
              <Input
                value={newEstimate.name}
                onChange={(e) => setNewEstimate({ ...newEstimate, name: e.target.value })}
                placeholder="Название"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Проект</label>
              <select
                value={newEstimate.projectId || ''}
                onChange={(e) => setNewEstimate({ ...newEstimate, projectId: e.target.value || null })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">Не выбран</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddEstimate}>
                <Icon name="Check" size={16} className="mr-2" />
                Создать
              </Button>
              <Button variant="outline" onClick={() => setShowAddEstimate(false)}>
                <Icon name="X" size={16} className="mr-2" />
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {editingEstimate && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Редактирование сметы: {editingEstimate.number}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setEditingEstimate(null)}>
                <Icon name="X" size={20} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Номер сметы *</label>
                <Input
                  value={editingEstimate.number}
                  onChange={(e) => setEditingEstimate({ ...editingEstimate, number: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Дата</label>
                <Input
                  type="date"
                  value={new Date(editingEstimate.date).toISOString().split('T')[0]}
                  onChange={(e) => setEditingEstimate({ ...editingEstimate, date: new Date(e.target.value).getTime() })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Название сметы *</label>
              <Input
                value={editingEstimate.name}
                onChange={(e) => setEditingEstimate({ ...editingEstimate, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Проект</label>
              <select
                value={editingEstimate.projectId || ''}
                onChange={(e) => setEditingEstimate({ ...editingEstimate, projectId: e.target.value || null })}
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
                <Button size="sm" onClick={() => setShowAddItem(true)}>
                  <Icon name="Plus" size={14} className="mr-2" />
                  Добавить позицию
                </Button>
              </div>

              {showAddItem && (
                <Card className="p-4 mb-4 bg-muted">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Выбрать из справочника</label>
                      <select
                        value={selectedMaterialId}
                        onChange={(e) => handleSelectMaterial(e.target.value)}
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
                          value={newItem.number}
                          onChange={(e) => setNewItem({ ...newItem, number: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Код</label>
                        <Input
                          value={newItem.code}
                          onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Кол-во</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newItem.quantity}
                          onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Цена</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newItem.price || ''}
                          onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || null })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Наименование *</label>
                      <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Единица измерения</label>
                        <select
                          value={newItem.unitId || ''}
                          onChange={(e) => setNewItem({ ...newItem, unitId: e.target.value || null })}
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
                          value={calculateItemTotal(newItem.price, newItem.quantity)?.toFixed(2) || '0.00'}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Примечание</label>
                      <Input
                        value={newItem.notes}
                        onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddItemToEstimate}>
                        <Icon name="Check" size={14} className="mr-2" />
                        Добавить
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowAddItem(false)}>
                        <Icon name="X" size={14} className="mr-2" />
                        Отмена
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {editingEstimate.items.length === 0 ? (
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
                      {editingEstimate.items.map(item => (
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
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-muted font-semibold">
                        <td colSpan={6} className="p-2 text-right">Итого:</td>
                        <td className="p-2 text-right">{editingEstimate.items.reduce((sum, item) => sum + (item.totalCost || 0), 0).toLocaleString()}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleUpdateEstimate}>
                <Icon name="Check" size={16} className="mr-2" />
                Сохранить
              </Button>
              <Button variant="outline" onClick={() => setEditingEstimate(null)}>
                <Icon name="X" size={16} className="mr-2" />
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredEstimates.map(estimate => (
          <Card key={estimate.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">Смета № {estimate.number}</h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(estimate.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{estimate.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Проект: {getProjectName(estimate.projectId)}
                  </p>
                  <div className="flex gap-4 text-sm">
                    <span>Позиций: <strong>{estimate.items.length}</strong></span>
                    <span>Итого: <strong>{estimate.totalCost.toLocaleString()} ₽</strong></span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingEstimate(estimate)}>
                    <Icon name="Edit" size={14} className="mr-2" />
                    Редактировать
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteEstimate(estimate.id)}>
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEstimates.length === 0 && (
        <Card className="p-8 text-center text-gray-500">
          <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Нет сметных расчетов</p>
        </Card>
      )}
    </div>
  );
}
