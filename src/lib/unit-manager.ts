export interface Unit {
  id: string;
  code: string;
  name: string;
  fullName: string;
  type: 'weight' | 'length' | 'volume' | 'area' | 'time' | 'piece' | 'other';
  createdAt: number;
}

const UNITS_KEY = 'units';

export function getUnits(): Unit[] {
  const stored = localStorage.getItem(UNITS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveUnits(units: Unit[]) {
  localStorage.setItem(UNITS_KEY, JSON.stringify(units));
}

export function createUnit(data: Omit<Unit, 'id' | 'createdAt'>): Unit {
  const units = getUnits();
  const newUnit: Unit = {
    ...data,
    id: 'unit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    createdAt: Date.now()
  };
  units.push(newUnit);
  saveUnits(units);
  return newUnit;
}

export function updateUnit(unitId: string, updates: Partial<Omit<Unit, 'id' | 'createdAt'>>): boolean {
  const units = getUnits();
  const index = units.findIndex(u => u.id === unitId);
  
  if (index === -1) return false;
  
  units[index] = { ...units[index], ...updates };
  saveUnits(units);
  return true;
}

export function deleteUnit(unitId: string): boolean {
  const units = getUnits();
  const filtered = units.filter(u => u.id !== unitId);
  
  if (filtered.length === units.length) return false;
  
  saveUnits(filtered);
  return true;
}

export function getUnitById(unitId: string | null): Unit | null {
  if (!unitId) return null;
  return getUnits().find(u => u.id === unitId) || null;
}
