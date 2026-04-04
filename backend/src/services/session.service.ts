import db from '../database/db.js';
import type { TestSession, TestResult, ParsedTestPlan } from '../types/index.js';

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
