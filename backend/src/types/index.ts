export interface User {
  id: number;
  username: string;
  password_hash: string;
  language: string;
  created_at: string;
}

export interface TestSession {
  id: number;
  user_id: number;
  name: string;
  filename: string;
  markdown_structure: string;
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
  status: string;
  bugs: string;
  duration_seconds: number | null;
  created_at: string;
  updated_at: string;
}

export interface Screenshot {
  id: number;
  session_id: number;
  test_path: string;
  filename: string;
  data: Buffer;
  created_at: string;
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

export interface CreateUserBody {
  username: string;
  password: string;
  language: string;
}

export interface LoginBody {
  username: string;
  password: string;
}

export interface SaveTestResultBody {
  test_path: string;
  status: 'pass' | 'fail' | 'skip' | 'pending';
  bugs: string;
  duration_seconds?: number;
}
