import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import type { Estimate, EstimateItem, EstimateItemWork } from '@/lib/estimate-manager';
import { createEstimateItemWork } from '@/lib/estimate-manager';
import type { Project } from '@/lib/project-manager';
import type { Material } from '@/lib/material-manager';
import type { Work } from '@/lib/work-manager';
import type { Unit } from '@/lib/unit-manager';

interface EstimateFormNewProps {
  estimate: Estimate;
  projects: Project[];
  materials: Material[];
  works: Work[];
  units: Unit[];
  onEstimateChange: (estimate: Estimate) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EstimateFormNew({
  estimate,
  projects,
  materials,
  works,
  units,
  onEstimateChange,
  onSave,
  onCancel
}: EstimateFormNewProps) {
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
  const [addingWorkToItemId, setAddingWorkToItemId] = useState<string | null>(null);
  const [newWorkData, setNewWorkData] = useState({
    workId: null as string | null,
    quantity: 1,
    pricePerUnit: null as number | null
  });

  const getUnitName = (unitId: string | null) => {
    if (!unitId) return '';
    const unit = units.find(u => u.id === unitId);
    return unit ? unit.abbreviation : '';
  };

  const getMaterialName = (materialId: string | null) => {
    if (!materialId) return '';
    const material = materials.find(m => m.id === materialId);
    return material ? material.name : '';
  };

  const getWorkById = (workId: string | null) => {
    if (!workId) return null;
    return works.find(w => w.id === workId) || null;
  };

  const handleAddMaterial = () => {
    if (!selectedMaterialId) return;

    const material = materials.find(m => m.id === selectedMaterialId);
    if (!material) return;

    const newItem: EstimateItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      number: estimate.items.length + 1,
      materialId: material.id,
      materialName: material.name,
      works: [],
      totalCost: 0,
      notes: ''
    };

    onEstimateChange({
      ...estimate,
      items: [...estimate.items, newItem]
    });

    setSelectedMaterialId('');
    setShowAddMaterial(false);
  };

  const handleDeleteMaterial = (itemId: string) => {
    const updatedItems = estimate.items.filter(item => item.id !== itemId);
    const recalculatedTotal = updatedItems.reduce((sum, item) => sum + (item.totalCost || 0), 0);
    
    onEstimateChange({
      ...estimate,
      items: updatedItems,
      totalCost: recalculatedTotal
    });
  };

  const handleAddWork = (itemId: string) => {
    if (!newWorkData.workId) return;

    const work = getWorkById(newWorkData.workId);
    if (!work) return;

    const itemWork = createEstimateItemWork({
      workId: work.id,
      workName: work.name,
      unitId: work.unitId,
      quantity: newWorkData.quantity,
      pricePerUnit: newWorkData.pricePerUnit !== null ? newWorkData.pricePerUnit : work.pricePerUnit
    });

    const updatedItems = estimate.items.map(item => {
      if (item.id === itemId) {
        const updatedWorks = [...item.works, itemWork];
        const itemTotal = updatedWorks.reduce((sum, w) => sum + (w.totalCost || 0), 0);
        return { ...item, works: updatedWorks, totalCost: itemTotal };
      }
      return item;
    });

    const recalculatedTotal = updatedItems.reduce((sum, item) => sum + (item.totalCost || 0), 0);

    onEstimateChange({
      ...estimate,
      items: updatedItems,
      totalCost: recalculatedTotal
    });

    setNewWorkData({ workId: null, quantity: 1, pricePerUnit: null });
    setAddingWorkToItemId(null);
  };

  const handleDeleteWork = (itemId: string, workId: string) => {
    const updatedItems = estimate.items.map(item => {
      if (item.id === itemId) {
        const updatedWorks = item.works.filter(w => w.id !== workId);
        const itemTotal = updatedWorks.reduce((sum, w) => sum + (w.totalCost || 0), 0);
        return { ...item, works: updatedWorks, totalCost: itemTotal };
      }
      return item;
    });

    const recalculatedTotal = updatedItems.reduce((sum, item) => sum + (item.totalCost || 0), 0);

    onEstimateChange({
      ...estimate,
      items: updatedItems,
      totalCost: recalculatedTotal
    });
  };

  const handleSelectWork = (workId: string) => {
    const work = getWorkById(workId);
    if (work) {
      setNewWorkData({
        ...newWorkData,
        workId: work.id,
        pricePerUnit: work.pricePerUnit
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Форма сметного расчета: {estimate.number}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <Icon name="X" size={20} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
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

        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Материалы и работы</h3>
            <Button size="sm" onClick={() => setShowAddMaterial(true)}>
              <Icon name="Plus" size={14} className="mr-2" />
              Добавить материал
            </Button>
          </div>

          {showAddMaterial && (
            <Card className="p-4 mb-4 bg-muted">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Выбрать материал</label>
                  <select
                    value={selectedMaterialId}
                    onChange={(e) => setSelectedMaterialId(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="">Выберите материал/оборудование</option>
                    {materials.map(material => (
                      <option key={material.id} value={material.id}>
                        {material.code} - {material.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddMaterial}>
                    <Icon name="Check" size={14} className="mr-2" />
                    Добавить
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddMaterial(false)}>
                    <Icon name="X" size={14} className="mr-2" />
                    Отмена
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {estimate.items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <Icon name="Package" size={48} className="mx-auto mb-2 opacity-20" />
              <p>Нет материалов в смете</p>
            </div>
          ) : (
            <div className="space-y-4">
              {estimate.items.map((item, itemIndex) => (
                <Card key={item.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-lg">
                          {itemIndex + 1}. {item.materialName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Материал: {getMaterialName(item.materialId)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setAddingWorkToItemId(item.id)}
                        >
                          <Icon name="Plus" size={14} className="mr-1" />
                          Добавить работу
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteMaterial(item.id)}
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>

                    {addingWorkToItemId === item.id && (
                      <Card className="p-3 mb-3 bg-blue-50">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-2">Выбрать работу</label>
                            <select
                              value={newWorkData.workId || ''}
                              onChange={(e) => handleSelectWork(e.target.value)}
                              className="w-full border rounded-md px-3 py-2"
                            >
                              <option value="">Выберите работу из справочника</option>
                              {works.map(work => (
                                <option key={work.id} value={work.id}>
                                  {work.code} - {work.name} ({getUnitName(work.unitId)})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium mb-2">Количество</label>
                              <Input
                                type="number"
                                step="0.01"
                                value={newWorkData.quantity}
                                onChange={(e) => setNewWorkData({ ...newWorkData, quantity: parseFloat(e.target.value) || 0 })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Цена за ед.</label>
                              <Input
                                type="number"
                                step="0.01"
                                value={newWorkData.pricePerUnit || ''}
                                onChange={(e) => setNewWorkData({ ...newWorkData, pricePerUnit: parseFloat(e.target.value) || null })}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleAddWork(item.id)}>
                              <Icon name="Check" size={14} className="mr-1" />
                              Добавить
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setAddingWorkToItemId(null)}>
                              <Icon name="X" size={14} className="mr-1" />
                              Отмена
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}

                    {item.works.length === 0 ? (
                      <div className="text-center py-4 text-sm text-muted-foreground border-2 border-dashed rounded">
                        Нет работ для этого материала
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-muted">
                              <th className="text-left p-2">Наименование работы</th>
                              <th className="text-left p-2">Ед.изм.</th>
                              <th className="text-right p-2">Кол-во</th>
                              <th className="text-right p-2">Цена за ед.</th>
                              <th className="text-right p-2">Сумма</th>
                              <th className="text-center p-2">Действия</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.works.map(work => (
                              <tr key={work.id} className="border-b hover:bg-muted/50">
                                <td className="p-2">{work.workName}</td>
                                <td className="p-2">{getUnitName(work.unitId)}</td>
                                <td className="p-2 text-right">{work.quantity}</td>
                                <td className="p-2 text-right">{work.pricePerUnit?.toLocaleString() || '-'}</td>
                                <td className="p-2 text-right font-semibold">{work.totalCost?.toLocaleString() || '-'}</td>
                                <td className="p-2 text-center">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteWork(item.id, work.id)}
                                  >
                                    <Icon name="Trash2" size={14} />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-muted/70 font-semibold">
                              <td colSpan={4} className="p-2 text-right">Итого по материалу:</td>
                              <td className="p-2 text-right">{item.totalCost?.toLocaleString() || '0'}</td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-4 p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">ИТОГО ПО СМЕТЕ:</span>
              <span className="text-2xl font-bold text-orange-600">
                {estimate.totalCost.toLocaleString()} ₽
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={onSave}>
            <Icon name="Check" size={16} className="mr-2" />
            Сохранить смету
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
