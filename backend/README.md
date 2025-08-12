# CodeInterview.AI Backend

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Test API
```bash
# Health check
curl http://localhost:5000/health

# Get problems
curl http://localhost:5000/api/problems

# Execute code
curl -X POST http://localhost:5000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function twoSum(nums, target) { return [0,1]; }",
    "language": "javascript",
    "testCases": [
      {"input": [[2,7,11,15], 9], "expected": [0,1]}
    ]
  }'
```

## 📡 API Endpoints

### GET `/health`
Health check endpoint

### GET `/api/problems`
Get available coding problems

### POST `/api/execute`
Execute code with test cases

### POST `/api/submit`
Submit solution for review

## 🔧 Features

- ✅ **Code Execution** - JavaScript & Python (mock)
- ✅ **Test Case Validation** - Real test case checking
- ✅ **Solution Submission** - Track user progress
- ✅ **CORS Enabled** - Frontend integration ready
- ✅ **Security Headers** - Helmet middleware
- ✅ **Logging** - Morgan HTTP logger

## 🚨 Demo Mode

**Current limitations for demo:**
- JavaScript execution uses `eval()` (not production safe)
- Python execution is mocked
- In-memory storage (data lost on restart)

**Production ready features:**
- Docker containerization
- Database persistence
- Security sandboxing
- Rate limiting

## 📁 Project Structure

```
backend/
├── index.js          # Main server file
├── package.json      # Dependencies
└── README.md         # This file
```

## 🎯 Next Steps (Post-Demo)

1. **Database Integration** - MongoDB/PostgreSQL
2. **Docker Containers** - Secure code execution
3. **Authentication** - JWT tokens
4. **Rate Limiting** - Prevent abuse
5. **Monitoring** - Performance metrics
