import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import type { Estimate } from '@/lib/estimate-manager';
import type { Project } from '@/lib/project-manager';

type SortField = 'number' | 'date' | 'name' | 'project' | 'items' | 'total';
type SortDirection = 'asc' | 'desc';

interface EstimateTableProps {
  estimates: Estimate[];
  totalEstimates: number;
  projects: Project[];
  searchQuery: string;
  filterProjectId: string;
  filterDateFrom: string;
  filterDateTo: string;
  onSearchChange: (query: string) => void;
  onFilterProjectChange: (projectId: string) => void;
  onFilterDateFromChange: (date: string) => void;
  onFilterDateToChange: (date: string) => void;
  onResetFilters: () => void;
  onEdit: (estimate: Estimate) => void;
  onDelete: (estimateId: string) => void;
  getProjectName: (projectId: string | null) => string;
}

export default function EstimateTable({
  estimates,
  totalEstimates,
  projects,
  searchQuery,
  filterProjectId,
  filterDateFrom,
  filterDateTo,
  onSearchChange,
  onFilterProjectChange,
  onFilterDateFromChange,
  onFilterDateToChange,
  onResetFilters,
  onEdit,
  onDelete,
  getProjectName
}: EstimateTableProps) {
  const hasActiveFilters = searchQuery || filterProjectId !== 'all' || filterDateFrom || filterDateTo;
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEstimates = [...estimates].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'number':
        comparison = a.number.localeCompare(b.number);
        break;
      case 'date':
        comparison = a.date - b.date;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'project':
        comparison = getProjectName(a.projectId).localeCompare(getProjectName(b.projectId));
        break;
      case 'items':
        comparison = a.items.length - b.items.length;
        break;
      case 'total':
        comparison = a.totalCost - b.totalCost;
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <Icon name="ArrowUpDown" size={14} className="ml-1 opacity-30" />;
    }
    return sortDirection === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="ml-1" />
      : <Icon name="ArrowDown" size={14} className="ml-1" />;
  };

  return (
    <>
      <Card className="p-4">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Icon name="Search" size={14} className="inline mr-1" />
                Поиск
              </label>
              <Input
                placeholder="Номер, название..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Icon name="FolderOpen" size={14} className="inline mr-1" />
                Проект
              </label>
              <select
                value={filterProjectId}
                onChange={(e) => onFilterProjectChange(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="all">Все проекты</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Icon name="Calendar" size={14} className="inline mr-1" />
                Дата с
              </label>
              <Input
                type="date"
                value={filterDateFrom}
                onChange={(e) => onFilterDateFromChange(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Icon name="Calendar" size={14} className="inline mr-1" />
                Дата по
              </label>
              <Input
                type="date"
                value={filterDateTo}
                onChange={(e) => onFilterDateToChange(e.target.value)}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onResetFilters}
              >
                <Icon name="X" size={14} className="mr-1" />
                Сбросить фильтры
              </Button>
              <span className="text-sm text-muted-foreground">
                Найдено: {estimates.length} из {totalEstimates}
              </span>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <CardContent className="p-0">
          {sortedEstimates.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Нет сметных расчетов</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted">
                    <th 
                      className="text-left p-4 font-semibold cursor-pointer hover:bg-muted-foreground/10 transition-colors"
                      onClick={() => handleSort('number')}
                    >
                      <div className="flex items-center">
                        Номер
                        <SortIcon field="number" />
                      </div>
                    </th>
                    <th 
                      className="text-left p-4 font-semibold cursor-pointer hover:bg-muted-foreground/10 transition-colors"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        Дата
                        <SortIcon field="date" />
                      </div>
                    </th>
                    <th 
                      className="text-left p-4 font-semibold cursor-pointer hover:bg-muted-foreground/10 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Название
                        <SortIcon field="name" />
                      </div>
                    </th>
                    <th 
                      className="text-left p-4 font-semibold cursor-pointer hover:bg-muted-foreground/10 transition-colors"
                      onClick={() => handleSort('project')}
                    >
                      <div className="flex items-center">
                        Проект
                        <SortIcon field="project" />
                      </div>
                    </th>
                    <th 
                      className="text-center p-4 font-semibold cursor-pointer hover:bg-muted-foreground/10 transition-colors"
                      onClick={() => handleSort('items')}
                    >
                      <div className="flex items-center justify-center">
                        Позиций
                        <SortIcon field="items" />
                      </div>
                    </th>
                    <th 
                      className="text-right p-4 font-semibold cursor-pointer hover:bg-muted-foreground/10 transition-colors"
                      onClick={() => handleSort('total')}
                    >
                      <div className="flex items-center justify-end">
                        Сумма, ₽
                        <SortIcon field="total" />
                      </div>
                    </th>
                    <th className="text-center p-4 font-semibold">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEstimates.map((estimate) => (
                    <tr key={estimate.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-mono font-semibold">{estimate.number}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(estimate.date).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="p-4">{estimate.name}</td>
                      <td className="p-4 text-sm">{getProjectName(estimate.projectId)}</td>
                      <td className="p-4 text-center">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {estimate.items.length}
                        </span>
                      </td>
                      <td className="p-4 text-right font-semibold">
                        {estimate.totalCost.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(estimate)}
                          >
                            <Icon name="Edit" size={14} className="mr-1" />
                            Редактировать
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(estimate.id)}
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted font-semibold">
                    <td colSpan={4} className="p-4 text-right">Всего смет: {sortedEstimates.length}</td>
                    <td className="p-4 text-center">
                      {sortedEstimates.reduce((sum, est) => sum + est.items.length, 0)}
                    </td>
                    <td className="p-4 text-right">
                      {sortedEstimates.reduce((sum, est) => sum + est.totalCost, 0).toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}