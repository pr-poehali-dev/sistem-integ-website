export interface EstimateItemWork {
  id: string;
  workId: string | null;
  workName: string;
  unitId: string | null;
  quantity: number;
  pricePerUnit: number | null;
  totalCost: number | null;
}

export interface EstimateItem {
  id: string;
  number: number;
  materialId: string | null;
  materialName: string;
  works: EstimateItemWork[];
  totalCost: number | null;
  notes: string;
}

export interface Estimate {
  id: string;
  number: string;
  name: string;
  projectId: string | null;
  date: number;
  items: EstimateItem[];
  totalCost: number;
  createdAt: number;
}

const ESTIMATES_KEY = 'estimates';

export function getEstimates(): Estimate[] {
  const stored = localStorage.getItem(ESTIMATES_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveEstimates(estimates: Estimate[]) {
  localStorage.setItem(ESTIMATES_KEY, JSON.stringify(estimates));
}

export function createEstimate(data: Omit<Estimate, 'id' | 'createdAt' | 'totalCost'>): Estimate {
  const estimates = getEstimates();
  const totalCost = data.items.reduce((sum, item) => sum + (item.totalCost || 0), 0);
  
  const newEstimate: Estimate = {
    ...data,
    id: 'estimate_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    totalCost,
    createdAt: Date.now()
  };
  
  estimates.push(newEstimate);
  saveEstimates(estimates);
  return newEstimate;
}

export function updateEstimate(estimateId: string, updates: Partial<Omit<Estimate, 'id' | 'createdAt'>>): boolean {
  const estimates = getEstimates();
  const index = estimates.findIndex(e => e.id === estimateId);
  
  if (index === -1) return false;
  
  const updatedEstimate = { ...estimates[index], ...updates };
  
  if (updates.items) {
    updatedEstimate.totalCost = updates.items.reduce((sum, item) => sum + (item.totalCost || 0), 0);
  }
  
  estimates[index] = updatedEstimate;
  saveEstimates(estimates);
  return true;
}

export function deleteEstimate(estimateId: string): boolean {
  const estimates = getEstimates();
  const filtered = estimates.filter(e => e.id !== estimateId);
  
  if (filtered.length === estimates.length) return false;
  
  saveEstimates(filtered);
  return true;
}

export function getEstimateById(estimateId: string | null): Estimate | null {
  if (!estimateId) return null;
  return getEstimates().find(e => e.id === estimateId) || null;
}

export function createEstimateItem(data: Omit<EstimateItem, 'id' | 'totalCost'>): EstimateItem {
  const totalCost = data.works.reduce((sum, work) => sum + (work.totalCost || 0), 0);
  
  return {
    ...data,
    id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    totalCost
  };
}

export function createEstimateItemWork(data: Omit<EstimateItemWork, 'id' | 'totalCost'>): EstimateItemWork {
  const totalCost = (data.pricePerUnit || 0) * data.quantity;
  
  return {
    ...data,
    id: 'work_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    totalCost
  };
}

export function calculateItemTotal(price: number | null, quantity: number): number | null {
  if (price === null || quantity === 0) return null;
  return price * quantity;
}