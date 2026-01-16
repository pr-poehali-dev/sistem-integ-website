import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { type Unit } from '@/lib/unit-manager';
import { type ProductSearchResult } from '@/lib/material-manager';
import MaterialSearchResults from './MaterialSearchResults';

interface MaterialFormData {
  type: 'material' | 'equipment';
  code: string;
  articleNumber: string;
  name: string;
  description: string;
  unitId: string | null;
  price: number | null;
  manufacturer: string;
  notes: string;
}

interface MaterialFormProps {
  mode: 'create' | 'edit';
  data: MaterialFormData;
  units: Unit[];
  searchResults: ProductSearchResult[];
  showSearchResults: boolean;
  searchingArticle: boolean;
  activeArticleInput: 'new' | 'edit' | null;
  onDataChange: (data: Partial<MaterialFormData>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onArticlePaste: (e: React.ClipboardEvent, mode: 'new' | 'edit') => void;
  onSelectSearchResult: (result: ProductSearchResult) => void;
  onOpenSearchResultUrl: (url: string) => void;
  calculateAveragePrice: (results: ProductSearchResult[]) => string;
  searchResultsRef: React.RefObject<HTMLDivElement>;
}

export default function MaterialForm({
  mode,
  data,
  units,
  searchResults,
  showSearchResults,
  searchingArticle,
  activeArticleInput,
  onDataChange,
  onSubmit,
  onCancel,
  onArticlePaste,
  onSelectSearchResult,
  onOpenSearchResultUrl,
  calculateAveragePrice,
  searchResultsRef
}: MaterialFormProps) {
  const formMode = mode === 'create' ? 'new' : 'edit';
  const showResults = showSearchResults && activeArticleInput === formMode;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {mode === 'create' ? 'Добавить элемент' : 'Редактировать элемент'}
      </h3>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Тип *</label>
          <select
            value={data.type}
            onChange={(e) => onDataChange({ type: e.target.value as 'material' | 'equipment' })}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="material">Материал</option>
            <option value="equipment">Оборудование</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Код *</label>
          <Input
            value={data.code}
            onChange={(e) => onDataChange({ code: e.target.value })}
            placeholder="Код элемента"
          />
        </div>

        <div className="relative" ref={searchResultsRef}>
          <label className="block text-sm font-medium mb-2">
            Артикул / Партномер
            <span className="text-xs text-gray-500 ml-2">(вставьте для автопоиска)</span>
          </label>
          <Input
            value={data.articleNumber || ''}
            onChange={(e) => onDataChange({ articleNumber: e.target.value })}
            onPaste={(e) => onArticlePaste(e, formMode)}
            placeholder="Вставьте артикул из буфера"
          />
          
          {showResults && (
            <MaterialSearchResults
              results={searchResults}
              searching={searchingArticle}
              onSelect={onSelectSearchResult}
              onOpenUrl={onOpenSearchResultUrl}
              calculateAveragePrice={calculateAveragePrice}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Название *</label>
          <Input
            value={data.name}
            onChange={(e) => onDataChange({ name: e.target.value })}
            placeholder="Название"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Описание</label>
          <Input
            value={data.description}
            onChange={(e) => onDataChange({ description: e.target.value })}
            placeholder="Описание"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Единица измерения</label>
          <select
            value={data.unitId || ''}
            onChange={(e) => onDataChange({ unitId: e.target.value || null })}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Не выбрано</option>
            {units.map(unit => (
              <option key={unit.id} value={unit.id}>
                {unit.code} - {unit.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Цена</label>
          <Input
            type="number"
            step="0.01"
            value={data.price?.toString() || ''}
            onChange={(e) => onDataChange({ price: e.target.value ? parseFloat(e.target.value) : null })}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Производитель</label>
          <Input
            value={data.manufacturer}
            onChange={(e) => onDataChange({ manufacturer: e.target.value })}
            placeholder="Производитель"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Примечания</label>
          <textarea
            value={data.notes}
            onChange={(e) => onDataChange({ notes: e.target.value })}
            placeholder="Примечания"
            className="w-full border rounded-md px-3 py-2 min-h-[80px]"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={onSubmit}>
          <Icon name={mode === 'create' ? 'Plus' : 'Save'} size={16} className="mr-2" />
          {mode === 'create' ? 'Создать' : 'Сохранить'}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </Card>
  );
}
