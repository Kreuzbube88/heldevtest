export interface User {
  id: number;
  username: string;
  language: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TestSession {
  id: number;
  user_id: number;
  name: string;
  filename: string;
  markdown_structure: ParsedTestPlan;
  created_at: string;
  updated_at: string;
  status: string;
  total_tests: number;
  completed_tests: number;
  passed_tests: number;
  failed_tests: number;
  skipped_tests: number;
}

export interface TestResult {
  id: number;
  session_id: number;
  test_path: string;
  status: 'pending' | 'pass' | 'fail' | 'skip';
  bugs: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: number;
  name: string;
  description: string;
  content: string;
  created_at: string;
}

export interface ParsedTestPlan {
  title: string;
  sections: TestSection[];
}

export interface TestSection {
  id: string;
  title: string;
  type: 'tests' | 'freetext';
  content?: string;
  subsections: TestSubsection[];
}

export interface Problem {
  id: string;
  type: 'empty_section' | 'empty_subsection' | 'no_tests';
  severity: 'warning' | 'info';
  location: {
    section: string;
    sectionIndex: number;
    subsection?: string;
  };
  suggestion: string;
}

export type Resolution = 'skip' | 'import_empty' | 'convert_freetext';

export interface UploadResponse {
  success: boolean;
  sessionId?: number;
  problems?: Problem[];
}

export interface TestSubsection {
  id: string;
  title: string;
  tests: Test[];
}

export interface Test {
  id: string;
  path: string;
  title: string;
  steps?: string;
  expected?: string;
  hasStatusField: boolean;
  hasBugsField: boolean;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface BuilderTest {
  id: string;
  name: string;
}

export interface BuilderSection {
  id: string;
  title: string;
  type: 'tests' | 'freetext';
  tests?: BuilderTest[];
  content?: string;
}
