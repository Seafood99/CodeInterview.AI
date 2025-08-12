const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Replicate = require('replicate');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Replicate client (IBM Granite)
const replicate = process.env.REPLICATE_API_TOKEN
    ? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
    : null;

// In-memory storage for demo (nanti bisa ganti database)
let users = [];
let submissions = [];

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'CodeInterview.AI Backend API',
        version: '1.0.0',
        status: 'running',
        granite: !!replicate
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', graniteReady: !!replicate, timestamp: new Date().toISOString() });
});

// AI proxy to IBM Granite via Replicate
app.post('/api/ai', async (req, res) => {
    const fallback = (reason) => {
        return res.status(200).json({
            success: true,
            model: 'mock-granite-fallback',
            output: `⚠️ Granite unavailable (${reason}). Using fallback.\n\nI'll still help: break the problem into steps, write a small function, and test with sample cases.`,
            isMock: true
        });
    };

    try {
        if (!replicate) {
            return fallback('not configured');
        }

        const { prompt, system, temperature = 0.4, maxTokens = 512 } = req.body;
        if (!prompt) return res.status(400).json({ error: 'prompt is required' });

        const model = process.env.GRANITE_MODEL || 'ibm-granite/granite-3.0-8b-instruct';

        const input = {
            prompt,
            system: system || 'You are an AI coding assistant helping with interview problems. Be concise and structured.',
            temperature,
            max_tokens: maxTokens
        };

        const output = await replicate.run(model, { input });
        const text = Array.isArray(output) ? output.join('') : String(output);

        res.json({ success: true, model, output: text });
    } catch (err) {
        console.error('Replicate AI error:', err);
        return fallback('request failed');
    }
});

// Execute code
app.post('/api/execute', async (req, res) => {
    try {
        const { code, language, testCases, functionName } = req.body;

        if (!code || !language) {
            return res.status(400).json({ error: 'Code and language required' });
        }

        // normalize language and aliases
        let lang = String(language).trim().toLowerCase();
        if (lang === 'js' || lang === 'node' || lang === 'nodejs') lang = 'javascript';
        if (lang === 'py' || lang === 'python3') lang = 'python';
        if (lang === 'c++' || lang === 'cplusplus') lang = 'cpp';

        console.log(`Executing ${lang} code...`);

        let result;
        if (lang === 'javascript') {
            result = await executeJavaScript(code, testCases, functionName);
        } else if (lang === 'python') {
            result = await executePythonPiston(code, testCases, functionName);
        } else if (lang === 'java') {
            result = await executeJavaPiston(code, testCases, functionName);
        } else if (lang === 'cpp') {
            result = await executeCppPiston(code, testCases, functionName);
        } else {
            return res.status(400).json({ error: `Language not supported yet: ${lang}` });
        }

        res.json(result);

    } catch (error) {
        console.error('Execution error:', error);
        res.status(500).json({
            error: 'Code execution failed',
            details: error.message
        });
    }
});

// Get problems
app.get('/api/problems', (req, res) => {
    const problems = [
        {
            id: 1,
            title: "Two Sum",
            difficulty: "Easy",
            category: "Arrays",
            description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            testCases: [
                { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
                { input: [[3, 2, 4], 6], expected: [1, 2] }
            ]
        },
        {
            id: 2,
            title: "Valid Parentheses",
            difficulty: "Easy",
            category: "Stack",
            description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
            testCases: [
                { input: ["()"], expected: true },
                { input: ["(]"], expected: false }
            ]
        }
    ];

    res.json(problems);
});

// Submit solution
app.post('/api/submit', (req, res) => {
    try {
        const { userId, problemId, code, language, results } = req.body;

        const submission = {
            id: Date.now().toString(),
            userId,
            problemId,
            code,
            language,
            results,
            timestamp: new Date().toISOString(),
            status: results.every(r => r.passed) ? 'accepted' : 'wrong_answer'
        };

        submissions.push(submission);

        res.json({
            message: 'Solution submitted successfully',
            submission
        });

    } catch (error) {
        res.status(500).json({ error: 'Submission failed' });
    }
});

// Helper functions for code execution
async function executeJavaScript(code, testCases = [], functionName = '') {
    return new Promise((resolve, reject) => {
        try {
            const safeFunctionName = functionName && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(functionName)
                ? functionName
                : null;

            // Wrap code and execute
            const wrappedCode = `
        ${code}
        const __fn = ${safeFunctionName ? safeFunctionName : 'undefined'};
        const results = [];
        ${Array.isArray(testCases) ? testCases.map((tc, i) => `
          try {
            const args = ${JSON.stringify(tc.input)};
            const expected = ${JSON.stringify(tc.expected)};
            const actual = (typeof __fn === 'function') ? __fn(...args) : null;
            results.push({
              testCase: ${i + 1},
              input: args,
              expected,
              actual,
              passed: JSON.stringify(actual) === JSON.stringify(expected)
            });
          } catch (error) {
            results.push({
              testCase: ${i + 1},
              input: ${JSON.stringify(tc.input)},
              expected: ${JSON.stringify(tc.expected)},
              actual: null,
              passed: false,
              error: error.message
            });
          }
        `).join('') : ''}
        results;
      `;

            const start = Date.now();
            const result = eval(wrappedCode);
            const end = Date.now();

            resolve({
                success: true,
                results: result,
                executionTime: end - start
            });

        } catch (error) {
            reject(error);
        }
    });
}

// Python execution via Piston API
async function executePythonPiston(code, testCases = [], functionName = '') {
    // Build a runner that calls user's function for each test case and prints JSON
    const fnNameLiteral = JSON.stringify(functionName || '');
    const testsJson = JSON.stringify(testCases || []);

    const runner = `\n\nimport json\n\n__FUNCTION_NAME = ${fnNameLiteral}\n__TESTS = json.loads('''${testsJson}''')\n\nresults = []\nfor tc in __TESTS:\n    try:\n        args = tc.get('input', [])\n        expected = tc.get('expected', None)\n        fn = globals().get(__FUNCTION_NAME)\n        if callable(fn):\n            actual = fn(*args)\n        else:\n            actual = None\n        passed = (actual == expected)\n        results.append({ 'input': args, 'expected': expected, 'actual': actual, 'passed': passed })\n    except Exception as e:\n        results.append({ 'input': tc.get('input', []), 'expected': tc.get('expected', None), 'actual': None, 'passed': False, 'error': str(e) })\n\nprint(json.dumps(results))\n`;

    const program = code + runner;

    const body = {
        language: 'python',
        version: '3.10.0',
        files: [{ name: 'main.py', content: program }]
    };

    const start = Date.now();
    const resp = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await resp.json();
    const end = Date.now();

    if (!resp.ok) {
        throw new Error(data?.message || 'Piston execute failed');
    }

    const stdout = data?.run?.stdout || '';
    let results = [];
    try {
        results = JSON.parse(stdout);
    } catch {
        return {
            success: false,
            results: [],
            executionTime: end - start,
            error: 'Failed to parse Python output',
            raw: stdout
        };
    }

    return {
        success: true,
        results,
        executionTime: end - start
    };
}

// Helpers to build literals
function toJavaIntArrayLiteral(arr) {
    return `new int[]{${arr.join(',')}}`;
}
function toJavaStringLiteral(s) {
    const escaped = s.replace(/\\/g, "\\\"\\\\\"").replace(/"/g, '\\"');
    return `\"${escaped}\"`;
}
function toJavaBooleanLiteral(b) { return b ? 'true' : 'false'; }

function toCppIntVectorLiteral(arr) {
    return `{${arr.join(',')}}`;
}
function toCppStringLiteral(s) {
    const escaped = s.replace(/\\/g, "\\\"\\\\\"").replace(/"/g, '\\"');
    return `\"${escaped}\"`;
}

// Java via Piston
async function executeJavaPiston(userCode, testCases = [], functionName = '') {
    const fn = functionName || '';
    const tests = Array.isArray(testCases) ? testCases : [];

    const toJavaIntArrayLiteral = (arr) => `new int[]{${arr.join(',')}}`;
    const toJavaStringLiteral = (s) => `\"${String(s).replace(/\\/g, "\\\"\\\\\"").replace(/\"/g, "\\\"\\\"\\\"")}\"`;

    let testBlocks = '';
    tests.forEach((tc) => {
        const args = tc.input || [];
        const expected = tc.expected;

        let callArgs = args.map(a => Array.isArray(a) ? toJavaIntArrayLiteral(a) : (typeof a === 'string' ? toJavaStringLiteral(a) : String(a)));

        if (Array.isArray(expected) && expected.every(n => typeof n === 'number')) {
            testBlocks += `\n        { int[] actual = s.${fn}(${callArgs.join(', ')}); System.out.println(arrToJson(actual)); }`;
        } else if (typeof expected === 'boolean') {
            testBlocks += `\n        { boolean actual = s.${fn}(${callArgs.join(', ')}); System.out.println(actual ? \"true\" : \"false\"); }`;
        } else {
            testBlocks += `\n        { int actual = s.${fn}(${callArgs.join(', ')}); System.out.println(actual); }`;
        }
    });

    const mainJava = `import java.util.*;\npublic class Main {\n    static String arrToJson(int[] a){ StringBuilder sb=new StringBuilder("["); for(int i=0;i<a.length;i++){ sb.append(a[i]); if(i+1<a.length) sb.append(","); } sb.append("]"); return sb.toString(); }\n    public static void main(String[] args) {\n        Solution s = new Solution();\n${testBlocks}\n    }\n}`;

    const files = [
        { name: 'Solution.java', content: userCode },
        { name: 'Main.java', content: mainJava }
    ];

    const body = { language: 'java', version: '15.0.2', files };
    const start = Date.now();
    const resp = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    const data = await resp.json();
    const end = Date.now();
    if (!resp.ok) {
        throw new Error(data?.message || 'Piston Java failed');
    }
    const stdout = (data?.run?.stdout || '').trim();
    const lines = stdout.length ? stdout.split(/\r?\n/) : [];

    const results = (tests || []).map((tc, idx) => {
        const line = lines[idx] ?? '';
        let actual;
        try { actual = JSON.parse(line); } catch { actual = line === 'true' ? true : (line === 'false' ? false : Number.isFinite(Number(line)) ? Number(line) : line); }
        return {
            input: tc.input,
            expected: tc.expected,
            actual,
            passed: JSON.stringify(actual) === JSON.stringify(tc.expected)
        };
    });

    return { success: true, results, executionTime: end - start, stderr: data?.run?.stderr };
}

async function executeCppPiston(userCode, testCases = [], functionName = '') {
    const fn = functionName || '';
    const tests = Array.isArray(testCases) ? testCases : [];

    const toVec = (arr) => `{${arr.join(',')}}`;
    const toArg = (a) => Array.isArray(a) ? `std::vector<int>${toVec(a)}` : (typeof a === 'string' ? `"${String(a).replace(/\\/g, "\\\"\\\\\"").replace(/\"/g, "\\\"\\\"\\\"")}"` : String(a));

  let testBlocks = '';
  tests.forEach((tc) => {
    const args = tc.input || [];
    const expected = tc.expected;
    const callArgs = args.map(toArg);

    if (Array.isArray(expected) && expected.every(n => typeof n === 'number')) {
      testBlocks += `\n    { auto actual = s.${ fn }(${ callArgs.join(', ') }); cout << vecToJson(actual) << "\\n"; } `;
    } else if (typeof expected === 'boolean') {
      testBlocks += `\n    { auto actual = s.${ fn } (${ callArgs.join(', ') }); cout << (actual ? "true" : "false") << "\\n"; } `;
    } else {
      testBlocks += `\n    { auto actual = s.${ fn } (${ callArgs.join(', ') }); cout << actual << "\\n"; } `;
    }
  });

  const mainCpp = `#include < bits / stdc++.h >\nusing namespace std; \nstring vecToJson(const vector<int>& v){string s="["; for(size_t i=0;i<v.size();++i){s += to_string(v[i]); if(i+1<v.size()) s+=","; } s+="]"; return s; }\nint main(){ios::sync_with_stdio(false); cin.tie(nullptr); Solution s;${testBlocks}\n return 0; }`;

    const files = [
    {name: 'solution.hpp', content: userCode },
    {name: 'main.cpp', content: `#include \"solution.hpp\"\n${mainCpp}` }
    ];

    const body = {language: 'cpp', version: '10.2.0', files };
    const start = Date.now();
    const resp = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST', headers: {'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
    const data = await resp.json();
    const end = Date.now();
    if (!resp.ok) {
    throw new Error(data?.message || 'Piston C++ failed');
  }

    const stdout = (data?.run?.stdout || '').trim();
    const lines = stdout.length ? stdout.split(/\r?\n/) : [];

  const results = (tests || []).map((tc, idx) => {
    const line = lines[idx] ?? '';
    let actual;
    try {actual = JSON.parse(line); } catch {actual = line === 'true' ? true : (line === 'false' ? false : Number.isFinite(Number(line)) ? Number(line) : line); }
    return {
        input: tc.input,
    expected: tc.expected,
    actual,
    passed: JSON.stringify(actual) === JSON.stringify(tc.expected)
    };
  });

    return {success: true, results, executionTime: end - start, stderr: data?.run?.stderr };
}

// Start server
app.listen(PORT, () => {
        console.log(`🚀 CodeInterview.AI Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔧 API docs: http://localhost:${PORT}/`);
});

    module.exports = app;
