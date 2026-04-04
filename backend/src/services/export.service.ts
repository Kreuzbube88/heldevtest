import type { TestSession, TestResult } from '../types/index.js';
import type { ParsedTestPlan } from '../types/index.js';

export class ExportService {
  private static getStructure(session: TestSession): ParsedTestPlan {
    return typeof session.markdown_structure === 'string'
      ? (JSON.parse(session.markdown_structure) as ParsedTestPlan)
      : (session.markdown_structure as unknown as ParsedTestPlan);
  }

  static toMarkdown(session: TestSession, results: TestResult[]): string {
    const structure = this.getStructure(session);

    let md = `# ${structure.title}\n\n`;
    md += `**Test Session:** ${session.name}\n`;
    md += `**Date:** ${session.created_at}\n`;
    md += `**Status:** ${session.status}\n\n`;
    md += `---\n\n`;

    for (const section of structure.sections) {
      md += `## ${section.title}\n\n`;
      for (const subsection of section.subsections) {
        md += `### ${subsection.title}\n\n`;
        for (const test of subsection.tests) {
          const result = results.find((r) => r.test_path === test.path);
          const checked = result && result.status !== 'pending' ? 'x' : ' ';
          md += `- [${checked}] **${test.title}**\n`;

          if (result) {
            md += `  - **Status:** ${result.status === 'pass' ? '☑' : '☐'} Pass ${result.status === 'fail' ? '☑' : '☐'} Fail ${result.status === 'skip' ? '☑' : '☐'} Skip\n`;
            if (result.bugs) {
              md += `  - **Bugs/Issues:**\n  \`\`\`\n  ${result.bugs}\n  \`\`\`\n`;
            }
          }
          md += '\n';
        }
      }
    }

    md += `\n---\n\n## Test Summary\n\n`;
    md += `**Total Tests:** ${session.total_tests}\n`;
    md += `**Completed:** ${session.completed_tests}\n`;
    md += `**Passed:** ${session.passed_tests}\n`;
    md += `**Failed:** ${session.failed_tests}\n`;
    md += `**Skipped:** ${session.skipped_tests}\n`;

    return md;
  }

  static toHTML(session: TestSession, results: TestResult[]): string {
    const structure = this.getStructure(session);

    let sectionsHtml = '';
    for (const section of structure.sections) {
      sectionsHtml += `<h2>${this.escapeHtml(section.title)}</h2>`;
      for (const subsection of section.subsections) {
        sectionsHtml += `<h3>${this.escapeHtml(subsection.title)}</h3>`;
        for (const test of subsection.tests) {
          const result = results.find((r) => r.test_path === test.path);
          const statusClass = result?.status || 'pending';
          sectionsHtml += `<div class="test ${statusClass}">`;
          sectionsHtml += `<strong>${this.escapeHtml(test.title)}</strong>`;
          if (result) {
            sectionsHtml += `<div>Status: ${this.escapeHtml(result.status)}</div>`;
            if (result.bugs) {
              sectionsHtml += `<div class="bugs">${this.escapeHtml(result.bugs)}</div>`;
            }
          }
          sectionsHtml += `</div>`;
        }
      }
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(structure.title)} - Test Results</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 20px auto; padding: 20px; }
    h1 { color: #1E40AF; }
    h2 { color: #374151; margin-top: 30px; }
    .meta { color: #6B7280; margin-bottom: 20px; }
    .test { margin: 15px 0; padding: 10px; border-left: 3px solid #E5E7EB; }
    .test.pass { border-left-color: #10B981; }
    .test.fail { border-left-color: #EF4444; }
    .test.skip { border-left-color: #F59E0B; }
    .bugs { background: #F3F4F6; padding: 10px; margin-top: 5px; white-space: pre-wrap; }
    .summary { margin-top: 40px; padding: 20px; background: #F9FAFB; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>${this.escapeHtml(structure.title)}</h1>
  <div class="meta">
    <strong>Session:</strong> ${this.escapeHtml(session.name)}<br>
    <strong>Date:</strong> ${this.escapeHtml(session.created_at)}<br>
    <strong>Status:</strong> ${this.escapeHtml(session.status)}
  </div>
  <hr>
  ${sectionsHtml}
  <div class="summary">
    <h2>Test Summary</h2>
    <p><strong>Total Tests:</strong> ${session.total_tests}</p>
    <p><strong>Completed:</strong> ${session.completed_tests}</p>
    <p><strong>Passed:</strong> ${session.passed_tests}</p>
    <p><strong>Failed:</strong> ${session.failed_tests}</p>
    <p><strong>Skipped:</strong> ${session.skipped_tests}</p>
  </div>
</body>
</html>`;
  }

  static toJSON(session: TestSession, results: TestResult[]): object {
    return {
      session: {
        id: session.id,
        name: session.name,
        created_at: session.created_at,
        status: session.status,
        total_tests: session.total_tests,
        completed_tests: session.completed_tests,
        passed_tests: session.passed_tests,
        failed_tests: session.failed_tests,
        skipped_tests: session.skipped_tests
      },
      results: results.map((r) => ({
        test_path: r.test_path,
        status: r.status,
        bugs: r.bugs,
        duration_seconds: r.duration_seconds
      }))
    };
  }

  private static escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
