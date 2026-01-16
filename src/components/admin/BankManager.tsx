import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  getBanks,
  createBank,
  updateBank,
  deleteBank,
  loadBanksFromAPI,
  searchBankByBIC,
  type Bank
} from '@/lib/bank-manager';

export default function BankManager() {
  const { toast } = useToast();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [showAddBank, setShowAddBank] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [newBank, setNewBank] = useState({
    bic: '',
    name: '',
    correspondentAccount: '',
    city: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await loadBanksFromAPI();
    setBanks(getBanks());
    setLoading(false);
  };

  const filteredBanks = banks.filter((bank) => {
    const searchLower = searchQuery.toLowerCase();
    return bank.bic.toLowerCase().includes(searchLower) ||
           bank.name.toLowerCase().includes(searchLower) ||
           bank.city.toLowerCase().includes(searchLower);
  });

  const handleAddBank = () => {
    if (!newBank.bic || !newBank.name) {
      toast({
        title: 'Ошибка',
        description: 'Заполните БИК и название банка',
        variant: 'destructive'
      });
      return;
    }

    const existing = searchBankByBIC(newBank.bic);
    if (existing) {
      toast({
        title: 'Ошибка',
        description: 'Банк с таким БИК уже существует',
        variant: 'destructive'
      });
      return;
    }

    createBank(newBank);
    setNewBank({
      bic: '',
      name: '',
      correspondentAccount: '',
      city: '',
      address: '',
      phone: ''
    });
    setShowAddBank(false);
    setBanks(getBanks());
    
    toast({
      title: 'Успех',
      description: 'Банк создан'
    });
  };

  const handleUpdateBank = () => {
    if (!editingBank) return;

    const success = updateBank(editingBank.id, {
      bic: editingBank.bic,
      name: editingBank.name,
      correspondentAccount: editingBank.correspondentAccount,
      city: editingBank.city,
      address: editingBank.address,
      phone: editingBank.phone
    });

    if (!success) {
      toast({
        title: 'Ошибка',
        description: 'Нельзя редактировать банки, загруженные из API',
        variant: 'destructive'
      });
      return;
    }

    setEditingBank(null);
    setBanks(getBanks());
    
    toast({
      title: 'Успех',
      description: 'Банк обновлен'
    });
  };

  const handleDeleteBank = (bankId: string) => {
    const bank = banks.find(b => b.id === bankId);
    if (bank?.source === 'api') {
      toast({
        title: 'Ошибка',
        description: 'Нельзя удалить банки, загруженные из API',
        variant: 'destructive'
      });
      return;
    }

    if (confirm('Удалить банк?')) {
      deleteBank(bankId);
      setBanks(getBanks());
      toast({
        title: 'Успех',
        description: 'Банк удален'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Справочник банков</h2>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" disabled={loading}>
            <Icon name="RefreshCw" size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Обновить из БИК
          </Button>
          <Button onClick={() => setShowAddBank(!showAddBank)}>
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить банк
          </Button>
        </div>
      </div>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-2">
          <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Автоматическая загрузка данных</p>
            <p className="text-blue-700">
              Справочник автоматически загружается из открытых источников Центробанка РФ при первом открытии. 
              Данные кэшируются на 24 часа. Вы можете добавлять свои банки вручную.
            </p>
          </div>
        </div>
      </Card>

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
              placeholder="Поиск по БИК, названию или городу..."
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
        {searchQuery && (
          <div className="mt-3 text-sm text-gray-600">
            Найдено банков: {filteredBanks.length}
          </div>
        )}
      </Card>

      {showAddBank && (
        <Card className="p-6 space-y-4 border-2 border-primary/20">
          <h3 className="font-semibold">Новый банк</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">БИК *</label>
              <Input
                value={newBank.bic}
                onChange={(e) => setNewBank({ ...newBank, bic: e.target.value })}
                placeholder="044525225"
                maxLength={9}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Название банка *</label>
              <Input
                value={newBank.name}
                onChange={(e) => setNewBank({ ...newBank, name: e.target.value })}
                placeholder="ПАО СБЕРБАНК"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Корреспондентский счет</label>
              <Input
                value={newBank.correspondentAccount}
                onChange={(e) => setNewBank({ ...newBank, correspondentAccount: e.target.value })}
                placeholder="30101810400000000225"
                maxLength={20}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Город</label>
              <Input
                value={newBank.city}
                onChange={(e) => setNewBank({ ...newBank, city: e.target.value })}
                placeholder="Москва"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Адрес</label>
              <Input
                value={newBank.address}
                onChange={(e) => setNewBank({ ...newBank, address: e.target.value })}
                placeholder="Полный адрес банка"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Телефон</label>
              <Input
                value={newBank.phone}
                onChange={(e) => setNewBank({ ...newBank, phone: e.target.value })}
                placeholder="+7 (495) 500-55-50"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddBank}>
              <Icon name="Check" size={16} className="mr-2" />
              Создать
            </Button>
            <Button variant="outline" onClick={() => setShowAddBank(false)}>
              Отмена
            </Button>
          </div>
        </Card>
      )}

      {editingBank && (
        <Card className="p-6 space-y-4 border-2 border-orange-500/30">
          <h3 className="font-semibold">Редактирование банка</h3>
          {editingBank.source === 'api' && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-900">
              <Icon name="AlertTriangle" size={16} className="inline mr-2" />
              Этот банк загружен из API и не может быть отредактирован
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">БИК *</label>
              <Input
                value={editingBank.bic}
                onChange={(e) => setEditingBank({ ...editingBank, bic: e.target.value })}
                placeholder="044525225"
                maxLength={9}
                disabled={editingBank.source === 'api'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Название банка *</label>
              <Input
                value={editingBank.name}
                onChange={(e) => setEditingBank({ ...editingBank, name: e.target.value })}
                placeholder="ПАО СБЕРБАНК"
                disabled={editingBank.source === 'api'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Корреспондентский счет</label>
              <Input
                value={editingBank.correspondentAccount}
                onChange={(e) => setEditingBank({ ...editingBank, correspondentAccount: e.target.value })}
                placeholder="30101810400000000225"
                maxLength={20}
                disabled={editingBank.source === 'api'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Город</label>
              <Input
                value={editingBank.city}
                onChange={(e) => setEditingBank({ ...editingBank, city: e.target.value })}
                placeholder="Москва"
                disabled={editingBank.source === 'api'}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Адрес</label>
              <Input
                value={editingBank.address}
                onChange={(e) => setEditingBank({ ...editingBank, address: e.target.value })}
                placeholder="Полный адрес банка"
                disabled={editingBank.source === 'api'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Телефон</label>
              <Input
                value={editingBank.phone}
                onChange={(e) => setEditingBank({ ...editingBank, phone: e.target.value })}
                placeholder="+7 (495) 500-55-50"
                disabled={editingBank.source === 'api'}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpdateBank} disabled={editingBank.source === 'api'}>
              <Icon name="Check" size={16} className="mr-2" />
              Сохранить
            </Button>
            <Button variant="outline" onClick={() => setEditingBank(null)}>
              Отмена
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {loading ? (
          <Card className="p-12 text-center">
            <Icon name="RefreshCw" size={48} className="mx-auto mb-4 opacity-20 animate-spin" />
            <p className="text-muted-foreground">Загрузка банков из БИК...</p>
          </Card>
        ) : filteredBanks.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="Building2" size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">
              {banks.length === 0 ? 'Нет банков. Нажмите "Обновить из БИК"' : 'Банки не найдены'}
            </p>
          </Card>
        ) : (
          filteredBanks.map((bank) => (
            <Card key={bank.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="Building2" size={20} className="text-gray-500" />
                    <h3 className="text-lg font-semibold">{bank.name}</h3>
                    {bank.source === 'api' && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                        Из БИК
                      </span>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">БИК:</span>
                      <span className="ml-2 font-medium">{bank.bic}</span>
                    </div>
                    {bank.correspondentAccount && (
                      <div>
                        <span className="text-gray-500">К/с:</span>
                        <span className="ml-2 font-mono text-xs">{bank.correspondentAccount}</span>
                      </div>
                    )}
                    {bank.city && (
                      <div>
                        <Icon name="MapPin" size={14} className="inline mr-1 text-gray-500" />
                        <span className="text-gray-600">{bank.city}</span>
                      </div>
                    )}
                    {bank.phone && (
                      <div>
                        <Icon name="Phone" size={14} className="inline mr-1 text-gray-500" />
                        <span className="text-gray-600">{bank.phone}</span>
                      </div>
                    )}
                  </div>
                  {bank.address && (
                    <div className="mt-2 pt-2 border-t text-sm text-gray-600">
                      <Icon name="MapPin" size={14} className="inline mr-1" />
                      {bank.address}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingBank(bank)}
                  >
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteBank(bank.id)}
                    disabled={bank.source === 'api'}
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
