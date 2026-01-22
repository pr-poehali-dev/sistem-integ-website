import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import {
  calculateSAPS,
  type CalculatorSAPSInput,
  type CalculatorResult
} from '@/lib/calculator-manager';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalculatorModal({ isOpen, onClose }: CalculatorModalProps) {
  const [input, setInput] = useState<CalculatorSAPSInput>({
    roomArea: 0,
    roomCount: 0,
    corridorArea: 0
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleCalculate = () => {
    try {
      const calculatedResult = calculateSAPS(input);
      setResult(calculatedResult);
      setShowResult(true);
    } catch (error) {
      console.error('Ошибка расчета:', error);
    }
  };

  const handleReset = () => {
    setInput({
      roomArea: 0,
      roomCount: 0,
      corridorArea: 0
    });
    setShowResult(false);
    setResult(null);
  };

  const isFormValid = input.roomArea > 0 || input.roomCount > 0 || input.corridorArea > 0;

  useEffect(() => {
    if (isFormValid && showResult) {
      handleCalculate();
    }
  }, [input]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background border-b z-10 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Icon name="Calculator" size={28} className="text-orange-600" />
            Калькулятор стоимости САПС
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={24} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Система автоматической пожарной сигнализации
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Площадь помещений (м²) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={input.roomArea || ''}
                    onChange={(e) => setInput({ ...input, roomArea: parseFloat(e.target.value) || 0 })}
                    placeholder="Введите площадь"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Количество помещений *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={input.roomCount || ''}
                    onChange={(e) => setInput({ ...input, roomCount: parseInt(e.target.value) || 0 })}
                    placeholder="Введите количество"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Площадь коридора (м²) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={input.corridorArea || ''}
                    onChange={(e) => setInput({ ...input, corridorArea: parseFloat(e.target.value) || 0 })}
                    placeholder="Введите площадь"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleCalculate}
                  disabled={!isFormValid}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Icon name="Calculator" size={16} className="mr-2" />
                  Рассчитать стоимость
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <Icon name="RotateCcw" size={16} className="mr-2" />
                  Сбросить
                </Button>
              </div>
            </CardContent>
          </Card>

          {showResult && result && (
            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Icon name="Receipt" size={24} />
                  Результат расчета
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-muted-foreground">Стоимость за помещения ({input.roomCount} шт.)</span>
                    <span className="font-semibold">{result.breakdown.roomCost.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-muted-foreground">Стоимость за площадь помещений ({input.roomArea} м²)</span>
                    <span className="font-semibold">{result.breakdown.roomAreaCost.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-muted-foreground">Стоимость за площадь коридора ({input.corridorArea} м²)</span>
                    <span className="font-semibold">{result.breakdown.corridorCost.toLocaleString()} ₽</span>
                  </div>
                </div>

                <div className="border-t-2 border-orange-200 pt-4">
                  <div className="flex justify-between items-center p-4 bg-orange-100 rounded-lg">
                    <span className="text-lg font-bold text-orange-900">ИТОГО:</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {result.totalCost.toLocaleString()} ₽
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                    <div className="text-blue-900 space-y-1">
                      <p className="font-semibold">Примененные тарифы:</p>
                      <p>• За помещение: {result.settings.pricePerRoom.toLocaleString()} ₽</p>
                      <p>• За м² помещения: {result.settings.pricePerRoomArea.toLocaleString()} ₽</p>
                      <p>• За м² коридора: {result.settings.pricePerCorridorArea.toLocaleString()} ₽</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
