import type { TestSection, TestSubsection } from '../types';

export interface SectionStats {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  notStarted: number;
  percentage: number;
}

function computeStats(paths: string[], getStatus: (path: string) => string): SectionStats {
  const total = paths.length;
  let passed = 0, failed = 0, skipped = 0;
  for (const p of paths) {
    const s = getStatus(p);
    if (s === 'pass') passed++;
    else if (s === 'fail') failed++;
    else if (s === 'skip') skipped++;
  }
  const notStarted = total - passed - failed - skipped;
  const completed = total - notStarted;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, passed, failed, skipped, notStarted, percentage };
}

export function getSectionStats(section: TestSection, getStatus: (path: string) => string): SectionStats {
  return computeStats(section.subsections.flatMap(s => s.tests.map(t => t.path)), getStatus);
}

export function getSubsectionStats(subsection: TestSubsection, getStatus: (path: string) => string): SectionStats {
  return computeStats(subsection.tests.map(t => t.path), getStatus);
}

export function getOverallStats(sections: TestSection[], getStatus: (path: string) => string): SectionStats {
  return computeStats(
    sections.flatMap(s => s.subsections.flatMap(sub => sub.tests.map(t => t.path))),
    getStatus
  );
}
