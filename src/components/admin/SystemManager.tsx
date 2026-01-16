import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  getSystems,
  getSystemsByProject,
  createSystem,
  updateSystem,
  deleteSystem,
  type System,
  type Project
} from '@/lib/project-manager';
import { getPersons, getPersonFullName, type Person } from '@/lib/person-manager';

interface Props {
  project: Project;
}

export default function SystemManager({ project }: Props) {
  const { toast } = useToast();
  const [systems, setSystems] = useState<System[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [showAddSystem, setShowAddSystem] = useState(false);
  const [editingSystem, setEditingSystem] = useState<System | null>(null);
  const [newSystem, setNewSystem] = useState({
    name: '',
    description: '',
    type: '',
    status: 'active' as const,
    clientCuratorId: ''
  });

  useEffect(() => {
    loadData();
  }, [project.id]);

  const loadData = () => {
    setSystems(getSystemsByProject(project.id));
    setPersons(getPersons());
  };

  const handleAddSystem = () => {
    if (!newSystem.name) {
      toast({
        title: 'Ошибка',
        description: 'Заполните название системы',
        variant: 'destructive'
      });
      return;
    }

    createSystem({
      projectId: project.id,
      name: newSystem.name,
      description: newSystem.description,
      type: newSystem.type,
      status: newSystem.status,
      clientCuratorId: newSystem.clientCuratorId || null
    });

    setNewSystem({
      name: '',
      description: '',
      type: '',
      status: 'active',
      clientCuratorId: ''
    });
    setShowAddSystem(false);
    loadData();
    
    toast({
      title: 'Успех',
      description: 'Система создана'
    });
  };

  const handleUpdateSystem = () => {
    if (!editingSystem) return;

    updateSystem(editingSystem.id, {
      name: editingSystem.name,
      description: editingSystem.description,
      type: editingSystem.type,
      status: editingSystem.status,
      clientCuratorId: editingSystem.clientCuratorId
    });

    setEditingSystem(null);
    loadData();
    
    toast({
      title: 'Успех',
      description: 'Система обновлена'
    });
  };

  const handleDeleteSystem = (systemId: string) => {
    if (confirm('Удалить систему?')) {
      deleteSystem(systemId);
      loadData();
      toast({
        title: 'Успех',
        description: 'Система удалена'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      case 'development': return 'text-blue-600 bg-blue-50';
      case 'maintenance': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Активна';
      case 'inactive': return 'Неактивна';
      case 'development': return 'В разработке';
      case 'maintenance': return 'На обслуживании';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Системы проекта ({systems.length})
        </h3>
        <Button onClick={() => setShowAddSystem(!showAddSystem)} size="sm">
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить систему
        </Button>
      </div>

      {showAddSystem && (
        <Card className="p-6 space-y-4 border-2 border-primary/20">
          <h4 className="font-semibold">Новая система</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Название системы *</label>
              <Input
                value={newSystem.name}
                onChange={(e) => setNewSystem({ ...newSystem, name: e.target.value })}
                placeholder="Название системы"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                value={newSystem.description}
                onChange={(e) => setNewSystem({ ...newSystem, description: e.target.value })}
                placeholder="Описание системы"
                className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Тип системы</label>
              <Input
                value={newSystem.type}
                onChange={(e) => setNewSystem({ ...newSystem, type: e.target.value })}
                placeholder="Например: CRM, ERP, 1C"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Статус</label>
              <select
                value={newSystem.status}
                onChange={(e) => setNewSystem({ ...newSystem, status: e.target.value as 'active' | 'inactive' | 'development' | 'maintenance' })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="active">Активна</option>
                <option value="inactive">Неактивна</option>
                <option value="development">В разработке</option>
                <option value="maintenance">На обслуживании</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Куратор со стороны заказчика</label>
              <select
                value={newSystem.clientCuratorId}
                onChange={(e) => setNewSystem({ ...newSystem, clientCuratorId: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Не выбран</option>
                {persons.map((person) => (
                  <option key={person.id} value={person.id}>
                    {getPersonFullName(person.id)} {person.position ? `— ${person.position}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddSystem}>
              <Icon name="Check" size={16} className="mr-2" />
              Создать
            </Button>
            <Button variant="outline" onClick={() => setShowAddSystem(false)}>
              Отмена
            </Button>
          </div>
        </Card>
      )}

      {editingSystem && (
        <Card className="p-6 space-y-4 border-2 border-orange-500/30">
          <h4 className="font-semibold">Редактирование системы</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Название системы *</label>
              <Input
                value={editingSystem.name}
                onChange={(e) => setEditingSystem({ ...editingSystem, name: e.target.value })}
                placeholder="Название системы"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                value={editingSystem.description}
                onChange={(e) => setEditingSystem({ ...editingSystem, description: e.target.value })}
                placeholder="Описание системы"
                className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Тип системы</label>
              <Input
                value={editingSystem.type}
                onChange={(e) => setEditingSystem({ ...editingSystem, type: e.target.value })}
                placeholder="Например: CRM, ERP, 1C"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Статус</label>
              <select
                value={editingSystem.status}
                onChange={(e) => setEditingSystem({ ...editingSystem, status: e.target.value as 'active' | 'inactive' | 'development' | 'maintenance' })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="active">Активна</option>
                <option value="inactive">Неактивна</option>
                <option value="development">В разработке</option>
                <option value="maintenance">На обслуживании</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Куратор со стороны заказчика</label>
              <select
                value={editingSystem.clientCuratorId || ''}
                onChange={(e) => setEditingSystem({ ...editingSystem, clientCuratorId: e.target.value || null })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Не выбран</option>
                {persons.map((person) => (
                  <option key={person.id} value={person.id}>
                    {getPersonFullName(person.id)} {person.position ? `— ${person.position}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpdateSystem}>
              <Icon name="Check" size={16} className="mr-2" />
              Сохранить
            </Button>
            <Button variant="outline" onClick={() => setEditingSystem(null)}>
              Отмена
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {systems.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="Server" size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Нет систем в проекте</p>
          </Card>
        ) : (
          systems.map((system) => (
            <Card key={system.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold">{system.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(system.status)}`}>
                      {getStatusLabel(system.status)}
                    </span>
                    {system.type && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {system.type}
                      </span>
                    )}
                  </div>
                  {system.description && (
                    <p className="text-sm text-muted-foreground mb-3">{system.description}</p>
                  )}
                  {system.clientCuratorId && (
                    <div className="text-sm text-gray-600">
                      <Icon name="UserCheck" size={14} className="inline mr-1" />
                      <span className="font-medium">Куратор заказчика:</span> {getPersonFullName(system.clientCuratorId)}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSystem(system)}
                  >
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSystem(system.id)}
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
