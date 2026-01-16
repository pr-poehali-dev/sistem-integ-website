export interface Material {
  id: string;
  type: 'material' | 'equipment';
  code: string;
  name: string;
  description: string;
  unitId: string | null;
  price: number | null;
  manufacturer: string;
  notes: string;
  createdAt: number;
}

const MATERIALS_KEY = 'materials';

export function getMaterials(): Material[] {
  const stored = localStorage.getItem(MATERIALS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveMaterials(materials: Material[]) {
  localStorage.setItem(MATERIALS_KEY, JSON.stringify(materials));
}

export function createMaterial(data: Omit<Material, 'id' | 'createdAt'>): Material {
  const materials = getMaterials();
  const newMaterial: Material = {
    ...data,
    id: 'material_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    createdAt: Date.now()
  };
  materials.push(newMaterial);
  saveMaterials(materials);
  return newMaterial;
}

export function updateMaterial(materialId: string, updates: Partial<Omit<Material, 'id' | 'createdAt'>>): boolean {
  const materials = getMaterials();
  const index = materials.findIndex(m => m.id === materialId);
  
  if (index === -1) return false;
  
  materials[index] = { ...materials[index], ...updates };
  saveMaterials(materials);
  return true;
}

export function deleteMaterial(materialId: string): boolean {
  const materials = getMaterials();
  const filtered = materials.filter(m => m.id !== materialId);
  
  if (filtered.length === materials.length) return false;
  
  saveMaterials(filtered);
  return true;
}

export function getMaterialById(materialId: string | null): Material | null {
  if (!materialId) return null;
  return getMaterials().find(m => m.id === materialId) || null;
}

export function getMaterialsByType(type: 'material' | 'equipment'): Material[] {
  return getMaterials().filter(m => m.type === type);
}
