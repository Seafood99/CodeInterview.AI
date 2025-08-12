import { AIInteraction, Language } from '../types/interview';
import { API_BASE_URL } from '../config';

export class AIService {
  private static instance: AIService;
  private interactionHistory: AIInteraction[] = [];

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private async callGranite(prompt: string, system?: string): Promise<string> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, system })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI error');
      return data.output as string;
    } catch (e) {
      console.warn('Granite call failed, falling back to mock:', e);
      return '';
    }
  }

  async chat(userPrompt: string, code: string, language: Language, problemTitle?: string): Promise<string> {
    const system = 'You are an AI coding interview assistant. Be concise, actionable, and friendly. Use bullet points when helpful.';
    const prompt = `Problem: ${problemTitle || 'N/A'}\nLanguage: ${language}\nUser message: ${userPrompt}\n\nIf code context is relevant, consider it:\n${code || '(no code provided)'}`;

    const granite = await this.callGranite(prompt, system);
    if (granite) {
      const interaction: AIInteraction = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type: 'explanation',
        userQuery: userPrompt,
        aiResponse: granite,
        codeContext: code
      };
      this.interactionHistory.push(interaction);
      return granite;
    }

    // Mock fallback
    return `🤖 (mock) I understand: "${userPrompt}"\n\nTry one of these:\n• Ask for a hint\n• Ask to explain your code\n• Ask for debugging help\n• Ask to optimize your solution`;
  }

  // Mock IBM Granite AI responses with Granite fallback
  async getHint(problemId: number, code: string, language: Language, currentStep?: string): Promise<string> {
    // Try Granite first
    const granite = await this.callGranite(
      `Provide a helpful, concise hint for problem ${problemId}. Code (may be partial):\n${code}\nLanguage: ${language}.`
    );
    if (granite) return granite;

    // Mock fallback
    await this.delay(1000);
    const hints: { [key: number]: string[] } = {
      1: [
        "Think about using a hash map to store numbers you've seen and their indices.",
        "For each number, check if its complement (target - current) exists in your hash map.",
        "Remember to return the indices, not the values themselves."
      ],
      2: [
        "Use a stack to validate matching brackets.",
        "Push opening brackets and check pairs when encountering closing ones.",
        "Ensure the stack is empty at the end."
      ],
      3: [
        "Consider using the sliding window technique with two pointers.",
        "Use a Set or Map to keep track of characters in the current window.",
        "When you find a duplicate, move the left pointer to eliminate it."
      ]
    };

    const problemHints = hints[problemId] || ["Try breaking down the problem into smaller steps."];
    const randomHint = problemHints[Math.floor(Math.random() * problemHints.length)];

    const interaction: AIInteraction = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: 'hint',
      userQuery: `Get hint for problem ${problemId}`,
      aiResponse: randomHint,
      codeContext: code
    };

    this.interactionHistory.push(interaction);
    return `💡 **AI Hint**: ${randomHint}`;
  }

  async explainCode(code: string, language: Language): Promise<string> {
    // Try Granite first
    const granite = await this.callGranite(
      `Explain this ${language} code in a structured, concise way with bullet points and time complexity if applicable. Code:\n${code}`
    );
    if (granite) return granite;

    await this.delay(1500);

    if (!code.trim()) {
      return "🤔 **Code Explanation**: No code provided yet. Start writing your solution and I'll help explain it!";
    }

    let explanation = "📋 **Code Analysis**:\n\n";

    if (code.includes('function') || code.includes('def') || code.includes('public')) {
      explanation += "✅ Good! You've defined a function structure.\n";
    }

    if (code.includes('for') || code.includes('while')) {
      explanation += "🔄 I see you're using loops - make sure to consider the time complexity.\n";
    }

    if (code.includes('map') || code.includes('Map') || code.includes('dict') || code.includes('HashMap')) {
      explanation += "🗂️ Excellent! Using hash maps can significantly improve performance.\n";
    }

    if (code.includes('return')) {
      explanation += "↩️ Don't forget to verify your return value matches the expected output format.\n";
    }

    explanation += "\n💭 **Suggestion**: Consider adding comments to explain your logic!";

    const interaction: AIInteraction = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: 'explanation',
      userQuery: 'Explain my code',
      aiResponse: explanation,
      codeContext: code
    };

    this.interactionHistory.push(interaction);
    return explanation;
  }

  async debugCode(code: string, error: string, language: Language): Promise<string> {
    const granite = await this.callGranite(
      `You are a debugging assistant. Given this ${language} code and error hint, give 2-3 precise steps to fix it.\nCode:\n${code}\nError/Context: ${error}`
    );
    if (granite) return granite;

    await this.delay(1200);

    let debugSuggestion = "🐛 **Debug Assistant**:\n\n";

    if (error.includes('undefined')) {
      debugSuggestion += "❗ **Undefined Error**: Check if you're accessing variables or properties that might not exist.\n";
      debugSuggestion += "💡 Try using optional chaining (?.) or add null checks.\n";
    } else if (error.includes('syntax')) {
      debugSuggestion += "❗ **Syntax Error**: Look for missing brackets, semicolons, or incorrect syntax.\n";
      debugSuggestion += "💡 Check your IDE's syntax highlighting for clues.\n";
    } else if (error.includes('type')) {
      debugSuggestion += "❗ **Type Error**: Make sure you're using the correct data types.\n";
      debugSuggestion += "💡 Check if you need to convert between string/number/array types.\n";
    } else {
      debugSuggestion += "❗ **Error Detected**: Let me analyze your code...\n";
      
      if (code.includes('length') && !code.includes('null') && !code.includes('undefined')) {
        debugSuggestion += "💡 Consider checking if arrays/strings are not null before accessing .length\n";
      }
    }

    debugSuggestion += "\n🔍 **Pro Tip**: Add console.log statements to trace your variable values!";

    const interaction: AIInteraction = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: 'debug',
      userQuery: `Debug error: ${error}`,
      aiResponse: debugSuggestion,
      codeContext: code
    };

    this.interactionHistory.push(interaction);
    return debugSuggestion;
  }

  async optimizeCode(code: string, language: Language): Promise<string> {
    const granite = await this.callGranite(
      `Suggest performance optimizations for this ${language} code. Provide 3 bullet points and big-O where relevant. Code:\n${code}`
    );
    if (granite) return granite;

    await this.delay(1800);

    let optimization = "⚡ **Code Optimization Suggestions**:\n\n";

    if (code.includes('for') && code.includes('for')) {
      optimization += "🔄 **Nested Loops Detected**: Consider if you can reduce time complexity with hash maps or other data structures.\n";
    }

    if (code.includes('slice') || code.includes('substring')) {
      optimization += "✂️ **String Operations**: These create new strings - consider if you can use indices instead.\n";
    }

    if (code.includes('push') && code.includes('for')) {
      optimization += "📊 **Array Operations**: If you know the final size, consider pre-allocating the array.\n";
    }

    optimization += "\n💎 **Performance Tips**:\n";
    optimization += "• Use early returns when possible\n";
    optimization += "• Consider edge cases to avoid unnecessary iterations\n";
    optimization += "• Cache frequently accessed values in variables\n";

    const interaction: AIInteraction = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: 'optimization',
      userQuery: 'Optimize my code',
      aiResponse: optimization,
      codeContext: code
    };

    this.interactionHistory.push(interaction);
    return optimization;
  }

  getInteractionHistory(): AIInteraction[] {
    return this.interactionHistory;
  }

  clearHistory(): void {
    this.interactionHistory = [];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}