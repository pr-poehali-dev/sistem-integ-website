import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import * as XLSX from 'xlsx';
import { createMaterial, getMaterials } from '@/lib/material-manager';
import { getUnits } from '@/lib/unit-manager';
import { useToast } from '@/hooks/use-toast';

interface ExcelRow {
  [key: string]: string | number | undefined;
}

export default function ExcelImport() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStats, setImportStats] = useState<{
    total: number;
    imported: number;
    skipped: number;
    errors: string[];
  } | null>(null);
  const { toast } = useToast();

  const findColumnIndex = (headers: string[], possibleNames: string[]): number => {
    const lowerHeaders = headers.map(h => String(h).toLowerCase().trim());
    for (const name of possibleNames) {
      const index = lowerHeaders.indexOf(name.toLowerCase());
      if (index !== -1) return index;
    }
    return -1;
  };

  const findUnitByName = (unitName: string | undefined): string | null => {
    if (!unitName) return null;
    const units = getUnits();
    const normalizedName = String(unitName).toLowerCase().trim();
    const unit = units.find(u => 
      u.name.toLowerCase() === normalizedName || 
      u.abbreviation.toLowerCase() === normalizedName
    );
    return unit?.id || null;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportStats(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as ExcelRow[];

      if (jsonData.length < 2) {
        toast({
          title: 'Ошибка',
          description: 'Файл должен содержать заголовки и данные',
          variant: 'destructive'
        });
        setIsProcessing(false);
        return;
      }

      const headers = jsonData[0] as string[];
      const rows = jsonData.slice(1);

      const codeIndex = findColumnIndex(headers, ['артикул', 'код', 'article', 'code']);
      const nameIndex = findColumnIndex(headers, ['наименование', 'название', 'name', 'title']);
      const unitIndex = findColumnIndex(headers, ['единица измерения', 'ед.изм', 'unit', 'единица']);
      const descIndex = findColumnIndex(headers, ['описание', 'description', 'desc']);
      const priceIndex = findColumnIndex(headers, ['цена', 'price', 'cost', 'стоимость']);

      if (codeIndex === -1 || nameIndex === -1) {
        toast({
          title: 'Ошибка формата',
          description: 'Файл должен содержать колонки "Артикул" и "Наименование"',
          variant: 'destructive'
        });
        setIsProcessing(false);
        return;
      }

      const existingMaterials = getMaterials();
      const existingCodes = new Set(existingMaterials.map(m => m.code.toLowerCase()));

      let imported = 0;
      let skipped = 0;
      const errors: string[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i] as (string | number | undefined)[];
        
        const code = String(row[codeIndex] || '').trim();
        const name = String(row[nameIndex] || '').trim();
        const unitName = row[unitIndex] ? String(row[unitIndex]).trim() : undefined;
        const description = descIndex !== -1 ? String(row[descIndex] || '').trim() : '';
        const priceStr = priceIndex !== -1 ? String(row[priceIndex] || '').trim() : '';

        if (!code || !name) {
          skipped++;
          continue;
        }

        if (existingCodes.has(code.toLowerCase())) {
          skipped++;
          errors.push(`Строка ${i + 2}: Артикул "${code}" уже существует`);
          continue;
        }

        const price = priceStr ? parseFloat(priceStr.replace(/[^\d.,]/g, '').replace(',', '.')) : null;
        const unitId = findUnitByName(unitName);

        try {
          createMaterial({
            type: 'material',
            code: code,
            articleNumber: code,
            name: name,
            description: description,
            unitId: unitId,
            price: price,
            manufacturer: '',
            notes: ''
          });
          imported++;
          existingCodes.add(code.toLowerCase());
        } catch (error) {
          skipped++;
          errors.push(`Строка ${i + 2}: Ошибка создания - ${error}`);
        }
      }

      setImportStats({
        total: rows.length,
        imported,
        skipped,
        errors
      });

      toast({
        title: 'Импорт завершен',
        description: `Импортировано: ${imported}, Пропущено: ${skipped}`
      });

    } catch (error) {
      toast({
        title: 'Ошибка чтения файла',
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Импорт из Excel</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Загрузите файл Excel с колонками: <strong>Артикул</strong>, <strong>Наименование</strong>, 
            Единица измерения, Описание, Цена
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={isProcessing}
            onClick={() => document.getElementById('excel-upload')?.click()}
          >
            <Icon name={isProcessing ? 'Loader2' : 'Upload'} size={16} className={`mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? 'Обработка...' : 'Выбрать файл Excel'}
          </Button>
          <input
            id="excel-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {importStats && (
          <Card className="p-4 bg-muted">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Всего строк:</span>
                <span className="text-sm">{importStats.total}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span className="text-sm font-medium">Импортировано:</span>
                <span className="text-sm font-semibold">{importStats.imported}</span>
              </div>
              <div className="flex justify-between text-orange-600">
                <span className="text-sm font-medium">Пропущено:</span>
                <span className="text-sm font-semibold">{importStats.skipped}</span>
              </div>
              
              {importStats.errors.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-red-600 mb-2">Ошибки:</p>
                  <div className="text-xs text-red-600 space-y-1 max-h-40 overflow-auto">
                    {importStats.errors.slice(0, 10).map((error, i) => (
                      <div key={i}>{error}</div>
                    ))}
                    {importStats.errors.length > 10 && (
                      <div className="font-medium">...и еще {importStats.errors.length - 10}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 mb-2">Требования к файлу:</p>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Формат файла: .xlsx или .xls</li>
            <li>Первая строка должна содержать заголовки колонок</li>
            <li>Обязательные колонки: "Артикул", "Наименование"</li>
            <li>Необязательные: "Единица измерения", "Описание", "Цена"</li>
            <li>Дубликаты артикулов будут пропущены</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
