import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Brain, 
  MessageSquare, 
  Play, 
  CheckCircle, 
  XCircle,
  Send,
  Lightbulb,
  Code,
  Zap,
  Bug
} from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import { AIService } from '../services/aiServices';
import { Language, Problem, TestResult } from '../types/interview';
import { API_BASE_URL } from '../config';

// PROBLEMS DATA - lengkap dengan 6 problems
const PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹"
    ],
    initialCode: `function twoSum(nums, target) {
    // Your solution here
    
}`,
    solution: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    
    return [];
}`,
    testCases: [
      { input: [[2,7,11,15], 9], expected: [0,1] },
      { input: [[3,2,4], 6], expected: [1,2] },
      { input: [[3,3], 6], expected: [0,1] }
    ],
    hints: [
      "Think about using a hash map to store numbers you've seen",
      "For each number, check if its complement (target - current) exists in the map",
      "The complement approach gives you O(n) time complexity"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)"
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      {
        input: "s = \"()\"",
        output: "true",
        explanation: "The parentheses are properly matched."
      },
      {
        input: "s = \"()[]{}\"",
        output: "true",
        explanation: "All brackets are properly matched."
      },
      {
        input: "s = \"(]\"",
        output: "false",
        explanation: "The brackets are not properly matched."
      }
    ],
    constraints: [
      "1 ≤ s.length ≤ 10⁴",
      "s consists of parentheses only '()[]{}'."
    ],
    initialCode: `function isValid(s) {
    // Your solution here
    
}`,
    solution: `function isValid(s) {
    const stack = [];
    const pairs = { ')': '(', '}': '{', ']': '[' };
    
    for (let char of s) {
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else {
            if (stack.length === 0 || stack.pop() !== pairs[char]) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}`,
    testCases: [
      { input: ["()"], expected: true },
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false },
      { input: ["([)]"], expected: false }
    ],
    hints: [
      "Use a stack data structure to keep track of opening brackets",
      "When you see a closing bracket, check if it matches the most recent opening bracket",
      "Make sure the stack is empty at the end"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)"
  },
  {
    id: 3,
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "The linked list is reversed."
      }
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 ≤ Node.val ≤ 5000"
    ],
    initialCode: `// Definition for singly-linked list.
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function reverseList(head) {
    // Your solution here
    
}`,
    solution: `function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current !== null) {
        let next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}`,
    testCases: [
      { input: [[1,2,3,4,5]], expected: [5,4,3,2,1] },
      { input: [[1,2]], expected: [2,1] },
      { input: [[]], expected: [] }
    ],
    hints: [
      "You need to reverse the direction of pointers",
      "Keep track of previous, current, and next nodes",
      "Iteratively reverse each link"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)"
  },
  {
    id: 4,
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "[4,-1,2,1] has the largest sum = 6."
      }
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁵",
      "-10⁴ ≤ nums[i] ≤ 10⁴"
    ],
    initialCode: `function maxSubArray(nums) {
    // Your solution here
    
}`,
    solution: `function maxSubArray(nums) {
    let maxSoFar = nums[0];
    let maxEndingHere = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}`,
    testCases: [
      { input: [[-2,1,-3,4,-1,2,1,-5,4]], expected: 6 },
      { input: [[1]], expected: 1 },
      { input: [[5,4,-1,7,8]], expected: 23 }
    ],
    hints: [
      "This is Kadane's algorithm - a classic DP problem",
      "At each position, decide whether to extend the previous subarray or start a new one",
      "Keep track of the maximum sum seen so far"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)"
  },
  {
    id: 5,
    title: "Binary Tree Inorder Traversal",
    difficulty: "Easy",
    category: "Trees",
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    examples: [
      {
        input: "root = [1,null,2,3]",
        output: "[1,3,2]",
        explanation: "Inorder traversal visits left, root, right."
      }
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 ≤ Node.val ≤ 100"
    ],
    initialCode: `// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function inorderTraversal(root) {
    // Your solution here
    
}`,
    solution: `function inorderTraversal(root) {
    const result = [];
    
    function inorder(node) {
        if (node === null) return;
        
        inorder(node.left);
        result.push(node.val);
        inorder(node.right);
    }
    
    inorder(root);
    return result;
}`,
    testCases: [
      { input: [[1,null,2,3]], expected: [1,3,2] },
      { input: [[]], expected: [] },
      { input: [[1]], expected: [1] }
    ],
    hints: [
      "Inorder traversal follows: Left → Root → Right pattern",
      "Use recursion or a stack-based iterative approach",
      "Base case: if node is null, return"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)"
  },
  {
    id: 6,
    title: "3Sum",
    difficulty: "Medium",
    category: "Arrays",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation: "The distinct triplets are [-1,-1,2] and [-1,0,1]."
      }
    ],
    constraints: [
      "3 ≤ nums.length ≤ 3000",
      "-10⁵ ≤ nums[i] ≤ 10⁵"
    ],
    initialCode: `function threeSum(nums) {
    // Your solution here
    
}`,
    solution: `function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1;
        let right = nums.length - 1;
        
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}`,
    testCases: [
      { input: [[-1,0,1,2,-1,-4]], expected: [[-1,-1,2],[-1,0,1]] },
      { input: [[0,1,1]], expected: [] },
      { input: [[0,0,0]], expected: [[0,0,0]] }
    ],
    hints: [
      "Sort the array first to make it easier to avoid duplicates",
      "Use two pointers approach after fixing the first element",
      "Skip duplicate values to avoid duplicate triplets"
    ],
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)"
  }
];

const InterviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  // AI Chat States
  const [aiMessages, setAiMessages] = useState<Array<{id: string, type: 'user' | 'ai', content: string, timestamp: Date}>>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const aiService = AIService.getInstance();

  // Convert PROBLEMS data ke format yang sesuai InterviewPage
  const mockProblems: { [key: string]: Problem } = {};
  
  PROBLEMS.forEach(problem => {
    mockProblems[problem.id.toString()] = {
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty as 'Easy' | 'Medium' | 'Hard',
      category: problem.category,
      description: problem.description,
      examples: problem.examples,
      constraints: problem.constraints,
      hints: problem.hints,
      starterCode: {
        javascript: problem.initialCode,
        python: `def solution():
    # Your code here
    pass`,
        java: `public class Solution {
    // Your code here
    
}`,
        cpp: `class Solution {
public:
    // Your code here
    
};`
      },
      testCases: problem.testCases.map(tc => ({
        input: Array.isArray(tc.input) ? tc.input : [tc.input],
        expectedOutput: Array.isArray(tc.expected) ? tc.expected : [tc.expected],
        description: `Test case with input: ${JSON.stringify(tc.input)}`
      })),
      solution: problem.solution,
      tags: [problem.category]
    };
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Load problem
  useEffect(() => {
    if (id && mockProblems[id]) {
      setCurrentProblem(mockProblems[id]);
      setCode(mockProblems[id].starterCode[language]);
      
      // Welcome AI message
      setAiMessages([{
        id: '1',
        type: 'ai',
        content: `👋 Hi! I'm your AI assistant powered by IBM Granite. I'm here to help you solve "${mockProblems[id].title}". 

Feel free to ask me for:
• 💡 Hints to get started
• 🔍 Code explanations  
• 🐛 Debugging help
• ⚡ Optimization suggestions

Good luck! 🚀`,
        timestamp: new Date()
      }]);
    }
  }, [id, language]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (currentProblem) {
      setCode(currentProblem.starterCode[newLanguage]);
    }
  };

  const getFunctionNameForProblem = (problemTitle: string): string => {
    switch (problemTitle) {
      case 'Two Sum': return 'twoSum';
      case 'Valid Parentheses': return 'isValid';
      case 'Reverse Linked List': return 'reverseList';
      case 'Maximum Subarray': return 'maxSubArray';
      case 'Binary Tree Inorder Traversal': return 'inorderTraversal';
      case '3Sum': return 'threeSum';
      default: return '';
    }
  };

  const handleRunCode = async () => {
    if (!currentProblem) return;
    setIsRunning(true);
    setTestResults([]);

    try {
      const functionName = getFunctionNameForProblem(currentProblem.title);

      // Build test cases payload in backend format
      const payloadTestCases = currentProblem.testCases.map(tc => ({
        input: tc.input,
        expected: tc.expectedOutput.length === 1 ? tc.expectedOutput[0] : tc.expectedOutput
      }));

      const res = await fetch(`${API_BASE_URL}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, functionName, testCases: payloadTestCases })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Execution failed');

      const results: TestResult[] = (data.results || []).map((r: any, idx: number) => ({
        id: String(idx + 1),
        passed: !!r.passed,
        input: Array.isArray(r.input) ? r.input : [r.input],
        expectedOutput: Array.isArray(r.expected) ? r.expected : [r.expected],
        actualOutput: Array.isArray(r.actual) ? r.actual : [r.actual],
        executionTime: typeof data.executionTime === 'number' ? data.executionTime : 0,
        error: r.error
      }));

      setTestResults(results);
    } catch (err: any) {
      setTestResults([{
        id: 'error',
        passed: false,
        input: [],
        expectedOutput: [],
        actualOutput: [],
        executionTime: 0,
        error: err?.message || 'Execution error'
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newUserMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: userMessage,
      timestamp: new Date()
    };

    setAiMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');
    setIsAiThinking(true);

    try {
      let aiResponse = '';
      
      if (userMessage.toLowerCase().includes('hint')) {
        aiResponse = await aiService.getHint(currentProblem?.id || 1, code, language);
      } else if (userMessage.toLowerCase().includes('explain')) {
        aiResponse = await aiService.explainCode(code, language);
      } else if (userMessage.toLowerCase().includes('debug') || userMessage.toLowerCase().includes('error')) {
        aiResponse = await aiService.debugCode(code, 'General debugging request', language);
      } else if (userMessage.toLowerCase().includes('optimize')) {
        aiResponse = await aiService.optimizeCode(code, language);
      } else {
        aiResponse = await aiService.chat(userMessage, code, language, currentProblem?.title);
      }

      const aiResponseMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: aiResponse,
        timestamp: new Date()
      };

      setAiMessages(prev => [...prev, aiResponseMessage]);
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setIsAiThinking(true);
    try {
      let response = '';
      switch (action) {
        case 'hint':
          response = await aiService.getHint(currentProblem?.id || 1, code, language);
          break;
        case 'explain':
          response = await aiService.explainCode(code, language);
          break;
        case 'debug':
          response = await aiService.debugCode(code, 'Debug request', language);
          break;
        case 'optimize':
          response = await aiService.optimizeCode(code, language);
          break;
      }

      const aiMessage = {
        id: Date.now().toString(),
        type: 'ai' as const,
        content: response,
        timestamp: new Date()
      };

      setAiMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsAiThinking(false);
    }
  };

  if (!currentProblem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-full mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/problems')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Problems
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {currentProblem.title}
            </h1>
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              currentProblem.difficulty === 'Easy' ? 'text-green-600 bg-green-100' :
              currentProblem.difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-100' :
              'text-red-600 bg-red-100'
            }`}>
              {currentProblem.difficulty}
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(timer)}</span>
            </div>
            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showAiPanel 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Brain className="h-4 w-4" />
              <span>AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Problem Description */}
        <div className="w-1/2 bg-white border-r overflow-y-auto">
          <div className="p-6">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">Problem Description</h3>
              <div className="whitespace-pre-line text-gray-700 mb-6">
                {currentProblem.description}
              </div>

              <h4 className="font-semibold mb-3">Examples:</h4>
              {currentProblem.examples.map((example, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="mb-2">
                    <strong>Input:</strong> <code className="bg-gray-200 px-1 rounded">{example.input}</code>
                  </div>
                  <div className="mb-2">
                    <strong>Output:</strong> <code className="bg-gray-200 px-1 rounded">{example.output}</code>
                  </div>
                  {example.explanation && (
                    <div className="text-sm text-gray-600">
                      <strong>Explanation:</strong> {example.explanation}
                    </div>
                  )}
                </div>
              ))}

              <h4 className="font-semibold mb-3">Constraints:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {currentProblem.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Code Editor & Results */}
        <div className={`${showAiPanel ? 'w-1/3' : 'w-1/2'} flex flex-col`}>
          <div className="flex-1 p-6">
            <CodeEditor
              initialCode={code}
              language={language}
              onCodeChange={handleCodeChange}
              onLanguageChange={handleLanguageChange}
              onRun={handleRunCode}
              isRunning={isRunning}
            />
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="border-t p-6 max-h-64 overflow-y-auto">
              <h4 className="font-semibold mb-3">Test Results</h4>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={result.id} className={`p-3 rounded-lg border ${
                    result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {result.passed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium">Test Case {index + 1}</span>
                      </div>
                      <span className="text-sm text-gray-500">{result.executionTime}ms</span>
                    </div>
                    <div className="text-sm">
                      <div>Input: {JSON.stringify(result.input)}</div>
                      <div>Expected: {JSON.stringify(result.expectedOutput)}</div>
                      <div>Got: {JSON.stringify(result.actualOutput)}</div>
                      {result.error && (
                        <div className="text-red-600 mt-1">Error: {result.error}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Panel */}
        {showAiPanel && (
          <div className="w-1/3 bg-gray-50 border-l flex flex-col">
            <div className="p-4 border-b bg-white">
              <h3 className="font-semibold flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary-600" />
                <span>AI Assistant</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">Powered by IBM Granite</p>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b bg-white">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickAction('hint')}
                  className="flex items-center space-x-1 p-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                >
                  <Lightbulb className="h-3 w-3" />
                  <span>Hint</span>
                </button>
                <button
                  onClick={() => handleQuickAction('explain')}
                  className="flex items-center space-x-1 p-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                >
                  <Code className="h-3 w-3" />
                  <span>Explain</span>
                </button>
                <button
                  onClick={() => handleQuickAction('debug')}
                  className="flex items-center space-x-1 p-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                >
                  <Bug className="h-3 w-3" />
                  <span>Debug</span>
                </button>
                <button
                  onClick={() => handleQuickAction('optimize')}
                  className="flex items-center space-x-1 p-2 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition-colors"
                >
                  <Zap className="h-3 w-3" />
                  <span>Optimize</span>
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {aiMessages.map((message) => (
                <div key={message.id} className={`${
                  message.type === 'user' ? 'ml-8' : 'mr-8'
                }`}>
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-primary-600 text-white ml-auto' 
                      : 'bg-white border'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isAiThinking && (
                <div className="mr-8">
                  <div className="bg-white border p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600"></div>
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask AI for help..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userMessage.trim() || isAiThinking}
                  className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;