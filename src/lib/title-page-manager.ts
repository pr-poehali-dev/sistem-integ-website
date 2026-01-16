export interface TitlePage {
  id: string;
  projectId: string;
  documentTitle: string;
  city: string;
  address: string;
  year: string;
  approvedBy: string;
  approvedDate: string;
  developerName: string;
  developerPosition: string;
  chiefEngineerName: string;
  chiefEngineerPosition: string;
  createdAt: number;
}

const TITLE_PAGES_KEY = 'title_pages';

export function getTitlePages(): TitlePage[] {
  const stored = localStorage.getItem(TITLE_PAGES_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveTitlePages(pages: TitlePage[]) {
  localStorage.setItem(TITLE_PAGES_KEY, JSON.stringify(pages));
}

export function getTitlePagesByProject(projectId: string): TitlePage[] {
  return getTitlePages().filter(p => p.projectId === projectId);
}

export function createTitlePage(data: Omit<TitlePage, 'id' | 'createdAt'>): TitlePage {
  const pages = getTitlePages();
  const newPage: TitlePage = {
    ...data,
    id: 'titlepage_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    createdAt: Date.now()
  };
  pages.push(newPage);
  saveTitlePages(pages);
  return newPage;
}

export function updateTitlePage(pageId: string, updates: Partial<Omit<TitlePage, 'id' | 'createdAt'>>): boolean {
  const pages = getTitlePages();
  const index = pages.findIndex(p => p.id === pageId);
  
  if (index === -1) return false;
  
  pages[index] = { ...pages[index], ...updates };
  saveTitlePages(pages);
  return true;
}

export function deleteTitlePage(pageId: string): boolean {
  const pages = getTitlePages();
  const filtered = pages.filter(p => p.id !== pageId);
  
  if (filtered.length === pages.length) return false;
  
  saveTitlePages(filtered);
  return true;
}

export function getTitlePageById(pageId: string | null): TitlePage | null {
  if (!pageId) return null;
  return getTitlePages().find(p => p.id === pageId) || null;
}
