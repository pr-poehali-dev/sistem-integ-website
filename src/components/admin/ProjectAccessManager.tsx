import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  getProjectAccessList,
  grantProjectAccess,
  revokeProjectAccess,
  type Project,
  type ProjectAccess
} from '@/lib/project-manager';
import { getUsers, type User, getCurrentUser } from '@/lib/user-manager';

interface Props {
  project: Project;
}

export default function ProjectAccessManager({ project }: Props) {
  const { toast } = useToast();
  const [accessList, setAccessList] = useState<ProjectAccess[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showAddAccess, setShowAddAccess] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<'read' | 'write' | 'admin'>('read');

  useEffect(() => {
    loadData();
  }, [project.id]);

  const loadData = () => {
    setAccessList(getProjectAccessList(project.id));
    setUsers(getUsers());
  };

  const handleGrantAccess = () => {
    if (!selectedUserId) {
      toast({
        title: 'Ошибка',
        description: 'Выберите пользователя',
        variant: 'destructive'
      });
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось определить текущего пользователя',
        variant: 'destructive'
      });
      return;
    }

    grantProjectAccess(project.id, selectedUserId, selectedAccessLevel, currentUser.id);
    loadData();
    setShowAddAccess(false);
    setSelectedUserId('');
    setSelectedAccessLevel('read');
    
    toast({
      title: 'Успех',
      description: 'Доступ предоставлен'
    });
  };

  const handleRevokeAccess = (userId: string) => {
    if (confirm('Отозвать доступ у пользователя?')) {
      revokeProjectAccess(project.id, userId);
      loadData();
      
      toast({
        title: 'Успех',
        description: 'Доступ отозван'
      });
    }
  };

  const getUserById = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  const getAvailableUsers = () => {
    const assignedUserIds = accessList.map(a => a.userId);
    return users.filter(u => !assignedUserIds.includes(u.id));
  };

  const getAccessLevelLabel = (level: string) => {
    switch (level) {
      case 'read': return 'Чтение';
      case 'write': return 'Редактирование';
      case 'admin': return 'Администратор';
      default: return level;
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'read': return 'text-blue-600 bg-blue-50';
      case 'write': return 'text-green-600 bg-green-50';
      case 'admin': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Icon name="Shield" size={24} className="text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">{project.title}</h3>
            <p className="text-sm text-gray-600">Управление доступами пользователей к проекту</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Пользователи с доступом ({accessList.length})
        </h3>
        <Button onClick={() => setShowAddAccess(!showAddAccess)}>
          <Icon name="UserPlus" size={16} className="mr-2" />
          Добавить доступ
        </Button>
      </div>

      {showAddAccess && (
        <Card className="p-6 space-y-4 border-2 border-primary/20">
          <h4 className="font-semibold">Предоставить доступ</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Пользователь *</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Выберите пользователя</option>
                {getAvailableUsers().map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Уровень доступа *</label>
              <select
                value={selectedAccessLevel}
                onChange={(e) => setSelectedAccessLevel(e.target.value as 'read' | 'write' | 'admin')}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="read">Чтение</option>
                <option value="write">Редактирование</option>
                <option value="admin">Администратор</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleGrantAccess}>
              <Icon name="Check" size={16} className="mr-2" />
              Предоставить
            </Button>
            <Button variant="outline" onClick={() => setShowAddAccess(false)}>
              Отмена
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {accessList.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="Users" size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Нет пользователей с доступом</p>
          </Card>
        ) : (
          <div className="overflow-hidden border rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Роль
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Уровень доступа
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата предоставления
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accessList.map((access) => {
                  const user = getUserById(access.userId);
                  if (!user) return null;

                  return (
                    <tr key={access.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <Icon name="User" size={20} className="text-orange-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(access.accessLevel)}`}>
                          {getAccessLevelLabel(access.accessLevel)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(access.grantedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevokeAccess(user.id)}
                        >
                          <Icon name="UserMinus" size={16} className="mr-1" />
                          Отозвать
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
