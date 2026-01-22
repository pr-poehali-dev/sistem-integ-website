export interface SystemCalculatorSettings {
  id: string;
  systemCode: string;
  systemName: string;
  pricePerRoom: number;
  pricePerRoomArea: number;
  pricePerCorridorArea: number;
  updatedAt: number;
}

const STORAGE_KEY = 'calculator_settings';

export const SYSTEM_CODES = {
  SAPS: 'SAPS',
  SOUE: 'SOUE',
  APS: 'APS',
  VODOPROVOD: 'VODOPROVOD',
  KANALIZACIYA: 'KANALIZACIYA'
} as const;

export const SYSTEM_NAMES = {
  SAPS: 'САПС (Система автоматической пожарной сигнализации)',
  SOUE: 'СОУЭ (Система оповещения и управления эвакуацией)',
  APS: 'АПС (Автоматическая пожарная сигнализация)',
  VODOPROVOD: 'Водопровод',
  KANALIZACIYA: 'Канализация'
} as const;

const DEFAULT_SETTINGS: SystemCalculatorSettings[] = [
  {
    id: 'saps_default',
    systemCode: SYSTEM_CODES.SAPS,
    systemName: SYSTEM_NAMES.SAPS,
    pricePerRoom: 5000,
    pricePerRoomArea: 150,
    pricePerCorridorArea: 100,
    updatedAt: Date.now()
  }
];

export function getCalculatorSettings(): SystemCalculatorSettings[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  return JSON.parse(stored);
}

export function getSettingsBySystemCode(systemCode: string): SystemCalculatorSettings | null {
  const settings = getCalculatorSettings();
  return settings.find(s => s.systemCode === systemCode) || null;
}

export function updateCalculatorSettings(systemCode: string, updates: Partial<SystemCalculatorSettings>): void {
  const settings = getCalculatorSettings();
  const index = settings.findIndex(s => s.systemCode === systemCode);
  
  if (index !== -1) {
    settings[index] = {
      ...settings[index],
      ...updates,
      updatedAt: Date.now()
    };
  } else {
    const newSetting: SystemCalculatorSettings = {
      id: `${systemCode}_${Date.now()}`,
      systemCode,
      systemName: SYSTEM_NAMES[systemCode as keyof typeof SYSTEM_NAMES] || systemCode,
      pricePerRoom: 0,
      pricePerRoomArea: 0,
      pricePerCorridorArea: 0,
      ...updates,
      updatedAt: Date.now()
    };
    settings.push(newSetting);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export interface CalculatorSAPSInput {
  roomArea: number;
  roomCount: number;
  corridorArea: number;
}

export interface CalculatorResult {
  totalCost: number;
  breakdown: {
    roomCost: number;
    roomAreaCost: number;
    corridorCost: number;
  };
  settings: SystemCalculatorSettings;
}

export function calculateSAPS(input: CalculatorSAPSInput): CalculatorResult {
  const settings = getSettingsBySystemCode(SYSTEM_CODES.SAPS);
  
  if (!settings) {
    throw new Error('Настройки калькулятора САПС не найдены');
  }

  const roomCost = input.roomCount * settings.pricePerRoom;
  const roomAreaCost = input.roomArea * settings.pricePerRoomArea;
  const corridorCost = input.corridorArea * settings.pricePerCorridorArea;

  return {
    totalCost: roomCost + roomAreaCost + corridorCost,
    breakdown: {
      roomCost,
      roomAreaCost,
      corridorCost
    },
    settings
  };
}
