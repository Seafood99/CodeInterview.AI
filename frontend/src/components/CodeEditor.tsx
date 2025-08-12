import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  RotateCcw, 
  Settings, 
  Maximize, 
  Minimize,
  Copy,
  Check
} from 'lucide-react';
import { Language } from '../types/interview';

interface CodeEditorProps {
  initialCode: string;
  language: Language;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: Language) => void;
  onRun: () => void;
  isRunning?: boolean;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  language,
  onCodeChange,
  onLanguageChange,
  onRun,
  isRunning = false,
  readOnly = false
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<'vs-dark' | 'vs-light'>('vs-dark');
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<any>(null);

  const languageOptions: { value: Language; label: string; monacoLang: string }[] = [
    { value: 'javascript', label: 'JavaScript', monacoLang: 'javascript' },
    { value: 'python', label: 'Python', monacoLang: 'python' },
    { value: 'java', label: 'Java', monacoLang: 'java' },
    { value: 'cpp', label: 'C++', monacoLang: 'cpp' }
  ];

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleReset = () => {
    if (editorRef.current) {
      editorRef.current.setValue(initialCode);
      onCodeChange(initialCode);
    }
  };

  const handleCopyCode = async () => {
    const code = editorRef.current?.getValue() || '';
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const currentLangOption = languageOptions.find(lang => lang.value === language);

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${isFullscreen ? 'fixed inset-4 z-50' : 'h-96'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={readOnly}
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'vs-dark' ? 'vs-light' : 'vs-dark')}
            className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'vs-dark' ? '🌙' : '☀️'}
          </button>

          {/* Font Size */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setFontSize(Math.max(10, fontSize - 2))}
              className="px-1 text-sm text-gray-600 hover:text-gray-800"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-xs text-gray-500 w-8 text-center">{fontSize}</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="px-1 text-sm text-gray-600 hover:text-gray-800"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Copy Button */}
          <button
            onClick={handleCopyCode}
            className="p-1.5 text-gray-600 hover:text-gray-800 transition-colors"
            title="Copy Code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>

          {/* Reset Button */}
          {!readOnly && (
            <button
              onClick={handleReset}
              className="p-1.5 text-gray-600 hover:text-gray-800 transition-colors"
              title="Reset Code"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          {/* Run Button */}
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-3 w-3" />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-gray-600 hover:text-gray-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className={`${isFullscreen ? 'h-full' : 'h-80'}`}>
        <Editor
          height="100%"
          language={currentLangOption?.monacoLang || 'javascript'}
          theme={theme}
          value={initialCode}
          onChange={(value) => onCodeChange(value || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize,
            minimap: { enabled: isFullscreen },
            scrollBeyondLastLine: false,
            readOnly,
            wordWrap: 'on',
            lineNumbers: 'on',
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            snippetSuggestions: 'inline',
          }}
        />
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Language: {currentLangOption?.label}</span>
            <span>•</span>
            <span>Theme: {theme === 'vs-dark' ? 'Dark' : 'Light'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Press Ctrl+/ for shortcuts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;