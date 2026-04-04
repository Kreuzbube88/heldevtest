import db from '../database/db.js';
import type { Template } from '../types/index.js';

export class TemplateService {
  static getAllTemplates(): Template[] {
    return db.prepare('SELECT * FROM templates ORDER BY name').all() as Template[];
  }

  static getTemplateById(id: number): Template | undefined {
    return db.prepare('SELECT * FROM templates WHERE id = ?').get(id) as Template | undefined;
  }

  static createTemplate(name: string, description: string, content: string): Template {
    const stmt = db.prepare('INSERT INTO templates (name, description, content) VALUES (?, ?, ?)');
    const info = stmt.run(name, description, content);
    return db.prepare('SELECT * FROM templates WHERE id = ?').get(info.lastInsertRowid) as Template;
  }

  static deleteTemplate(id: number): void {
    db.prepare('DELETE FROM templates WHERE id = ?').run(id);
  }

  static seedDefaultTemplates(): void {
    const count = (db.prepare('SELECT COUNT(*) as count FROM templates').get() as { count: number }).count;
    if (count > 0) return;

    const templates = [
      {
        name: 'Backend API Testing',
        description: 'Template for testing RESTful APIs',
        content: `# Backend API Testing

## 1. Authentication Tests
### 1.1 Login
- [ ] **Test 1.1.1:** Successful login
  - **Status:** ☐ Pass ☐ Fail
  - **Bugs/Issues:**
  \`\`\`

  \`\`\`

### 1.2 Registration
- [ ] **Test 1.2.1:** Create new user
  - **Status:** ☐ Pass ☐ Fail
  - **Bugs/Issues:**
  \`\`\`

  \`\`\`
`
      },
      {
        name: 'Frontend UI Testing',
        description: 'Template for UI component testing',
        content: `# Frontend UI Testing

## 1. Component Tests
### 1.1 Buttons
- [ ] **Test 1.1.1:** Button click events
  - **Status:** ☐ Pass ☐ Fail
  - **Bugs/Issues:**
  \`\`\`

  \`\`\`
`
      },
      {
        name: 'Security Audit',
        description: 'Template for security testing',
        content: `# Security Audit

## 1. Authentication & Authorization
### 1.1 Login Security
- [ ] **Test 1.1.1:** Brute force protection
  - **Status:** ☐ Pass ☐ Fail
  - **Bugs/Issues:**
  \`\`\`

  \`\`\`

- [ ] **Test 1.1.2:** SQL injection prevention
  - **Status:** ☐ Pass ☐ Fail
  - **Bugs/Issues:**
  \`\`\`

  \`\`\`
`
      },
      {
        name: 'Performance Testing',
        description: 'Template for performance and load testing',
        content: `# Performance Testing

## 1. Load Tests
### 1.1 API Response Times
- [ ] **Test 1.1.1:** Response time under normal load
  - **Status:** ☐ Pass ☐ Fail
  - **Bugs/Issues:**
  \`\`\`

  \`\`\`
`
      },
      {
        name: 'Unraid Container Testing',
        description: 'Template for Unraid Docker container testing',
        content: `# Unraid Container Testing

## 1. Container Setup
### 1.1 Installation
- [ ] **Test 1.1.1:** Container starts successfully
  - **Status:** ☐ Pass ☐ Fail
  - **Bugs/Issues:**
  \`\`\`

  \`\`\`

- [ ] **Test 1.1.2:** Persistent data across restarts
  - **Status:** ☐ Pass ☐ Fail
  - **Bugs/Issues:**
  \`\`\`

  \`\`\`
`
      }
    ];

    for (const t of templates) {
      db.prepare('INSERT OR IGNORE INTO templates (name, description, content) VALUES (?, ?, ?)').run(
        t.name,
        t.description,
        t.content
      );
    }
  }
}
