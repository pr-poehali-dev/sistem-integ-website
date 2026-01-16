import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface LegalEntity {
  id: number;
  name: string;
  inn: string;
  kpp: string;
  ogrn: string;
  legalAddress: string;
  actualAddress: string;
  directorName: string;
  phone: string;
  email: string;
}

export default function LegalEntityManager() {
  const { toast } = useToast();
  const [entities, setEntities] = useState<LegalEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddEntity, setShowAddEntity] = useState(false);
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
    loadEntities();
  }, []);

  const loadEntities = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/TODO_LEGAL_ENTITY_LIST_URL');
      if (response.ok) {
        const data = await response.json();
        setEntities(data.entities || []);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить юридические лица',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntity = async () => {
    if (!newEntity.name || !newEntity.inn) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля: название и ИНН',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'В разработке',
      description: 'Функция добавления юрлиц будет доступна после создания backend API'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader" size={48} className="animate-spin text-orange-600" />
      </div>
    );
  }

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

      <div className="grid gap-4">
        {entities.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="Building2" size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Нет юридических лиц</p>
          </Card>
        ) : (
          entities.map((entity) => (
            <Card key={entity.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{entity.name}</h3>
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
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button variant="destructive" size="sm">
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
