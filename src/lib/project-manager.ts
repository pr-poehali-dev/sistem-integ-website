export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  startDate: string | null;
  endDate: string | null;
  budget: number | null;
  legalEntityId: string | null;
  createdAt: number;
}

export interface LegalEntity {
  id: string;
  name: string;
  inn: string;
  kpp: string;
  ogrn: string;
  legalAddress: string;
  actualAddress: string;
  directorName: string;
  phone: string;
  email: string;
  projectId: string;
  createdAt: number;
}

export interface ProjectAccess {
  id: string;
  projectId: string;
  userId: string;
  accessLevel: 'read' | 'write' | 'admin';
  grantedAt: number;
  grantedBy: string;
}

export interface System {
  id: string;
  projectId: string;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'inactive' | 'development' | 'maintenance';
  clientCuratorId: string | null;
  createdAt: number;
}

const PROJECTS_KEY = 'projects';
const LEGAL_ENTITIES_KEY = 'legal_entities';
const PROJECT_ACCESS_KEY = 'project_access';
const SYSTEMS_KEY = 'systems';

export function getProjects(): Project[] {
  const stored = localStorage.getItem(PROJECTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function getLegalEntities(): LegalEntity[] {
  const stored = localStorage.getItem(LEGAL_ENTITIES_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveLegalEntities(entities: LegalEntity[]) {
  localStorage.setItem(LEGAL_ENTITIES_KEY, JSON.stringify(entities));
}

export function getProjectAccess(): ProjectAccess[] {
  const stored = localStorage.getItem(PROJECT_ACCESS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveProjectAccess(access: ProjectAccess[]) {
  localStorage.setItem(PROJECT_ACCESS_KEY, JSON.stringify(access));
}

export function createProject(data: Omit<Project, 'id' | 'createdAt'>): Project {
  const projects = getProjects();
  const newProject: Project = {
    ...data,
    id: 'project_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    createdAt: Date.now()
  };
  projects.push(newProject);
  saveProjects(projects);
  return newProject;
}

export function updateProject(projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): boolean {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === projectId);
  
  if (index === -1) return false;
  
  projects[index] = { ...projects[index], ...updates };
  saveProjects(projects);
  return true;
}

export function deleteProject(projectId: string): boolean {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== projectId);
  
  if (filtered.length === projects.length) return false;
  
  const entities = getLegalEntities().filter(e => e.projectId !== projectId);
  saveLegalEntities(entities);
  
  const access = getProjectAccess().filter(a => a.projectId !== projectId);
  saveProjectAccess(access);
  
  const systems = getSystems().filter(s => s.projectId !== projectId);
  saveSystems(systems);
  
  saveProjects(filtered);
  return true;
}

export function getLegalEntitiesByProject(projectId: string): LegalEntity[] {
  return getLegalEntities().filter(e => e.projectId === projectId);
}

export function createLegalEntity(data: Omit<LegalEntity, 'id' | 'createdAt'>): LegalEntity {
  const entities = getLegalEntities();
  const newEntity: LegalEntity = {
    ...data,
    id: 'entity_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    createdAt: Date.now()
  };
  entities.push(newEntity);
  saveLegalEntities(entities);
  return newEntity;
}

export function updateLegalEntity(entityId: string, updates: Partial<Omit<LegalEntity, 'id' | 'createdAt'>>): boolean {
  const entities = getLegalEntities();
  const index = entities.findIndex(e => e.id === entityId);
  
  if (index === -1) return false;
  
  entities[index] = { ...entities[index], ...updates };
  saveLegalEntities(entities);
  return true;
}

export function deleteLegalEntity(entityId: string): boolean {
  const entities = getLegalEntities();
  const filtered = entities.filter(e => e.id !== entityId);
  
  if (filtered.length === entities.length) return false;
  
  saveLegalEntities(filtered);
  return true;
}

export function grantProjectAccess(projectId: string, userId: string, accessLevel: 'read' | 'write' | 'admin', grantedBy: string): ProjectAccess {
  const access = getProjectAccess();
  
  const existing = access.find(a => a.projectId === projectId && a.userId === userId);
  if (existing) {
    existing.accessLevel = accessLevel;
    existing.grantedAt = Date.now();
    existing.grantedBy = grantedBy;
    saveProjectAccess(access);
    return existing;
  }
  
  const newAccess: ProjectAccess = {
    id: 'access_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    projectId,
    userId,
    accessLevel,
    grantedAt: Date.now(),
    grantedBy
  };
  
  access.push(newAccess);
  saveProjectAccess(access);
  return newAccess;
}

export function revokeProjectAccess(projectId: string, userId: string): boolean {
  const access = getProjectAccess();
  const filtered = access.filter(a => !(a.projectId === projectId && a.userId === userId));
  
  if (filtered.length === access.length) return false;
  
  saveProjectAccess(filtered);
  return true;
}

export function getUserProjectAccess(userId: string): ProjectAccess[] {
  return getProjectAccess().filter(a => a.userId === userId);
}

export function getProjectAccessList(projectId: string): ProjectAccess[] {
  return getProjectAccess().filter(a => a.projectId === projectId);
}

export function hasProjectAccess(userId: string, projectId: string, minLevel: 'read' | 'write' | 'admin' = 'read'): boolean {
  const access = getProjectAccess().find(a => a.userId === userId && a.projectId === projectId);
  if (!access) return false;
  
  const levels = { read: 1, write: 2, admin: 3 };
  return levels[access.accessLevel] >= levels[minLevel];
}

export function getSystems(): System[] {
  const stored = localStorage.getItem(SYSTEMS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveSystems(systems: System[]) {
  localStorage.setItem(SYSTEMS_KEY, JSON.stringify(systems));
}

export function getSystemsByProject(projectId: string): System[] {
  return getSystems().filter(s => s.projectId === projectId);
}

export function createSystem(data: Omit<System, 'id' | 'createdAt'>): System {
  const systems = getSystems();
  const newSystem: System = {
    ...data,
    id: 'system_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    createdAt: Date.now()
  };
  systems.push(newSystem);
  saveSystems(systems);
  return newSystem;
}

export function updateSystem(systemId: string, updates: Partial<Omit<System, 'id' | 'createdAt' | 'projectId'>>): boolean {
  const systems = getSystems();
  const index = systems.findIndex(s => s.id === systemId);
  
  if (index === -1) return false;
  
  systems[index] = { ...systems[index], ...updates };
  saveSystems(systems);
  return true;
}

export function deleteSystem(systemId: string): boolean {
  const systems = getSystems();
  const filtered = systems.filter(s => s.id !== systemId);
  
  if (filtered.length === systems.length) return false;
  
  saveSystems(filtered);
  return true;
}