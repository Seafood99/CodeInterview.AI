const http = require('http');

// Test health endpoint
function testHealth() {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Health check: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Response:', JSON.parse(data));
    });
  });

  req.on('error', (err) => {
    console.error('❌ Health check failed:', err.message);
  });

  req.end();
}

// Test problems endpoint
function testProblems() {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/problems',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Problems API: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      const problems = JSON.parse(data);
      console.log(`Found ${problems.length} problems`);
    });
  });

  req.on('error', (err) => {
    console.error('❌ Problems API failed:', err.message);
  });

  req.end();
}

// Test code execution
function testCodeExecution() {
  const postData = JSON.stringify({
    code: 'function twoSum(nums, target) { const map = new Map(); for (let i=0;i<nums.length;i++){ const c=target-nums[i]; if(map.has(c)){return [map.get(c), i];} map.set(nums[i], i);} return []; }',
    language: 'javascript',
    functionName: 'twoSum',
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] }
    ]
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/execute',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Code execution: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('Execution result:', result.success ? 'SUCCESS' : 'FAILED');
        if (result.results) {
          console.log(`Test cases: ${result.results.length}`);
          result.results.forEach((tc, i) => {
            console.log(`  Test ${i + 1}: ${tc.passed ? 'PASS' : 'FAIL'}`);
          });
        }
      } catch (e) {
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ Code execution failed:', err.message);
  });

  req.write(postData);
  req.end();
}

// Run all tests
console.log('🧪 Testing CodeInterview.AI Backend...\n');

setTimeout(() => testHealth(), 1000);
setTimeout(() => testProblems(), 2000);
setTimeout(() => testCodeExecution(), 3000);

console.log('Tests will run in 1-3 seconds...');
