import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  getEstimates,
  createEstimate,
  updateEstimate,
  deleteEstimate,
  createEstimateItem,
  type Estimate,
  type EstimateItem
} from '@/lib/estimate-manager';
import { getProjects, type Project } from '@/lib/project-manager';
import { getUnits, type Unit } from '@/lib/unit-manager';
import { getMaterials, type Material } from '@/lib/material-manager';
import EstimateForm from './estimates/EstimateForm';
import EstimateEditor from './estimates/EstimateEditor';
import EstimateTable from './estimates/EstimateTable';

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
  const [viewMode, setViewMode] = useState<'table' | 'edit'>('table');
  const [filterProjectId, setFilterProjectId] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');

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
    const projectName = getProjectName(estimate.projectId).toLowerCase();
    
    const matchesSearch = estimate.number.toLowerCase().includes(searchLower) ||
           estimate.name.toLowerCase().includes(searchLower) ||
           projectName.includes(searchLower);
    
    const matchesProject = filterProjectId === 'all' || estimate.projectId === filterProjectId;
    
    let matchesDateFrom = true;
    if (filterDateFrom) {
      const fromDate = new Date(filterDateFrom).getTime();
      matchesDateFrom = estimate.date >= fromDate;
    }
    
    let matchesDateTo = true;
    if (filterDateTo) {
      const toDate = new Date(filterDateTo).getTime() + 86400000;
      matchesDateTo = estimate.date <= toDate;
    }
    
    return matchesSearch && matchesProject && matchesDateFrom && matchesDateTo;
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
    setViewMode('table');
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

  const handleEditEstimate = (estimate: Estimate) => {
    setEditingEstimate(estimate);
    setViewMode('edit');
    setShowAddItem(false);
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

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterProjectId('all');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Журнал сметных расчетов</h2>
        <Button onClick={() => setShowAddEstimate(!showAddEstimate)}>
          <Icon name="Plus" size={16} className="mr-2" />
          Создать смету
        </Button>
      </div>

      {showAddEstimate && (
        <EstimateForm
          data={{
            number: newEstimate.number,
            name: newEstimate.name,
            projectId: newEstimate.projectId,
            date: newEstimate.date
          }}
          projects={projects}
          onDataChange={(data) => setNewEstimate({ ...newEstimate, ...data })}
          onSubmit={handleAddEstimate}
          onCancel={() => setShowAddEstimate(false)}
          title="Новая смета"
        />
      )}

      {viewMode === 'edit' && editingEstimate && (
        <EstimateEditor
          estimate={editingEstimate}
          projects={projects}
          units={units}
          materials={materials}
          showAddItem={showAddItem}
          newItem={newItem}
          selectedMaterialId={selectedMaterialId}
          onEstimateChange={setEditingEstimate}
          onNewItemChange={setNewItem}
          onSelectMaterial={handleSelectMaterial}
          onAddItem={handleAddItemToEstimate}
          onDeleteItem={handleDeleteItem}
          onSetShowAddItem={setShowAddItem}
          onSave={handleUpdateEstimate}
          onCancel={() => { setEditingEstimate(null); setViewMode('table'); }}
          getUnitName={getUnitName}
        />
      )}

      {viewMode === 'table' && (
        <EstimateTable
          estimates={filteredEstimates}
          totalEstimates={estimates.length}
          projects={projects}
          searchQuery={searchQuery}
          filterProjectId={filterProjectId}
          filterDateFrom={filterDateFrom}
          filterDateTo={filterDateTo}
          onSearchChange={setSearchQuery}
          onFilterProjectChange={setFilterProjectId}
          onFilterDateFromChange={setFilterDateFrom}
          onFilterDateToChange={setFilterDateTo}
          onResetFilters={handleResetFilters}
          onEdit={handleEditEstimate}
          onDelete={handleDeleteEstimate}
          getProjectName={getProjectName}
        />
      )}
    </div>
  );
}
