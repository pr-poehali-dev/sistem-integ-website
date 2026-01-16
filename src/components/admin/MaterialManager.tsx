import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  searchProductByArticle,
  type Material,
  type ProductSearchResult
} from '@/lib/material-manager';
import { getUnits, type Unit } from '@/lib/unit-manager';
import MaterialForm from './materials/MaterialForm';
import MaterialCard from './materials/MaterialCard';
import ExcelImport from './ExcelImport';

export default function MaterialManager() {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchingArticle, setSearchingArticle] = useState(false);
  const [activeArticleInput, setActiveArticleInput] = useState<'new' | 'edit' | null>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  
  const [newMaterial, setNewMaterial] = useState({
    type: 'material' as const,
    code: '',
    articleNumber: '',
    name: '',
    description: '',
    unitId: '',
    price: '',
    manufacturer: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadData = () => {
    setMaterials(getMaterials());
    setUnits(getUnits());
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesType = filterType === 'all' || material.type === filterType;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = material.code.toLowerCase().includes(searchLower) ||
                         material.articleNumber.toLowerCase().includes(searchLower) ||
                         material.name.toLowerCase().includes(searchLower) ||
                         material.description.toLowerCase().includes(searchLower) ||
                         material.manufacturer.toLowerCase().includes(searchLower);
    return matchesType && matchesSearch;
  });

  const handleArticlePaste = async (e: React.ClipboardEvent, mode: 'new' | 'edit') => {
    const pastedText = e.clipboardData.getData('text');
    if (!pastedText || pastedText.trim().length < 3) return;

    setActiveArticleInput(mode);
    setSearchingArticle(true);
    setShowSearchResults(true);

    try {
      const results = await searchProductByArticle(pastedText);
      setSearchResults(results);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить поиск',
        variant: 'destructive'
      });
    } finally {
      setSearchingArticle(false);
    }
  };

  const calculateAveragePrice = (results: ProductSearchResult[]): string => {
    const prices = results
      .map(r => r.price)
      .filter(p => p && p.length > 0)
      .map(p => {
        const numStr = p.replace(/[^\d.,]/g, '').replace(',', '.');
        return parseFloat(numStr);
      })
      .filter(p => !isNaN(p) && p > 0);

    if (prices.length === 0) return '';
    
    const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    return average.toFixed(2);
  };

  const handleSelectSearchResult = (result: ProductSearchResult) => {
    const averagePrice = calculateAveragePrice(searchResults);
    
    if (activeArticleInput === 'new') {
      setNewMaterial({
        ...newMaterial,
        name: result.title,
        description: result.description,
        manufacturer: result.manufacturer || newMaterial.manufacturer,
        price: averagePrice || newMaterial.price
      });
    } else if (activeArticleInput === 'edit' && editingMaterial) {
      setEditingMaterial({
        ...editingMaterial,
        name: result.title,
        description: result.description,
        manufacturer: result.manufacturer || editingMaterial.manufacturer,
        price: averagePrice ? parseFloat(averagePrice) : editingMaterial.price
      });
    }

    setShowSearchResults(false);
    setSearchResults([]);
    
    toast({
      title: 'Данные заполнены',
      description: averagePrice 
        ? `Информация добавлена. Средняя цена: ${parseFloat(averagePrice).toLocaleString()} ₽`
        : 'Информация из результата поиска добавлена в форму'
    });
  };

  const openSearchResultUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddMaterial = () => {
    if (!newMaterial.code || !newMaterial.name) {
      toast({
        title: 'Ошибка',
        description: 'Заполните код и название',
        variant: 'destructive'
      });
      return;
    }

    createMaterial({
      type: newMaterial.type,
      code: newMaterial.code,
      articleNumber: newMaterial.articleNumber,
      name: newMaterial.name,
      description: newMaterial.description,
      unitId: newMaterial.unitId || null,
      price: newMaterial.price ? parseFloat(newMaterial.price) : null,
      manufacturer: newMaterial.manufacturer,
      notes: newMaterial.notes
    });

    setNewMaterial({
      type: 'material',
      code: '',
      articleNumber: '',
      name: '',
      description: '',
      unitId: '',
      price: '',
      manufacturer: '',
      notes: ''
    });
    setShowAddMaterial(false);
    loadData();
    
    toast({
      title: 'Успех',
      description: newMaterial.type === 'material' ? 'Материал создан' : 'Оборудование создано'
    });
  };

  const handleUpdateMaterial = () => {
    if (!editingMaterial) return;

    updateMaterial(editingMaterial.id, {
      type: editingMaterial.type,
      code: editingMaterial.code,
      articleNumber: editingMaterial.articleNumber,
      name: editingMaterial.name,
      description: editingMaterial.description,
      unitId: editingMaterial.unitId,
      price: editingMaterial.price,
      manufacturer: editingMaterial.manufacturer,
      notes: editingMaterial.notes
    });

    setEditingMaterial(null);
    loadData();
    
    toast({
      title: 'Успех',
      description: 'Данные обновлены'
    });
  };

  const handleDeleteMaterial = (materialId: string) => {
    if (confirm('Удалить элемент?')) {
      deleteMaterial(materialId);
      loadData();
      toast({
        title: 'Успех',
        description: 'Элемент удален'
      });
    }
  };

  const getTypeLabel = (type: string) => {
    return type === 'material' ? 'Материал' : 'Оборудование';
  };

  const getTypeColor = (type: string) => {
    return type === 'material' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600';
  };

  const getTypeIcon = (type: string) => {
    return type === 'material' ? 'Package' : 'Wrench';
  };

  const getUnitName = (unitId: string | null) => {
    if (!unitId) return '';
    const unit = units.find(u => u.id === unitId);
    return unit ? unit.name : '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Справочник материалов и оборудования</h2>
        <Button onClick={() => setShowAddMaterial(!showAddMaterial)}>
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить элемент
        </Button>
      </div>

      <ExcelImport />

      <Card className="p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <Icon name="Search" size={14} className="inline mr-1" />
              Поиск
            </label>
            <Input
              placeholder="Поиск по коду, артикулу, названию, описанию, производителю..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Icon name="Filter" size={14} className="inline mr-1" />
              Тип
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="all">Все</option>
              <option value="material">Материалы</option>
              <option value="equipment">Оборудование</option>
            </select>
          </div>
        </div>
      </Card>

      {showAddMaterial && (
        <MaterialForm
          mode="create"
          data={{
            type: newMaterial.type,
            code: newMaterial.code,
            articleNumber: newMaterial.articleNumber,
            name: newMaterial.name,
            description: newMaterial.description,
            unitId: newMaterial.unitId || null,
            price: newMaterial.price ? parseFloat(newMaterial.price) : null,
            manufacturer: newMaterial.manufacturer,
            notes: newMaterial.notes
          }}
          units={units}
          searchResults={searchResults}
          showSearchResults={showSearchResults}
          searchingArticle={searchingArticle}
          activeArticleInput={activeArticleInput}
          onDataChange={(updates) => setNewMaterial({ ...newMaterial, ...updates })}
          onSubmit={handleAddMaterial}
          onCancel={() => setShowAddMaterial(false)}
          onArticlePaste={handleArticlePaste}
          onSelectSearchResult={handleSelectSearchResult}
          onOpenSearchResultUrl={openSearchResultUrl}
          calculateAveragePrice={calculateAveragePrice}
          searchResultsRef={searchResultsRef}
        />
      )}

      {editingMaterial && (
        <MaterialForm
          mode="edit"
          data={editingMaterial}
          units={units}
          searchResults={searchResults}
          showSearchResults={showSearchResults}
          searchingArticle={searchingArticle}
          activeArticleInput={activeArticleInput}
          onDataChange={(updates) => setEditingMaterial({ ...editingMaterial, ...updates })}
          onSubmit={handleUpdateMaterial}
          onCancel={() => setEditingMaterial(null)}
          onArticlePaste={handleArticlePaste}
          onSelectSearchResult={handleSelectSearchResult}
          onOpenSearchResultUrl={openSearchResultUrl}
          calculateAveragePrice={calculateAveragePrice}
          searchResultsRef={searchResultsRef}
        />
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map(material => (
          <MaterialCard
            key={material.id}
            material={material}
            unitName={getUnitName(material.unitId)}
            onEdit={setEditingMaterial}
            onDelete={handleDeleteMaterial}
            getTypeLabel={getTypeLabel}
            getTypeColor={getTypeColor}
            getTypeIcon={getTypeIcon}
          />
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <Card className="p-8 text-center text-gray-500">
          <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Нет элементов в справочнике</p>
        </Card>
      )}
    </div>
  );
}