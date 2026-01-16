export interface Bank {
  id: string;
  bic: string;
  name: string;
  correspondentAccount: string;
  city: string;
  address: string;
  phone: string;
  createdAt: number;
  source: 'api' | 'manual';
}

const BANKS_KEY = 'banks';
const BANKS_CACHE_KEY = 'banks_cache';
const BANKS_CACHE_TIMESTAMP = 'banks_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export function getBanks(): Bank[] {
  const stored = localStorage.getItem(BANKS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveBanks(banks: Bank[]) {
  localStorage.setItem(BANKS_KEY, JSON.stringify(banks));
}

export async function loadBanksFromAPI(): Promise<void> {
  const cacheTimestamp = localStorage.getItem(BANKS_CACHE_TIMESTAMP);
  const now = Date.now();
  
  if (cacheTimestamp && (now - parseInt(cacheTimestamp)) < CACHE_DURATION) {
    const cached = localStorage.getItem(BANKS_CACHE_KEY);
    if (cached) {
      const cachedBanks = JSON.parse(cached);
      const existingBanks = getBanks();
      const manualBanks = existingBanks.filter(b => b.source === 'manual');
      saveBanks([...cachedBanks, ...manualBanks]);
      return;
    }
  }

  try {
    const response = await fetch('https://www.cbr.ru/s/newbik');
    if (!response.ok) throw new Error('API недоступен');
    
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    const bankElements = xmlDoc.getElementsByTagName('BICDirectoryEntry');
    const apiBanks: Bank[] = [];
    
    for (let i = 0; i < Math.min(bankElements.length, 100); i++) {
      const bank = bankElements[i];
      const bic = bank.getAttribute('BIC') || '';
      const participantInfo = bank.getElementsByTagName('ParticipantInfo')[0];
      const accounts = bank.getElementsByTagName('Accounts')[0];
      
      if (!participantInfo) continue;
      
      const nameRU = participantInfo.getAttribute('NameP') || '';
      const corrAccount = accounts?.getElementsByTagName('Account')[0]?.getAttribute('Account') || '';
      
      apiBanks.push({
        id: 'bank_api_' + bic,
        bic,
        name: nameRU,
        correspondentAccount: corrAccount,
        city: '',
        address: '',
        phone: '',
        createdAt: now,
        source: 'api'
      });
    }
    
    localStorage.setItem(BANKS_CACHE_KEY, JSON.stringify(apiBanks));
    localStorage.setItem(BANKS_CACHE_TIMESTAMP, now.toString());
    
    const existingBanks = getBanks();
    const manualBanks = existingBanks.filter(b => b.source === 'manual');
    saveBanks([...apiBanks, ...manualBanks]);
    
  } catch (error) {
    console.error('Ошибка загрузки банков:', error);
  }
}

export function createBank(data: Omit<Bank, 'id' | 'createdAt' | 'source'>): Bank {
  const banks = getBanks();
  const newBank: Bank = {
    ...data,
    id: 'bank_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    createdAt: Date.now(),
    source: 'manual'
  };
  banks.push(newBank);
  saveBanks(banks);
  return newBank;
}

export function updateBank(bankId: string, updates: Partial<Omit<Bank, 'id' | 'createdAt' | 'source'>>): boolean {
  const banks = getBanks();
  const index = banks.findIndex(b => b.id === bankId);
  
  if (index === -1) return false;
  if (banks[index].source === 'api') return false;
  
  banks[index] = { ...banks[index], ...updates };
  saveBanks(banks);
  return true;
}

export function deleteBank(bankId: string): boolean {
  const banks = getBanks();
  const bank = banks.find(b => b.id === bankId);
  
  if (!bank || bank.source === 'api') return false;
  
  const filtered = banks.filter(b => b.id !== bankId);
  saveBanks(filtered);
  return true;
}

export function getBankById(bankId: string | null): Bank | null {
  if (!bankId) return null;
  return getBanks().find(b => b.id === bankId) || null;
}

export function searchBankByBIC(bic: string): Bank | null {
  return getBanks().find(b => b.bic === bic) || null;
}
