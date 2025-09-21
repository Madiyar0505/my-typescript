import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';

const db = new Database('users.db');

// Создаем таблицу пользователей
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    bitrix_contact_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface User {
  id: number;
  login: string;
  email: string;
  password: string;
  bitrix_contact_id?: string;
  created_at: string;
}

export const createUser = (login: string, email: string, password: string, bitrixContactId?: string): User => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const stmt = db.prepare('INSERT INTO users (login, email, password, bitrix_contact_id) VALUES (?, ?, ?, ?)');
  const result = stmt.run(login, email, hashedPassword, bitrixContactId);
  
  return {
    id: result.lastInsertRowid as number,
    login,
    email,
    password: hashedPassword,
    bitrix_contact_id: bitrixContactId,
    created_at: new Date().toISOString()
  };
};

export const getUserByLogin = (login: string): User | null => {
  const stmt = db.prepare('SELECT * FROM users WHERE login = ?');
  return stmt.get(login) as User | null;
};

export const getUserByEmail = (email: string): User | null => {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) as User | null;
};

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(password, hashedPassword);
};

export default db;
