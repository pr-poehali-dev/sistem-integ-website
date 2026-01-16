import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { type ProductSearchResult } from '@/lib/material-manager';

interface MaterialSearchResultsProps {
  results: ProductSearchResult[];
  searching: boolean;
  onSelect: (result: ProductSearchResult) => void;
  onOpenUrl: (url: string) => void;
  calculateAveragePrice: (results: ProductSearchResult[]) => string;
}

export default function MaterialSearchResults({ 
  results, 
  searching, 
  onSelect, 
  onOpenUrl,
  calculateAveragePrice 
}: MaterialSearchResultsProps) {
  if (searching) {
    return (
      <Card className="absolute z-50 mt-1 p-4 shadow-lg bg-white border-2 border-blue-500 max-w-2xl">
        <div className="flex items-center gap-2">
          <Icon name="Loader2" size={16} className="animate-spin" />
          <span className="text-sm text-gray-600">Поиск товаров...</span>
        </div>
      </Card>
    );
  }

  if (results.length === 0) {
    return null;
  }

  const averagePrice = calculateAveragePrice(results);

  return (
    <Card className="absolute z-50 mt-1 p-4 shadow-lg bg-white border-2 border-blue-500 max-w-2xl max-h-96 overflow-y-auto">
      <div className="mb-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Icon name="Search" size={16} />
          Результаты поиска ({results.length})
        </h4>
        {averagePrice && (
          <p className="text-xs text-gray-600 mt-1">
            Средняя цена: <span className="font-semibold text-green-600">
              {parseFloat(averagePrice).toLocaleString()} ₽
            </span>
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        {results.map((result, idx) => (
          <div 
            key={idx} 
            className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-sm mb-1 line-clamp-2">{result.title}</h5>
                {result.description && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{result.description}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Icon name="Globe" size={12} />
                    {result.source}
                  </span>
                  {result.price && (
                    <span className="font-semibold text-green-600">{result.price}</span>
                  )}
                  {result.manufacturer && (
                    <span className="text-gray-600">• {result.manufacturer}</span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onSelect(result)}
                  className="whitespace-nowrap"
                >
                  <Icon name="Check" size={14} className="mr-1" />
                  Выбрать
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onOpenUrl(result.url)}
                  className="whitespace-nowrap"
                >
                  <Icon name="ExternalLink" size={14} className="mr-1" />
                  Открыть
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
