export interface Material {
  id: string;
  type: 'material' | 'equipment';
  code: string;
  articleNumber: string;
  name: string;
  description: string;
  unitId: string | null;
  price: number | null;
  manufacturer: string;
  notes: string;
  createdAt: number;
}

export interface ProductSearchResult {
  title: string;
  description: string;
  price: string;
  manufacturer: string;
  url: string;
  source: string;
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

export async function searchProductByArticle(articleNumber: string): Promise<ProductSearchResult[]> {
  if (!articleNumber || articleNumber.trim().length < 3) {
    return [];
  }

  try {
    const searchQuery = encodeURIComponent(`${articleNumber} купить характеристики`);
    const response = await fetch(`https://www.google.com/search?q=${searchQuery}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      return mockSearchResults(articleNumber);
    }

    const html = await response.text();
    return parseSearchResults(html, articleNumber);
  } catch (error) {
    console.error('Ошибка поиска:', error);
    return mockSearchResults(articleNumber);
  }
}

function parseSearchResults(html: string, articleNumber: string): ProductSearchResult[] {
  const results: ProductSearchResult[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const searchResults = doc.querySelectorAll('div.g');
  
  for (let i = 0; i < Math.min(searchResults.length, 5); i++) {
    const result = searchResults[i];
    const titleEl = result.querySelector('h3');
    const descEl = result.querySelector('.VwiC3b');
    const linkEl = result.querySelector('a');
    
    if (titleEl && linkEl) {
      results.push({
        title: titleEl.textContent || '',
        description: descEl?.textContent || '',
        price: '',
        manufacturer: '',
        url: linkEl.getAttribute('href') || '',
        source: new URL(linkEl.getAttribute('href') || 'https://example.com').hostname
      });
    }
  }
  
  return results.length > 0 ? results : mockSearchResults(articleNumber);
}

function mockSearchResults(articleNumber: string): ProductSearchResult[] {
  return [
    {
      title: `${articleNumber} - Поиск в Яндекс Маркет`,
      description: `Найдите ${articleNumber} с лучшими предложениями и характеристиками`,
      price: '',
      manufacturer: '',
      url: `https://market.yandex.ru/search?text=${encodeURIComponent(articleNumber)}`,
      source: 'market.yandex.ru'
    },
    {
      title: `${articleNumber} - Поиск на Ozon`,
      description: `Товары по запросу ${articleNumber}`,
      price: '',
      manufacturer: '',
      url: `https://www.ozon.ru/search/?text=${encodeURIComponent(articleNumber)}`,
      source: 'ozon.ru'
    },
    {
      title: `${articleNumber} - Поиск на Wildberries`,
      description: `Каталог товаров ${articleNumber}`,
      price: '',
      manufacturer: '',
      url: `https://www.wildberries.ru/catalog/0/search.aspx?search=${encodeURIComponent(articleNumber)}`,
      source: 'wildberries.ru'
    },
    {
      title: `${articleNumber} - Google поиск`,
      description: `Поиск информации о ${articleNumber}`,
      price: '',
      manufacturer: '',
      url: `https://www.google.com/search?q=${encodeURIComponent(articleNumber)}`,
      source: 'google.com'
    }
  ];
}