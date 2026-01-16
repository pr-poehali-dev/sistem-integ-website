// Система управления пользователями

export interface User {
  id: string;
  email: string;
  password: string; // Хешированный пароль
  name: string;
  role: 'admin' | 'editor';
  createdAt: number;
  lastLogin?: number;
  isActive: boolean;
}

export interface PasswordResetToken {
  token: string;
  userId: string;
  expiresAt: number;
}

const USERS_KEY = 'admin_users';
const RESET_TOKENS_KEY = 'password_reset_tokens';
const CURRENT_USER_KEY = 'current_user_session';

function hashPassword(password: string): string {
  return btoa(password);
}

function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash;
}

export function initUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    const defaultAdmin: User = {
      id: 'user_' + Date.now(),
      email: 'admin@systemcraft.ru',
      password: hashPassword('admin'),
      name: 'Администратор',
      role: 'admin',
      createdAt: Date.now(),
      isActive: true
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([defaultAdmin]));
  }
}

export function getUsers(): User[] {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function createUser(email: string, password: string, name: string, role: 'admin' | 'editor' = 'editor'): User | null {
  const users = getUsers();
  
  if (users.find(u => u.email === email)) {
    return null;
  }

  const newUser: User = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    email,
    password: hashPassword(password),
    name,
    role,
    createdAt: Date.now(),
    isActive: true
  };

  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function loginUser(email: string, password: string): User | null {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.isActive);
  
  if (!user || !verifyPassword(password, user.password)) {
    return null;
  }

  user.lastLogin = Date.now();
  saveUsers(users);
  
  const session = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    loginAt: Date.now()
  };
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));
  return user;
}

export function getCurrentUser(): Pick<User, 'id' | 'email' | 'name' | 'role'> | null {
  const session = localStorage.getItem(CURRENT_USER_KEY);
  if (!session) return null;
  
  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function updateUser(userId: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): boolean {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) return false;
  
  if (updates.password) {
    updates.password = hashPassword(updates.password);
  }
  
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  return true;
}

export function deleteUser(userId: string): boolean {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== userId);
  
  if (filtered.length === users.length) return false;
  
  saveUsers(filtered);
  return true;
}

export function toggleUserActive(userId: string): boolean {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) return false;
  
  user.isActive = !user.isActive;
  saveUsers(users);
  return true;
}

export function generatePasswordResetToken(email: string): string | null {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.isActive);
  
  if (!user) return null;
  
  const token = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  const resetToken: PasswordResetToken = {
    token,
    userId: user.id,
    expiresAt: Date.now() + 3600000 // 1 час
  };
  
  const tokens = getResetTokens();
  tokens.push(resetToken);
  localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
  
  return token;
}

function getResetTokens(): PasswordResetToken[] {
  const stored = localStorage.getItem(RESET_TOKENS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function verifyResetToken(token: string): string | null {
  const tokens = getResetTokens();
  const resetToken = tokens.find(t => t.token === token && t.expiresAt > Date.now());
  
  return resetToken ? resetToken.userId : null;
}

export function resetPassword(token: string, newPassword: string): boolean {
  const userId = verifyResetToken(token);
  if (!userId) return false;
  
  const success = updateUser(userId, { password: newPassword });
  
  if (success) {
    const tokens = getResetTokens().filter(t => t.token !== token);
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
  }
  
  return success;
}

export function changePassword(userId: string, oldPassword: string, newPassword: string): boolean {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user || !verifyPassword(oldPassword, user.password)) {
    return false;
  }
  
  return updateUser(userId, { password: newPassword });
}
