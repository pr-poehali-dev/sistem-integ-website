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
  SKS: 'SKS',
  SAPS: 'SAPS',
  SOUE: 'SOUE',
  SKUD: 'SKUD',
  SOTS: 'SOTS',
  SOT: 'SOT',
  ASKUE: 'ASKUE',
  EOM: 'EOM',
  OVIK: 'OVIK'
} as const;

export const SYSTEM_NAMES = {
  SKS: 'СКС (Структурированная кабельная система)',
  SAPS: 'САПС (Система автоматической пожарной сигнализации)',
  SOUE: 'СОУЭ (Система оповещения и управления эвакуацией)',
  SKUD: 'СКУД (Система контроля и управления доступом)',
  SOTS: 'СОТС (Система охранно-тревожной сигнализации)',
  SOT: 'СОТ (Система охранного телевидения)',
  ASKUE: 'АСКУЭ (Автоматизированная система контроля и учета энергоресурсов)',
  EOM: 'ЭОМ (Электрооборудование и освещение)',
  OVIK: 'ОВИК (Отопление, вентиляция и кондиционирование)'
} as const;

const DEFAULT_SETTINGS: SystemCalculatorSettings[] = [
  {
    id: 'sks_default',
    systemCode: SYSTEM_CODES.SKS,
    systemName: SYSTEM_NAMES.SKS,
    pricePerRoom: 3000,
    pricePerRoomArea: 200,
    pricePerCorridorArea: 150,
    updatedAt: Date.now()
  },
  {
    id: 'saps_default',
    systemCode: SYSTEM_CODES.SAPS,
    systemName: SYSTEM_NAMES.SAPS,
    pricePerRoom: 5000,
    pricePerRoomArea: 150,
    pricePerCorridorArea: 100,
    updatedAt: Date.now()
  },
  {
    id: 'soue_default',
    systemCode: SYSTEM_CODES.SOUE,
    systemName: SYSTEM_NAMES.SOUE,
    pricePerRoom: 4000,
    pricePerRoomArea: 120,
    pricePerCorridorArea: 90,
    updatedAt: Date.now()
  },
  {
    id: 'skud_default',
    systemCode: SYSTEM_CODES.SKUD,
    systemName: SYSTEM_NAMES.SKUD,
    pricePerRoom: 8000,
    pricePerRoomArea: 100,
    pricePerCorridorArea: 80,
    updatedAt: Date.now()
  },
  {
    id: 'sots_default',
    systemCode: SYSTEM_CODES.SOTS,
    systemName: SYSTEM_NAMES.SOTS,
    pricePerRoom: 6000,
    pricePerRoomArea: 130,
    pricePerCorridorArea: 100,
    updatedAt: Date.now()
  },
  {
    id: 'sot_default',
    systemCode: SYSTEM_CODES.SOT,
    systemName: SYSTEM_NAMES.SOT,
    pricePerRoom: 7000,
    pricePerRoomArea: 180,
    pricePerCorridorArea: 140,
    updatedAt: Date.now()
  },
  {
    id: 'askue_default',
    systemCode: SYSTEM_CODES.ASKUE,
    systemName: SYSTEM_NAMES.ASKUE,
    pricePerRoom: 4500,
    pricePerRoomArea: 110,
    pricePerCorridorArea: 70,
    updatedAt: Date.now()
  },
  {
    id: 'eom_default',
    systemCode: SYSTEM_CODES.EOM,
    systemName: SYSTEM_NAMES.EOM,
    pricePerRoom: 5500,
    pricePerRoomArea: 250,
    pricePerCorridorArea: 200,
    updatedAt: Date.now()
  },
  {
    id: 'ovik_default',
    systemCode: SYSTEM_CODES.OVIK,
    systemName: SYSTEM_NAMES.OVIK,
    pricePerRoom: 9000,
    pricePerRoomArea: 300,
    pricePerCorridorArea: 250,
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

export interface CalculatorInput {
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

export function calculateSystem(systemCode: string, input: CalculatorInput): CalculatorResult {
  const settings = getSettingsBySystemCode(systemCode);
  
  if (!settings) {
    throw new Error(`Настройки калькулятора для системы ${systemCode} не найдены`);
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
