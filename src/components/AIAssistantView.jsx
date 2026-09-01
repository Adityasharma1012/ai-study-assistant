import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  User,
  GraduationCap,
  BookOpen,
  HelpCircle,
  Clock,
  ArrowRight,
  Code2,
  Lightbulb,
  Zap,
  Flame
} from 'lucide-react';
import { askAI } from '../services/aiService';
import { studentProfile } from '../data/studentData';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const SUGGESTED_QUESTIONS = [
  {
    id: 'q1',
    prompt: 'Explain binary search simply.',
    tag: 'CS301 • Algorithms',
    icon: Lightbulb,
  },
  {
    id: 'q2',
    prompt: 'Explain recursion with an example.',
    tag: 'CS301 • Foundations',
    icon: Code2,
  },
  {
    id: 'q3',
    prompt: 'Give me 10 DBMS interview questions.',
    tag: 'CS307 • DBMS',
    icon: BookOpen,
  },
  {
    id: 'q4',
    prompt: 'Create a revision plan for my exam.',
    tag: 'Study Strategy',
    icon: Flame,
  },
];

const LOCAL_STORAGE_KEY = 'study_assistant_chat_history';

export const AIAssistantView = ({ setActiveTab }) => {
  const toast = useToast();
  const { currentUser } = useAuth();

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [messages]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  // Send Message Logic
  const handleSendMessage = async (textToSend = input) => {
    const query = (typeof textToSend === 'string' ? textToSend : input).trim();
    if (!query || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setIsLoading(true);

    try {
      const aiResponse = await askAI(query, newHistory);
      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponse.text,
        timestamp: aiResponse.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newHistory, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: '⚠️ An error occurred while generating a response. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Key Down Handler (Enter sends, Shift+Enter new line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Copy AI response
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.info('Response copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Regenerate last AI response
  const handleRegenerate = async () => {
    if (isLoading || messages.length === 0) return;

    // Find the last user prompt
    let lastUserMessage = null;
    let targetIndex = -1;

    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        lastUserMessage = messages[i];
        targetIndex = i;
        break;
      }
    }

    if (!lastUserMessage) return;

    toast.info('Regenerating AI response...');

    // Trim messages up to the last user message
    const trimmedHistory = messages.slice(0, targetIndex + 1);
    setMessages(trimmedHistory);
    setIsLoading(true);

    try {
      const aiResponse = await askAI(lastUserMessage.text, trimmedHistory);
      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponse.text,
        timestamp: aiResponse.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...trimmedHistory, aiMessage]);
    } catch {
      const errorMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: '⚠️ Unable to regenerate response. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...trimmedHistory, errorMessage]);
      toast.error('Failed to regenerate response.');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear Chat
  const handleClearChat = () => {
    if (messages.length === 0) return;
    if (window.confirm('Are you sure you want to clear your current chat history?')) {
      setMessages([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      toast.success('Chat history cleared.');
    }
  };

  // Custom Markdown Formatter for AI output
  const renderFormattedContent = (content) => {
    // Split into code blocks and normal text
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0].trim().match(/^[a-z]+/i) ? lines[0].trim() : 'code';
        const codeContent = lines[0].trim().match(/^[a-z]+/i) ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={idx} className="my-3 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-2 text-xs text-slate-400 font-mono">
              <span>{language}</span>
              <button
                onClick={() => handleCopy(`code-${idx}`, codeContent)}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {copiedId === `code-${idx}` ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-emerald-300 leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // Normal text formatting (headings, lists, bold, tables)
      const lines = part.split('\n');
      return (
        <div key={idx} className="space-y-2 text-sm leading-relaxed">
          {lines.map((line, lineIdx) => {
            const trimmed = line.trim();

            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={lineIdx} className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }
            if (trimmed.startsWith('#### ')) {
              return (
                <h4 key={lineIdx} className="text-sm sm:text-base font-bold text-indigo-600 dark:text-indigo-400 mt-3 mb-1.5">
                  {trimmed.replace('#### ', '')}
                </h4>
              );
            }
            if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
              return (
                <div key={lineIdx} className="flex items-start gap-2 ml-1 text-slate-700 dark:text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <span>{trimmed.replace(/^[*\-]\s+/, '')}</span>
                </div>
              );
            }
            if (/^\d+\.\s/.test(trimmed)) {
              return (
                <div key={lineIdx} className="flex items-start gap-2 ml-1 text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                    {trimmed.match(/^\d+\./)[0]}
                  </span>
                  <span>{trimmed.replace(/^\d+\.\s+/, '')}</span>
                </div>
              );
            }
            if (trimmed.startsWith('> ')) {
              return (
                <blockquote key={lineIdx} className="my-2 border-l-4 border-indigo-500 bg-indigo-50/50 p-3 rounded-r-xl text-xs text-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200">
                  {trimmed.replace('> ', '')}
                </blockquote>
              );
            }
            if (trimmed === '---') {
              return <hr key={lineIdx} className="my-3 border-slate-200 dark:border-slate-800" />;
            }
            if (!trimmed) {
              return <div key={lineIdx} className="h-1" />;
            }

            return (
              <p key={lineIdx} className="text-slate-700 dark:text-slate-200">
                {line}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto rounded-3xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-800/80 dark:bg-slate-900 overflow-hidden">
      {/* 1. Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/80 px-4 sm:px-6 py-3.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-md shadow-indigo-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                StudyMind AI Assistant
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Tutor
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized for {studentProfile.fullName} • CS Semester 5
            </p>
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-rose-400 transition-colors cursor-pointer"
              title="Clear entire conversation"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          /* Empty / Welcome State */
          <div className="flex flex-col items-center justify-center min-h-[420px] text-center max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-xl shadow-indigo-500/25">
              <GraduationCap className="h-8 w-8" />
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-900 ring-2 ring-white dark:ring-slate-900 shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                How can I help your studies today, {studentProfile.name}?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                I can explain complex algorithms, generate sample interview questions, summarize lecture slides, or design exam revision plans.
              </p>
            </div>

            {/* Suggested Prompt Cards */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
              {SUGGESTED_QUESTIONS.map((q) => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.id}
                    onClick={() => handleSendMessage(q.prompt)}
                    className="group relative flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-indigo-500 transition-all cursor-pointer"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors mt-0.5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                        {q.tag}
                      </span>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        "{q.prompt}"
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Render Active Message History */
          messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            const isLastMessage = index === messages.length - 1;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${
                  isUser ? 'justify-end' : 'justify-start'
                } animate-in fade-in duration-200`}
              >
                {/* AI Avatar */}
                {!isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-xs mt-1">
                    <Bot className="h-5 w-5" />
                  </div>
                )}

                {/* Message Bubble Container */}
                <div
                  className={`group relative max-w-2xl rounded-3xl px-4 sm:px-5 py-3.5 shadow-xs ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-slate-50 border border-slate-200/80 dark:bg-slate-800/70 dark:border-slate-700/60 rounded-bl-xs'
                  }`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center justify-between gap-3 mb-1.5 text-[11px]">
                    <span
                      className={`font-bold ${
                        isUser ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {isUser ? studentProfile.fullName : 'StudyMind AI'}
                    </span>
                    <span
                      className={`${
                        isUser ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className="text-sm leading-relaxed">
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      renderFormattedContent(msg.text)
                    )}
                  </div>

                  {/* Action toolbar for AI message */}
                  {!isUser && (
                    <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-emerald-500 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {isLastMessage && !isLoading && (
                        <button
                          onClick={handleRegenerate}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          title="Regenerate this response"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Regenerate</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs shadow-xs mt-1">
                    {studentProfile.initials}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Typing Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 sm:gap-4 animate-in fade-in duration-200">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-xs mt-1">
              <Bot className="h-5 w-5" />
            </div>

            <div className="rounded-2xl rounded-bl-xs border border-slate-200/80 bg-slate-50 px-4 py-3.5 dark:border-slate-700/60 dark:bg-slate-800/70 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  StudyMind AI is analyzing & generating answer
                </span>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Bottom Input Box (ChatGPT-style) */}
      <div className="border-t border-slate-200/80 bg-white p-3 sm:p-4 dark:border-slate-800/80 dark:bg-slate-900 shrink-0">
        <div className="relative flex items-end gap-2 rounded-2xl border border-slate-300 bg-slate-50/80 p-2 shadow-inner focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/60 dark:focus-within:border-indigo-400 dark:focus-within:bg-slate-900 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask a study question, paste code, or request an exam summary... (Enter to send)"
            disabled={isLoading}
            className="max-h-36 flex-1 resize-none bg-transparent px-2.5 py-1 text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder-slate-500 leading-relaxed"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all cursor-pointer ${
              input.trim() && !isLoading
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 hover:scale-105 active:scale-95'
                : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'
            }`}
            title="Send message"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-slate-400 dark:text-slate-500">
          <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for a new line</span>
          <span className="hidden sm:inline">Mock AI Engine Active • API Ready</span>
        </div>
      </div>
    </div>
  );
};
