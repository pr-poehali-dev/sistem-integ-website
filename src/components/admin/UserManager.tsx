import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { getUsers, createUser, deleteUser, toggleUserActive, updateUser, type User } from '@/lib/user-manager';

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '', role: 'editor' as 'admin' | 'editor' | 'client' | 'employee' });
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(getUsers());
  };

  const handleAddUser = () => {
    if (!newUser.email || !newUser.password || !newUser.name) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    const user = createUser(newUser.email, newUser.password, newUser.name, newUser.role);
    
    if (user) {
      toast({
        title: 'Успешно',
        description: `Пользователь ${user.name} создан`
      });
      setNewUser({ email: '', password: '', name: '', role: 'editor' });
      setShowAddUser(false);
      loadUsers();
    } else {
      toast({
        title: 'Ошибка',
        description: 'Пользователь с таким email уже существует',
        variant: 'destructive'
      });
    }
  };

  const handleToggleActive = (userId: string, userName: string) => {
    toggleUserActive(userId);
    loadUsers();
    toast({
      title: 'Статус изменен',
      description: `Пользователь ${userName} ${users.find(u => u.id === userId)?.isActive ? 'деактивирован' : 'активирован'}`
    });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (!confirm(`Удалить пользователя ${userName}?`)) {
      return;
    }

    if (deleteUser(userId)) {
      toast({
        title: 'Удалено',
        description: `Пользователь ${userName} удален`
      });
      loadUsers();
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ru-RU');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление пользователями</h2>
        <Button onClick={() => setShowAddUser(!showAddUser)}>
          <Icon name="UserPlus" size={16} className="mr-2" />
          Добавить пользователя
        </Button>
      </div>

      {showAddUser && (
        <Card className="p-6 space-y-4 border-2 border-primary/20">
          <h3 className="font-semibold">Новый пользователь</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Имя</label>
              <Input
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Иван Иванов"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Минимум 6 символов"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Роль</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'editor' | 'client' | 'employee' })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="editor">Редактор</option>
                <option value="admin">Администратор</option>
                <option value="client">Клиент</option>
                <option value="employee">Сотрудник</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddUser}>
              <Icon name="Check" size={16} className="mr-2" />
              Создать
            </Button>
            <Button variant="outline" onClick={() => setShowAddUser(false)}>
              Отмена
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className={`p-6 ${!user.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'admin' ? 'bg-red-100 text-red-700' : 
                    user.role === 'client' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'employee' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role === 'admin' ? 'Администратор' : 
                     user.role === 'client' ? 'Клиент' :
                     user.role === 'employee' ? 'Сотрудник' : 
                     'Редактор'}
                  </span>
                  {!user.isActive && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      Деактивирован
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  <Icon name="Mail" size={14} className="inline mr-1" />
                  {user.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  Создан: {formatDate(user.createdAt)}
                  {user.lastLogin && ` • Последний вход: ${formatDate(user.lastLogin)}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(user.id, user.name)}
                >
                  <Icon name={user.isActive ? 'UserX' : 'UserCheck'} size={16} />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id, user.name)}
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {users.length === 0 && (
          <Card className="p-12 text-center">
            <Icon name="Users" size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Нет пользователей</p>
          </Card>
        )}
      </div>
    </div>
  );
}