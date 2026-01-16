import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  getPersons,
  createPerson,
  updatePerson,
  deletePerson,
  type Person
} from '@/lib/person-manager';

export default function PersonManager() {
  const { toast } = useToast();
  const [persons, setPersons] = useState<Person[]>([]);
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPerson, setNewPerson] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    position: '',
    phone: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPersons(getPersons());
  };

  const filteredPersons = persons.filter((person) => {
    const searchLower = searchQuery.toLowerCase();
    return person.firstName.toLowerCase().includes(searchLower) ||
           person.lastName.toLowerCase().includes(searchLower) ||
           person.middleName.toLowerCase().includes(searchLower) ||
           person.position.toLowerCase().includes(searchLower) ||
           person.email.toLowerCase().includes(searchLower);
  });

  const handleAddPerson = () => {
    if (!newPerson.firstName || !newPerson.lastName) {
      toast({
        title: 'Ошибка',
        description: 'Заполните имя и фамилию',
        variant: 'destructive'
      });
      return;
    }

    createPerson(newPerson);
    setNewPerson({
      firstName: '',
      lastName: '',
      middleName: '',
      position: '',
      phone: '',
      email: '',
      notes: ''
    });
    setShowAddPerson(false);
    loadData();
    
    toast({
      title: 'Успех',
      description: 'Физическое лицо создано'
    });
  };

  const handleUpdatePerson = () => {
    if (!editingPerson) return;

    updatePerson(editingPerson.id, {
      firstName: editingPerson.firstName,
      lastName: editingPerson.lastName,
      middleName: editingPerson.middleName,
      position: editingPerson.position,
      phone: editingPerson.phone,
      email: editingPerson.email,
      notes: editingPerson.notes
    });

    setEditingPerson(null);
    loadData();
    
    toast({
      title: 'Успех',
      description: 'Физическое лицо обновлено'
    });
  };

  const handleDeletePerson = (personId: string) => {
    if (confirm('Удалить физическое лицо?')) {
      deletePerson(personId);
      loadData();
      toast({
        title: 'Успех',
        description: 'Физическое лицо удалено'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Справочник физических лиц</h2>
        <Button onClick={() => setShowAddPerson(!showAddPerson)}>
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить физическое лицо
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              <Icon name="Search" size={14} className="inline mr-1" />
              Поиск
            </label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по ФИО, должности, email..."
              className="w-full"
            />
          </div>
          {searchQuery && (
            <div className="pt-7">
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
                <Icon name="X" size={14} className="mr-1" />
                Сбросить
              </Button>
            </div>
          )}
        </div>
      </Card>

      {showAddPerson && (
        <Card className="p-6 space-y-4 border-2 border-primary/20">
          <h3 className="font-semibold">Новое физическое лицо</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Фамилия *</label>
              <Input
                value={newPerson.lastName}
                onChange={(e) => setNewPerson({ ...newPerson, lastName: e.target.value })}
                placeholder="Фамилия"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Имя *</label>
              <Input
                value={newPerson.firstName}
                onChange={(e) => setNewPerson({ ...newPerson, firstName: e.target.value })}
                placeholder="Имя"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Отчество</label>
              <Input
                value={newPerson.middleName}
                onChange={(e) => setNewPerson({ ...newPerson, middleName: e.target.value })}
                placeholder="Отчество"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Должность</label>
              <Input
                value={newPerson.position}
                onChange={(e) => setNewPerson({ ...newPerson, position: e.target.value })}
                placeholder="Должность"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Телефон</label>
              <Input
                value={newPerson.phone}
                onChange={(e) => setNewPerson({ ...newPerson, phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                value={newPerson.email}
                onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium mb-2">Примечания</label>
              <textarea
                value={newPerson.notes}
                onChange={(e) => setNewPerson({ ...newPerson, notes: e.target.value })}
                placeholder="Дополнительная информация"
                className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px]"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddPerson}>
              <Icon name="Check" size={16} className="mr-2" />
              Создать
            </Button>
            <Button variant="outline" onClick={() => setShowAddPerson(false)}>
              Отмена
            </Button>
          </div>
        </Card>
      )}

      {editingPerson && (
        <Card className="p-6 space-y-4 border-2 border-orange-500/30">
          <h3 className="font-semibold">Редактирование физического лица</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Фамилия *</label>
              <Input
                value={editingPerson.lastName}
                onChange={(e) => setEditingPerson({ ...editingPerson, lastName: e.target.value })}
                placeholder="Фамилия"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Имя *</label>
              <Input
                value={editingPerson.firstName}
                onChange={(e) => setEditingPerson({ ...editingPerson, firstName: e.target.value })}
                placeholder="Имя"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Отчество</label>
              <Input
                value={editingPerson.middleName}
                onChange={(e) => setEditingPerson({ ...editingPerson, middleName: e.target.value })}
                placeholder="Отчество"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Должность</label>
              <Input
                value={editingPerson.position}
                onChange={(e) => setEditingPerson({ ...editingPerson, position: e.target.value })}
                placeholder="Должность"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Телефон</label>
              <Input
                value={editingPerson.phone}
                onChange={(e) => setEditingPerson({ ...editingPerson, phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                value={editingPerson.email}
                onChange={(e) => setEditingPerson({ ...editingPerson, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium mb-2">Примечания</label>
              <textarea
                value={editingPerson.notes}
                onChange={(e) => setEditingPerson({ ...editingPerson, notes: e.target.value })}
                placeholder="Дополнительная информация"
                className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px]"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpdatePerson}>
              <Icon name="Check" size={16} className="mr-2" />
              Сохранить
            </Button>
            <Button variant="outline" onClick={() => setEditingPerson(null)}>
              Отмена
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredPersons.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="Users" size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">
              {persons.length === 0 ? 'Нет физических лиц' : 'Физические лица не найдены'}
            </p>
          </Card>
        ) : (
          filteredPersons.map((person) => (
            <Card key={person.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="User" size={20} className="text-gray-500" />
                    <h3 className="text-lg font-semibold">
                      {person.lastName} {person.firstName} {person.middleName}
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    {person.position && (
                      <div>
                        <Icon name="Briefcase" size={14} className="inline mr-1 text-gray-500" />
                        <span className="text-gray-600">{person.position}</span>
                      </div>
                    )}
                    {person.phone && (
                      <div>
                        <Icon name="Phone" size={14} className="inline mr-1 text-gray-500" />
                        <span className="text-gray-600">{person.phone}</span>
                      </div>
                    )}
                    {person.email && (
                      <div>
                        <Icon name="Mail" size={14} className="inline mr-1 text-gray-500" />
                        <span className="text-gray-600">{person.email}</span>
                      </div>
                    )}
                  </div>
                  {person.notes && (
                    <div className="mt-2 pt-2 border-t text-sm text-gray-600">
                      {person.notes}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingPerson(person)}
                  >
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeletePerson(person.id)}
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
