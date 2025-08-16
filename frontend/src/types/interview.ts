export type Language = 'javascript' | 'python' | 'java' | 'cpp';

export interface Problem {
  id: number;
  title: { en: string; id: string };
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: { en: string; id: string };
  examples: Array<{
    input: string;
    output: string;
    explanation?: { en: string; id: string };
  }>;
  constraints: Array<{ en: string; id: string }>;
  hints: string[];
  starterCode: Record<Language, string>;
  testCases: Array<{
    input: any[];
    expectedOutput: any[];
    description: string;
  }>;
  solution: string;
  tags: string[];
}

export interface TestResult {
  id: string;
  passed: boolean;
  input: any[];
  expectedOutput: any[];
  actualOutput: any[];
  executionTime: number;
  error?: string;
}

export interface AIInteraction {
  id: string;
  timestamp: Date;
  type: 'hint' | 'explanation' | 'debug' | 'optimization';
  userQuery: string;
  aiResponse: string;
  codeContext: string;
}