import { marked } from 'marked';
import { randomUUID } from 'crypto';
import type { ParsedTestPlan, TestSection, TestSubsection, Test, Problem, ParseResult } from '../types/index.js';

export class MarkdownParserService {
  static parse(markdown: string): ParseResult {
    const tokens = marked.lexer(markdown);
    const plan: ParsedTestPlan = { title: '', sections: [] };

    let currentSection: TestSection | null = null;
    let currentSubsection: TestSubsection | null = null;
    let sectionCounter = 0;
    let subsectionCounter = 0;
    let testCounter = 0;

    for (const token of tokens) {
      if (token.type === 'heading') {
        if (token.depth === 1) {
          plan.title = token.text;
        } else if (token.depth === 2) {
          sectionCounter++;
          subsectionCounter = 0;
          testCounter = 0;
          currentSection = {
            id: String(sectionCounter),
            title: token.text,
            type: 'tests',
            subsections: []
          };
          plan.sections.push(currentSection);
          currentSubsection = null;
        } else if (token.depth === 3 && currentSection) {
          subsectionCounter++;
          testCounter = 0;
          currentSubsection = {
            id: `${sectionCounter}.${subsectionCounter}`,
            title: token.text,
            tests: []
          };
          currentSection.subsections.push(currentSubsection);
        }
      } else if (token.type === 'list' && currentSubsection) {
        for (const item of token.items) {
          const raw = item.raw || '';
          if (raw.match(/^-\s+\[\s*\]/)) {
            testCounter++;
            const testPath = `${sectionCounter}.${subsectionCounter}.${testCounter}`;
            const titleMatch = raw.match(/\*\*Test\s+[\d.]+:\*\*\s+(.+)/);
            const title = titleMatch
              ? titleMatch[1].trim()
              : raw.replace(/^-\s+\[\s*\]\s+/, '').trim();

            const hasStatusField = raw.includes('**Status:**') || raw.includes('☐ Pass');
            const hasBugsField = raw.includes('**Bugs/Issues:**') || raw.includes('```');

            const test: Test = {
              id: String(testCounter),
              path: testPath,
              title,
              hasStatusField,
              hasBugsField
            };

            currentSubsection.tests.push(test);
          }
        }
      }
    }

    // Ensure every section has at least a default subsection if it has no subsections
    for (const section of plan.sections) {
      if (section.subsections.length === 0) {
        section.subsections.push({
          id: `${section.id}.0`,
          title: section.title,
          tests: []
        });
      }
    }

    const problems = MarkdownParserService.detectProblems(plan);
    return { plan, problems };
  }

  private static detectProblems(plan: ParsedTestPlan): Problem[] {
    const problems: Problem[] = [];

    plan.sections.forEach((section, idx) => {
      const totalTests = section.subsections.reduce((sum, sub) => sum + sub.tests.length, 0);
      if (totalTests === 0) {
        problems.push({
          id: randomUUID(),
          type: 'empty_section',
          severity: 'warning',
          location: {
            section: section.title,
            sectionIndex: idx
          },
          suggestion: 'This section has no tests. Convert to freetext or skip.'
        });
      }
    });

    return problems;
  }
}
