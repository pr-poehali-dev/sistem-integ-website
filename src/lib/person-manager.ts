export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  position: string;
  phone: string;
  email: string;
  notes: string;
  createdAt: number;
}

const PERSONS_KEY = 'persons';

export function getPersons(): Person[] {
  const stored = localStorage.getItem(PERSONS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function savePersons(persons: Person[]) {
  localStorage.setItem(PERSONS_KEY, JSON.stringify(persons));
}

export function createPerson(data: Omit<Person, 'id' | 'createdAt'>): Person {
  const persons = getPersons();
  const newPerson: Person = {
    ...data,
    id: 'person_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    createdAt: Date.now()
  };
  persons.push(newPerson);
  savePersons(persons);
  return newPerson;
}

export function updatePerson(personId: string, updates: Partial<Omit<Person, 'id' | 'createdAt'>>): boolean {
  const persons = getPersons();
  const index = persons.findIndex(p => p.id === personId);
  
  if (index === -1) return false;
  
  persons[index] = { ...persons[index], ...updates };
  savePersons(persons);
  return true;
}

export function deletePerson(personId: string): boolean {
  const persons = getPersons();
  const filtered = persons.filter(p => p.id !== personId);
  
  if (filtered.length === persons.length) return false;
  
  savePersons(filtered);
  return true;
}

export function getPersonFullName(personId: string): string {
  const person = getPersons().find(p => p.id === personId);
  if (!person) return 'Не указан';
  return `${person.lastName} ${person.firstName} ${person.middleName}`.trim();
}
