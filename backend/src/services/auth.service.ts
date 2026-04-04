import bcrypt from 'bcryptjs';
import db from '../database/db.js';
import type { User } from '../types/index.js';

export class AuthService {
  static hasUser(): boolean {
    const result = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    return result.count > 0;
  }

  static async createUser(username: string, password: string, language: string): Promise<User> {
    const hash = await bcrypt.hash(password, 12);
    const stmt = db.prepare('INSERT INTO users (username, password_hash, language) VALUES (?, ?, ?)');
    const info = stmt.run(username, hash, language);

    return db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid) as User;
  }

  static async verifyUser(username: string, password: string): Promise<User | undefined> {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
    if (!user) return undefined;

    const valid = await bcrypt.compare(password, user.password_hash);
    return valid ? user : undefined;
  }

  static getUserById(id: number): User | undefined {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
  }

  static updateUserLanguage(userId: number, language: string): void {
    db.prepare('UPDATE users SET language = ? WHERE id = ?').run(language, userId);
  }

  static async updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(userId) as { password_hash: string } | undefined;
    if (!user) return false;

    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) return false;

    const newHash = await bcrypt.hash(newPassword, 12);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, userId);
    return true;
  }
}
