export interface Work {
  id: string;
  code: string;
  name: string;
  unitId: string | null;
  pricePerUnit: number | null;
  description: string;
  createdAt: number;
}

const WORKS_KEY = 'works';

export function getWorks(): Work[] {
  const stored = localStorage.getItem(WORKS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveWorks(works: Work[]) {
  localStorage.setItem(WORKS_KEY, JSON.stringify(works));
}

export function createWork(data: Omit<Work, 'id' | 'createdAt'>): Work {
  const works = getWorks();
  const newWork: Work = {
    ...data,
    id: 'work_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    createdAt: Date.now()
  };
  works.push(newWork);
  saveWorks(works);
  return newWork;
}

export function updateWork(workId: string, updates: Partial<Omit<Work, 'id' | 'createdAt'>>): boolean {
  const works = getWorks();
  const index = works.findIndex(w => w.id === workId);
  
  if (index === -1) return false;
  
  works[index] = { ...works[index], ...updates };
  saveWorks(works);
  return true;
}

export function deleteWork(workId: string): boolean {
  const works = getWorks();
  const filtered = works.filter(w => w.id !== workId);
  
  if (filtered.length === works.length) return false;
  
  saveWorks(filtered);
  return true;
}

export function getWorkById(workId: string | null): Work | null {
  if (!workId) return null;
  return getWorks().find(w => w.id === workId) || null;
}
