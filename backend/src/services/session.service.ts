import db from '../database/db.js';
import type { TestSession, TestResult, ParsedTestPlan, Resolution } from '../types/index.js';

export class SessionService {
  static createSession(userId: number, name: string, filename: string, parsedPlan: ParsedTestPlan): TestSession {
    const totalTests = parsedPlan.sections.reduce(
      (sum, section) =>
        sum + section.subsections.reduce((subSum, subsection) => subSum + subsection.tests.length, 0),
      0
    );

    const stmt = db.prepare(`
      INSERT INTO test_sessions (user_id, name, filename, markdown_structure, total_tests)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(userId, name, filename, JSON.stringify(parsedPlan), totalTests);

    return db.prepare('SELECT * FROM test_sessions WHERE id = ?').get(info.lastInsertRowid) as TestSession;
  }

  static getSessionById(id: number): TestSession | undefined {
    const session = db.prepare('SELECT * FROM test_sessions WHERE id = ?').get(id) as TestSession | undefined;
    if (session && session.markdown_structure) {
      try {
        (session as unknown as Record<string, unknown>).markdown_structure = JSON.parse(
          session.markdown_structure as unknown as string
        );
      } catch {
        // keep as string if parse fails
      }
    }
    return session;
  }

  static getAllSessions(userId: number): TestSession[] {
    return db
      .prepare('SELECT * FROM test_sessions WHERE user_id = ? ORDER BY updated_at DESC')
      .all(userId) as TestSession[];
  }

  static deleteSession(id: number): void {
    db.prepare('DELETE FROM test_sessions WHERE id = ?').run(id);
  }

  static saveTestResult(
    sessionId: number,
    testPath: string,
    status: string,
    bugs: string,
    duration?: number
  ): TestResult {
    db.prepare(`
      INSERT INTO test_results (session_id, test_path, status, bugs, duration_seconds)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(session_id, test_path)
      DO UPDATE SET
        status = excluded.status,
        bugs = excluded.bugs,
        duration_seconds = excluded.duration_seconds,
        updated_at = datetime('now')
    `).run(sessionId, testPath, status, bugs, duration ?? null);

    this.updateSessionProgress(sessionId);

    return db
      .prepare('SELECT * FROM test_results WHERE session_id = ? AND test_path = ?')
      .get(sessionId, testPath) as TestResult;
  }

  static getSessionResults(sessionId: number): TestResult[] {
    return db.prepare('SELECT * FROM test_results WHERE session_id = ?').all(sessionId) as TestResult[];
  }

  static applyResolutions(sessionId: number, resolutions: Record<string, Resolution>): TestSession | undefined {
    const session = this.getSessionById(sessionId);
    if (!session) return undefined;

    const plan = session.markdown_structure as unknown as ParsedTestPlan;
    const indicesToRemove = new Set<number>();

    for (const [sectionIndexStr, resolution] of Object.entries(resolutions)) {
      const idx = Number(sectionIndexStr);
      const section = plan.sections[idx];
      if (!section) continue;

      if (resolution === 'skip') {
        indicesToRemove.add(idx);
      } else if (resolution === 'import_empty') {
        section.type = 'tests';
      } else if (resolution === 'convert_freetext') {
        section.type = 'freetext';
        section.content = '';
        section.subsections = [];
      }
    }

    plan.sections = plan.sections.filter((_, i) => !indicesToRemove.has(i));

    const totalTests = plan.sections.reduce(
      (sum, section) =>
        sum + section.subsections.reduce((subSum, subsection) => subSum + subsection.tests.length, 0),
      0
    );

    db.prepare(`
      UPDATE test_sessions
      SET markdown_structure = ?, total_tests = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(JSON.stringify(plan), totalTests, sessionId);

    return this.getSessionById(sessionId);
  }

  static updateSectionContent(sessionId: number, sectionId: string, content: string): boolean {
    const session = this.getSessionById(sessionId);
    if (!session) return false;

    const plan = session.markdown_structure as unknown as ParsedTestPlan;
    const section = plan.sections.find(s => s.id === sectionId);
    if (!section) return false;

    section.content = content;
    section.type = 'freetext';

    db.prepare(`
      UPDATE test_sessions
      SET markdown_structure = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(JSON.stringify(plan), sessionId);

    return true;
  }

  private static updateSessionProgress(sessionId: number): void {
    const results = db
      .prepare('SELECT status FROM test_results WHERE session_id = ?')
      .all(sessionId) as { status: string }[];

    const completed = results.filter((r) => r.status !== 'pending').length;
    const passed = results.filter((r) => r.status === 'pass').length;
    const failed = results.filter((r) => r.status === 'fail').length;
    const skipped = results.filter((r) => r.status === 'skip').length;

    db.prepare(`
      UPDATE test_sessions
      SET completed_tests = ?, passed_tests = ?, failed_tests = ?, skipped_tests = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(completed, passed, failed, skipped, sessionId);
  }
}
