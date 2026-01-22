import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  getCalculatorSettings,
  updateCalculatorSettings,
  SYSTEM_CODES,
  type SystemCalculatorSettings
} from '@/lib/calculator-manager';

export default function CalculatorSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemCalculatorSettings[]>([]);
  const [editingSystem, setEditingSystem] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SystemCalculatorSettings>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    setSettings(getCalculatorSettings());
  };

  const handleEdit = (system: SystemCalculatorSettings) => {
    setEditingSystem(system.systemCode);
    setEditData(system);
  };

  const handleSave = () => {
    if (!editingSystem) return;

    updateCalculatorSettings(editingSystem, editData);
    
    toast({
      title: 'Успешно',
      description: 'Настройки калькулятора обновлены',
    });

    setEditingSystem(null);
    setEditData({});
    loadSettings();
  };

  const handleCancel = () => {
    setEditingSystem(null);
    setEditData({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Настройки калькуляторов</h2>
          <p className="text-muted-foreground">Управление коэффициентами расчета стоимости систем</p>
        </div>
      </div>

      <div className="grid gap-4">
        {settings.map(system => (
          <Card key={system.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{system.systemName}</span>
                {editingSystem !== system.systemCode && (
                  <Button size="sm" onClick={() => handleEdit(system)}>
                    <Icon name="Settings" size={16} className="mr-2" />
                    Изменить
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingSystem === system.systemCode ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Стоимость за помещение (₽)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editData.pricePerRoom || 0}
                        onChange={(e) => setEditData({ ...editData, pricePerRoom: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Стоимость за м² помещения (₽)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editData.pricePerRoomArea || 0}
                        onChange={(e) => setEditData({ ...editData, pricePerRoomArea: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Стоимость за м² коридора (₽)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editData.pricePerCorridorArea || 0}
                        onChange={(e) => setEditData({ ...editData, pricePerCorridorArea: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Icon name="Check" size={16} className="mr-2" />
                      Сохранить
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <Icon name="X" size={16} className="mr-2" />
                      Отмена
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Стоимость за помещение</div>
                    <div className="text-lg font-semibold">{system.pricePerRoom.toLocaleString()} ₽</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Стоимость за м² помещения</div>
                    <div className="text-lg font-semibold">{system.pricePerRoomArea.toLocaleString()} ₽</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Стоимость за м² коридора</div>
                    <div className="text-lg font-semibold">{system.pricePerCorridorArea.toLocaleString()} ₽</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Формула расчета САПС:</p>
              <p className="font-mono text-xs bg-white/50 p-2 rounded">
                Итого = (Количество помещений × Стоимость за помещение) + 
                (Площадь помещений × Стоимость за м²) + 
                (Площадь коридора × Стоимость за м² коридора)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
