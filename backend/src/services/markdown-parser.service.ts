import { marked } from 'marked';
import type { ParsedTestPlan, TestSection, TestSubsection, Test } from '../types/index.js';

export class MarkdownParserService {
  static parse(markdown: string): ParsedTestPlan {
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
          currentSection = { id: String(sectionCounter), title: token.text, subsections: [] };
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

    return plan;
  }
}
