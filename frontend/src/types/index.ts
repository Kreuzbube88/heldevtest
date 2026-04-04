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
  subsections: TestSubsection[];
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
