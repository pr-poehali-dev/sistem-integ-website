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

  const handleSelectSearchResult = (result: ProductSearchResult) => {
    if (activeArticleInput === 'new') {
      setNewMaterial({
        ...newMaterial,
        name: result.title,
        description: result.description,
        manufacturer: result.manufacturer || newMaterial.manufacturer,
        price: result.price || newMaterial.price
      });
    } else if (activeArticleInput === 'edit' && editingMaterial) {
      setEditingMaterial({
        ...editingMaterial,
        name: result.title,
        description: result.description,
        manufacturer: result.manufacturer || editingMaterial.manufacturer,
        price: result.price ? parseFloat(result.price) : editingMaterial.price
      });
    }

    setShowSearchResults(false);
    setSearchResults([]);
    
    toast({
      title: 'Данные заполнены',
      description: 'Информация из результата поиска добавлена в форму'
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
              placeholder="Поиск по коду, артикулу, названию, производителю..."
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
              <option value="material">Материалы</option>
              <option value="equipment">Оборудование</option>
            </select>
          </div>
        </div>
        {(searchQuery || filterType !== 'all') && (
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span>Найдено: {filteredMaterials.length}</span>
            <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setFilterType('all'); }}>
              <Icon name="X" size={14} className="mr-1" />
              Сбросить фильтры
            </Button>
          </div>
        )}
      </Card>

      {showAddMaterial && (
        <div className="relative">
          <Card className="p-6 space-y-4 border-2 border-primary/20">
            <h3 className="font-semibold">Новый элемент</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Тип *</label>
                <select
                  value={newMaterial.type}
                  onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value as 'material' | 'equipment' })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="material">Материал</option>
                  <option value="equipment">Оборудование</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Код *</label>
                <Input
                  value={newMaterial.code}
                  onChange={(e) => setNewMaterial({ ...newMaterial, code: e.target.value })}
                  placeholder="M-001"
                />
              </div>
              <div className="col-span-2 relative">
                <label className="block text-sm font-medium mb-2">
                  Артикул / Партномер
                  <span className="ml-2 text-xs text-gray-500">(Вставьте из буфера для поиска)</span>
                </label>
                <Input
                  value={newMaterial.articleNumber}
                  onChange={(e) => setNewMaterial({ ...newMaterial, articleNumber: e.target.value })}
                  onPaste={(e) => handleArticlePaste(e, 'new')}
                  placeholder="ABC-12345"
                  className="w-full"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Название *</label>
                <Input
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  placeholder="Название материала/оборудования"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Описание</label>
                <textarea
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                  placeholder="Подробное описание"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Единица измерения</label>
                <select
                  value={newMaterial.unitId}
                  onChange={(e) => setNewMaterial({ ...newMaterial, unitId: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Не выбрана</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Цена (₽)</label>
                <Input
                  type="number"
                  value={newMaterial.price}
                  onChange={(e) => setNewMaterial({ ...newMaterial, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Производитель</label>
                <Input
                  value={newMaterial.manufacturer}
                  onChange={(e) => setNewMaterial({ ...newMaterial, manufacturer: e.target.value })}
                  placeholder="Название производителя"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Примечания</label>
                <textarea
                  value={newMaterial.notes}
                  onChange={(e) => setNewMaterial({ ...newMaterial, notes: e.target.value })}
                  placeholder="Дополнительная информация"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddMaterial}>
                <Icon name="Check" size={16} className="mr-2" />
                Создать
              </Button>
              <Button variant="outline" onClick={() => setShowAddMaterial(false)}>
                Отмена
              </Button>
            </div>
          </Card>

          {showSearchResults && activeArticleInput === 'new' && (
            <div ref={searchResultsRef} className="absolute top-full left-0 right-0 mt-2 z-50">
              <Card className="p-4 shadow-lg border-2 border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Icon name="Search" size={16} />
                    Результаты поиска по артикулу
                  </h4>
                  <Button variant="ghost" size="sm" onClick={() => setShowSearchResults(false)}>
                    <Icon name="X" size={16} />
                  </Button>
                </div>
                
                {searchingArticle ? (
                  <div className="text-center py-8">
                    <Icon name="RefreshCw" size={32} className="mx-auto mb-2 animate-spin opacity-50" />
                    <p className="text-sm text-muted-foreground">Поиск товаров...</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="SearchX" size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm text-muted-foreground">Ничего не найдено</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1" onClick={() => handleSelectSearchResult(result)}>
                            <h5 className="font-medium text-sm mb-1 hover:text-orange-600">{result.title}</h5>
                            {result.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{result.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Icon name="ExternalLink" size={12} />
                                {result.source}
                              </span>
                              {result.price && (
                                <span className="font-medium text-green-600">{result.price}</span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openSearchResultUrl(result.url);
                            }}
                            title="Открыть в новой вкладке"
                          >
                            <Icon name="ExternalLink" size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      )}

      {editingMaterial && (
        <div className="relative">
          <Card className="p-6 space-y-4 border-2 border-orange-500/30">
            <h3 className="font-semibold">Редактирование элемента</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Тип *</label>
                <select
                  value={editingMaterial.type}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, type: e.target.value as 'material' | 'equipment' })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="material">Материал</option>
                  <option value="equipment">Оборудование</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Код *</label>
                <Input
                  value={editingMaterial.code}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, code: e.target.value })}
                  placeholder="M-001"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Артикул / Партномер
                  <span className="ml-2 text-xs text-gray-500">(Вставьте из буфера для поиска)</span>
                </label>
                <Input
                  value={editingMaterial.articleNumber}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, articleNumber: e.target.value })}
                  onPaste={(e) => handleArticlePaste(e, 'edit')}
                  placeholder="ABC-12345"
                  className="w-full"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Название *</label>
                <Input
                  value={editingMaterial.name}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, name: e.target.value })}
                  placeholder="Название материала/оборудования"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Описание</label>
                <textarea
                  value={editingMaterial.description}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, description: e.target.value })}
                  placeholder="Подробное описание"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Единица измерения</label>
                <select
                  value={editingMaterial.unitId || ''}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, unitId: e.target.value || null })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Не выбрана</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Цена (₽)</label>
                <Input
                  type="number"
                  value={editingMaterial.price || ''}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, price: e.target.value ? parseFloat(e.target.value) : null })}
                  placeholder="0.00"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Производитель</label>
                <Input
                  value={editingMaterial.manufacturer}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, manufacturer: e.target.value })}
                  placeholder="Название производителя"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Примечания</label>
                <textarea
                  value={editingMaterial.notes}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, notes: e.target.value })}
                  placeholder="Дополнительная информация"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateMaterial}>
                <Icon name="Check" size={16} className="mr-2" />
                Сохранить
              </Button>
              <Button variant="outline" onClick={() => setEditingMaterial(null)}>
                Отмена
              </Button>
            </div>
          </Card>

          {showSearchResults && activeArticleInput === 'edit' && (
            <div ref={searchResultsRef} className="absolute top-full left-0 right-0 mt-2 z-50">
              <Card className="p-4 shadow-lg border-2 border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Icon name="Search" size={16} />
                    Результаты поиска по артикулу
                  </h4>
                  <Button variant="ghost" size="sm" onClick={() => setShowSearchResults(false)}>
                    <Icon name="X" size={16} />
                  </Button>
                </div>
                
                {searchingArticle ? (
                  <div className="text-center py-8">
                    <Icon name="RefreshCw" size={32} className="mx-auto mb-2 animate-spin opacity-50" />
                    <p className="text-sm text-muted-foreground">Поиск товаров...</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="SearchX" size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm text-muted-foreground">Ничего не найдено</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1" onClick={() => handleSelectSearchResult(result)}>
                            <h5 className="font-medium text-sm mb-1 hover:text-orange-600">{result.title}</h5>
                            {result.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{result.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Icon name="ExternalLink" size={12} />
                                {result.source}
                              </span>
                              {result.price && (
                                <span className="font-medium text-green-600">{result.price}</span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openSearchResultUrl(result.url);
                            }}
                            title="Открыть в новой вкладке"
                          >
                            <Icon name="ExternalLink" size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4">
        {filteredMaterials.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="Package" size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">
              {materials.length === 0 ? 'Нет материалов и оборудования' : 'Элементы не найдены'}
            </p>
          </Card>
        ) : (
          filteredMaterials.map((material) => (
            <Card key={material.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name={getTypeIcon(material.type) as any} size={20} className="text-gray-500" />
                    <h3 className="text-lg font-semibold">{material.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
                      {getTypeLabel(material.type)}
                    </span>
                  </div>
                  {material.description && (
                    <p className="text-sm text-muted-foreground mb-3">{material.description}</p>
                  )}
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Код:</span>
                      <span className="ml-2 font-medium">{material.code}</span>
                    </div>
                    {material.articleNumber && (
                      <div>
                        <span className="text-gray-500">Артикул:</span>
                        <span className="ml-2 font-mono text-xs">{material.articleNumber}</span>
                      </div>
                    )}
                    {material.unitId && (
                      <div>
                        <Icon name="Ruler" size={14} className="inline mr-1 text-gray-500" />
                        <span className="text-gray-600">Ед. изм.: {getUnitName(material.unitId)}</span>
                      </div>
                    )}
                    {material.price && (
                      <div>
                        <Icon name="Wallet" size={14} className="inline mr-1 text-gray-500" />
                        <span className="text-gray-600">Цена: {material.price.toLocaleString()} ₽</span>
                      </div>
                    )}
                    {material.manufacturer && (
                      <div>
                        <Icon name="Building2" size={14} className="inline mr-1 text-gray-500" />
                        <span className="text-gray-600">{material.manufacturer}</span>
                      </div>
                    )}
                  </div>
                  {material.notes && (
                    <div className="mt-2 pt-2 border-t text-sm text-gray-600">
                      {material.notes}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingMaterial(material)}
                  >
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteMaterial(material.id)}
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
