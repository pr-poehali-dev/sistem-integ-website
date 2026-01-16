import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  getLegalEntities,
  createLegalEntity,
  updateLegalEntity,
  deleteLegalEntity,
  getProjectsByLegalEntity,
  type LegalEntity
} from '@/lib/project-manager';

export default function LegalEntityManager() {
  const { toast } = useToast();
  const [entities, setEntities] = useState<LegalEntity[]>([]);
  const [showAddEntity, setShowAddEntity] = useState(false);
  const [editingEntity, setEditingEntity] = useState<LegalEntity | null>(null);
  const [newEntity, setNewEntity] = useState({
    name: '',
    inn: '',
    kpp: '',
    ogrn: '',
    legalAddress: '',
    actualAddress: '',
    directorName: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setEntities(getLegalEntities());
  };

  const handleAddEntity = () => {
    if (!newEntity.name || !newEntity.inn) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля: название и ИНН',
        variant: 'destructive'
      });
      return;
    }

    createLegalEntity({
      name: newEntity.name,
      inn: newEntity.inn,
      kpp: newEntity.kpp,
      ogrn: newEntity.ogrn,
      legalAddress: newEntity.legalAddress,
      actualAddress: newEntity.actualAddress,
      directorName: newEntity.directorName,
      phone: newEntity.phone,
      email: newEntity.email
    });

    setNewEntity({
      name: '',
      inn: '',
      kpp: '',
      ogrn: '',
      legalAddress: '',
      actualAddress: '',
      directorName: '',
      phone: '',
      email: ''
    });
    setShowAddEntity(false);
    loadData();
    
    toast({
      title: 'Успех',
      description: 'Юридическое лицо создано'
    });
  };

  const handleUpdateEntity = () => {
    if (!editingEntity) return;

    updateLegalEntity(editingEntity.id, {
      name: editingEntity.name,
      inn: editingEntity.inn,
      kpp: editingEntity.kpp,
      ogrn: editingEntity.ogrn,
      legalAddress: editingEntity.legalAddress,
      actualAddress: editingEntity.actualAddress,
      directorName: editingEntity.directorName,
      phone: editingEntity.phone,
      email: editingEntity.email
    });

    setEditingEntity(null);
    loadData();
    
    toast({
      title: 'Успех',
      description: 'Юридическое лицо обновлено'
    });
  };

  const handleDeleteEntity = (entityId: string) => {
    const projects = getProjectsByLegalEntity(entityId);
    
    if (projects.length > 0) {
      if (!confirm(`К этому юрлицу привязано проектов: ${projects.length}. При удалении связь с проектами будет разорвана. Продолжить?`)) {
        return;
      }
    }
    
    if (confirm('Удалить юридическое лицо?')) {
      deleteLegalEntity(entityId);
      loadData();
      toast({
        title: 'Успех',
        description: 'Юридическое лицо удалено'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Юридические лица</h2>
        <Button onClick={() => setShowAddEntity(!showAddEntity)}>
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить юрлицо
        </Button>
      </div>

      {showAddEntity && (
        <Card className="p-6 space-y-4 border-2 border-primary/20">
          <h3 className="font-semibold">Новое юридическое лицо</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Название *</label>
              <Input
                value={newEntity.name}
                onChange={(e) => setNewEntity({ ...newEntity, name: e.target.value })}
                placeholder="ООО «Компания»"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ИНН *</label>
              <Input
                value={newEntity.inn}
                onChange={(e) => setNewEntity({ ...newEntity, inn: e.target.value })}
                placeholder="1234567890"
                maxLength={12}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">КПП</label>
              <Input
                value={newEntity.kpp}
                onChange={(e) => setNewEntity({ ...newEntity, kpp: e.target.value })}
                placeholder="123456789"
                maxLength={9}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ОГРН</label>
              <Input
                value={newEntity.ogrn}
                onChange={(e) => setNewEntity({ ...newEntity, ogrn: e.target.value })}
                placeholder="1234567890123"
                maxLength={15}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Директор</label>
              <Input
                value={newEntity.directorName}
                onChange={(e) => setNewEntity({ ...newEntity, directorName: e.target.value })}
                placeholder="Иванов Иван Иванович"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Телефон</label>
              <Input
                value={newEntity.phone}
                onChange={(e) => setNewEntity({ ...newEntity, phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={newEntity.email}
                onChange={(e) => setNewEntity({ ...newEntity, email: e.target.value })}
                placeholder="info@company.ru"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Юридический адрес</label>
              <Input
                value={newEntity.legalAddress}
                onChange={(e) => setNewEntity({ ...newEntity, legalAddress: e.target.value })}
                placeholder="г. Москва, ул. ..."
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Фактический адрес</label>
              <Input
                value={newEntity.actualAddress}
                onChange={(e) => setNewEntity({ ...newEntity, actualAddress: e.target.value })}
                placeholder="г. Москва, ул. ..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddEntity}>
              <Icon name="Check" size={16} className="mr-2" />
              Создать
            </Button>
            <Button variant="outline" onClick={() => setShowAddEntity(false)}>
              Отмена
            </Button>
          </div>
        </Card>
      )}

      {editingEntity && (
        <Card className="p-6 space-y-4 border-2 border-orange-500/30">
          <h3 className="font-semibold">Редактирование юридического лица</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Название *</label>
              <Input
                value={editingEntity.name}
                onChange={(e) => setEditingEntity({ ...editingEntity, name: e.target.value })}
                placeholder="ООО «Компания»"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ИНН *</label>
              <Input
                value={editingEntity.inn}
                onChange={(e) => setEditingEntity({ ...editingEntity, inn: e.target.value })}
                placeholder="1234567890"
                maxLength={12}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">КПП</label>
              <Input
                value={editingEntity.kpp}
                onChange={(e) => setEditingEntity({ ...editingEntity, kpp: e.target.value })}
                placeholder="123456789"
                maxLength={9}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ОГРН</label>
              <Input
                value={editingEntity.ogrn}
                onChange={(e) => setEditingEntity({ ...editingEntity, ogrn: e.target.value })}
                placeholder="1234567890123"
                maxLength={15}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Директор</label>
              <Input
                value={editingEntity.directorName}
                onChange={(e) => setEditingEntity({ ...editingEntity, directorName: e.target.value })}
                placeholder="Иванов Иван Иванович"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Телефон</label>
              <Input
                value={editingEntity.phone}
                onChange={(e) => setEditingEntity({ ...editingEntity, phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={editingEntity.email}
                onChange={(e) => setEditingEntity({ ...editingEntity, email: e.target.value })}
                placeholder="info@company.ru"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Юридический адрес</label>
              <Input
                value={editingEntity.legalAddress}
                onChange={(e) => setEditingEntity({ ...editingEntity, legalAddress: e.target.value })}
                placeholder="г. Москва, ул. ..."
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Фактический адрес</label>
              <Input
                value={editingEntity.actualAddress}
                onChange={(e) => setEditingEntity({ ...editingEntity, actualAddress: e.target.value })}
                placeholder="г. Москва, ул. ..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpdateEntity}>
              <Icon name="Check" size={16} className="mr-2" />
              Сохранить
            </Button>
            <Button variant="outline" onClick={() => setEditingEntity(null)}>
              Отмена
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {entities.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="Building2" size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Нет юридических лиц</p>
          </Card>
        ) : (
          entities.map((entity) => {
            const projects = getProjectsByLegalEntity(entity.id);
            
            return (
              <Card key={entity.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold">{entity.name}</h4>
                      {projects.length > 0 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                          {projects.length} {projects.length === 1 ? 'проект' : 'проектов'}
                        </span>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">ИНН:</span>
                        <span className="ml-2 font-medium">{entity.inn}</span>
                      </div>
                      {entity.kpp && (
                        <div>
                          <span className="text-gray-500">КПП:</span>
                          <span className="ml-2 font-medium">{entity.kpp}</span>
                        </div>
                      )}
                      {entity.ogrn && (
                        <div>
                          <span className="text-gray-500">ОГРН:</span>
                          <span className="ml-2 font-medium">{entity.ogrn}</span>
                        </div>
                      )}
                      {entity.directorName && (
                        <div>
                          <span className="text-gray-500">Директор:</span>
                          <span className="ml-2 font-medium">{entity.directorName}</span>
                        </div>
                      )}
                      {entity.phone && (
                        <div>
                          <span className="text-gray-500">Телефон:</span>
                          <span className="ml-2 font-medium">{entity.phone}</span>
                        </div>
                      )}
                      {entity.email && (
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <span className="ml-2 font-medium">{entity.email}</span>
                        </div>
                      )}
                      {entity.legalAddress && (
                        <div className="col-span-2">
                          <span className="text-gray-500">Юр. адрес:</span>
                          <span className="ml-2">{entity.legalAddress}</span>
                        </div>
                      )}
                      {entity.actualAddress && (
                        <div className="col-span-2">
                          <span className="text-gray-500">Факт. адрес:</span>
                          <span className="ml-2">{entity.actualAddress}</span>
                        </div>
                      )}
                    </div>
                    
                    {projects.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          <Icon name="FolderOpen" size={14} className="inline mr-1" />
                          Используется в проектах:
                        </p>
                        <div className="space-y-1">
                          {projects.map((project) => (
                            <div key={project.id} className="text-sm text-gray-600 pl-5">
                              • {project.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingEntity(entity)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEntity(entity.id)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
