import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface ProjectListFiltersProps {
  searchQuery: string;
  filterStatus: string;
  resultsCount: number;
  onSearchChange: (query: string) => void;
  onFilterChange: (status: string) => void;
  onReset: () => void;
}

export default function ProjectListFilters({
  searchQuery,
  filterStatus,
  resultsCount,
  onSearchChange,
  onFilterChange,
  onReset
}: ProjectListFiltersProps) {
  return (
    <Card className="p-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <Icon name="Search" size={14} className="inline mr-1" />
            Поиск по названию или описанию
          </label>
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Введите текст для поиска..."
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <Icon name="Filter" size={14} className="inline mr-1" />
            Фильтр по статусу
          </label>
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="all">Все статусы</option>
            <option value="active">Активен</option>
            <option value="pending">В ожидании</option>
            <option value="completed">Завершен</option>
            <option value="cancelled">Отменен</option>
          </select>
        </div>
      </div>
      {(searchQuery || filterStatus !== 'all') && (
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <span>Найдено проектов: {resultsCount}</span>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <Icon name="X" size={14} className="mr-1" />
            Сбросить фильтры
          </Button>
        </div>
      )}
    </Card>
  );
}
