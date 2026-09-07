import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, HelpCircle, ArrowRight, Settings, AlertTriangle, ShieldCheck } from 'lucide-react';
import { FaqDoc, Product } from '../../types';
import faqDocsData from '../../data/faq_docs.json';
import productsData from '../../data/products.json';
import { useLanguage } from '../../context/LanguageContext';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  sourceDoc?: FaqDoc;
  linkedProducts?: Product[];
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: lang === 'mr'
        ? 'नमस्कार! मी नाईक फूड्सचा AI सहाय्यक आहे. आमची पारंपारिक लोणची, ठेचा, गोडा मसाला, उपवासाचे पदार्थ किंवा डिलिव्हरी संदर्भात काहीही विचारा!'
        : 'Namaskar! I am Naik Foods AI Pantry Assistant. Ask me anything about our authentic pickles, stone-pounded thecha, Goda masala, Jain/Upvas options, shelf life, or delivery!'
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [showDevModal, setShowDevModal] = useState(false);
  const [devApiKey, setDevApiKey] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    "Which products are Jain-friendly (no onion/garlic)?",
    "What is the shelf life and storage for pickles?",
    "What oils do you use in pickles and thechas?",
    "Do you deliver to Pune and Bengaluru?",
    "What is the difference between Goda & Garam Masala?"
  ];

  // In-browser client document retriever
  const handleAskQuestion = (questionText: string) => {
    const q = questionText.trim();
    if (!q) return;

    // Add user message
    const userMsg: Message = { sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');

    // Tokenize query
    const qTokens = q.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(t => t.length > 2);

    // Score FAQ documents
    const faqs = faqDocsData as FaqDoc[];
    const scoredFaqs = faqs.map(doc => {
      let score = 0;
      const docTokens = (doc.question + ' ' + doc.content + ' ' + doc.tags.join(' ')).toLowerCase();

      qTokens.forEach(t => {
        if (docTokens.includes(t)) {
          score += 2;
          if (doc.tags.some(tag => tag.includes(t))) score += 2;
          if (doc.question.toLowerCase().includes(t)) score += 3;
        }
      });

      return { doc, score };
    }).sort((a, b) => b.score - a.score);

    const bestDoc = scoredFaqs[0]?.score > 1 ? scoredFaqs[0].doc : null;

    // Check relevant products
    const products = productsData as Product[];
    const matchedProducts = products.filter(p => {
      const pStr = (p.title + ' ' + p.category + ' ' + p.tags.join(' ') + ' ' + p.ingredients.join(' ')).toLowerCase();
      return qTokens.some(t => pStr.includes(t));
    }).slice(0, 2);

    let answerText = '';
    if (bestDoc) {
      answerText = bestDoc.content;
    } else if (matchedProducts.length > 0) {
      answerText = `Here is what our pantry catalogue says: ${matchedProducts[0].title} is made with ${matchedProducts[0].ingredients.slice(0, 4).join(', ')}. ${matchedProducts[0].description}`;
    } else {
      answerText = lang === 'mr'
        ? 'मला तुमच्या प्रश्नाचे थेट उत्तर सापडले नाही. पण आमची सर्व उत्पादने FSSAI प्रमाणित आणि १००% शुद्ध तेलात बनवलेली आहेत. अधिक माहितीसाठी आमच्या कस्टमर केअरशी संपर्क साधा.'
        : 'I could not find an exact match in our offline pantry index. However, all Naik Foods recipes are 100% vegetarian, FSSAI certified, and free of artificial colors. You can also contact our support at support@naikfoods.co.in.';
    }

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: answerText,
          sourceDoc: bestDoc || undefined,
          linkedProducts: matchedProducts.length > 0 ? matchedProducts : undefined
        }
      ]);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col h-[650px] max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-100 bg-amber-500/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-700 text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heritage text-base font-bold text-stone-900">
                  Naik Foods AI Assistant
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Client-side QA
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Instant semantic retrieval from pantry knowledge base
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowDevModal(true)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
              title="Developer LLM Configuration"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Question Prompts */}
        <div className="px-4 py-2 bg-amber-50/40 border-b border-amber-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-amber-900 flex-shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            Quick:
          </span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleAskQuestion(qp)}
              className="text-xs px-2.5 py-1 rounded-full bg-white border border-amber-200 text-stone-700 hover:bg-amber-100 hover:text-amber-950 transition flex-shrink-0"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-amber-700 text-white rounded-tr-none'
                    : 'bg-stone-100 text-stone-800 rounded-tl-none border border-stone-200'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                {/* Source document citation */}
                {msg.sourceDoc && (
                  <div className="mt-2 pt-2 border-t border-stone-200 text-[11px] text-stone-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Verified Source: <strong>{msg.sourceDoc.category}</strong></span>
                  </div>
                )}
              </div>

              {/* Linked Product Cards */}
              {msg.linkedProducts && msg.linkedProducts.length > 0 && (
                <div className="mt-2 flex gap-2 w-full max-w-[85%]">
                  {msg.linkedProducts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p.id);
                        onClose();
                      }}
                      className="flex items-center gap-2 p-2 bg-white rounded-xl border border-amber-200 shadow-sm hover:border-amber-400 cursor-pointer flex-1 transition"
                    >
                      <img src={p.images[0]} alt={p.title} className="w-10 h-10 object-cover rounded-lg" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-stone-900 truncate">{p.title}</p>
                        <p className="text-[11px] text-amber-800 font-semibold">₹{p.price}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion(inputQuestion);
          }}
          className="p-3 border-t border-stone-200 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={e => setInputQuestion(e.target.value)}
            placeholder={lang === 'mr' ? 'काहीही विचारा (उदा. गोडा मसाला, लोणची टिकवणे)...' : 'Ask about ingredients, shelf life, Jain/Upvas, delivery...'}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim()}
            className="p-2.5 rounded-xl bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-40 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Dev Settings Modal */}
        {showDevModal && (
          <div className="absolute inset-0 bg-stone-900/80 z-20 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-amber-300">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h4 className="font-bold text-stone-900 flex items-center gap-2 text-sm">
                  <Settings className="w-4 h-4 text-amber-600" />
                  Developer Cloud LLM Mode (Optional)
                </h4>
                <button onClick={() => setShowDevModal(false)} className="text-stone-400 hover:text-stone-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-3 text-xs text-stone-600 space-y-2">
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Security Notice:</strong> The prototype runs 100% client-side with zero secrets. Never commit API keys.
                  </p>
                </div>

                <p>
                  To enable naturalized responses via OpenAI/Gemini in development:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-stone-700 font-mono text-[11px] bg-stone-100 p-2.5 rounded">
                  <li>Create <code>.env.local</code></li>
                  <li>Add <code>VITE_OPENAI_API_KEY=your_key</code></li>
                  <li>Run <code>npm run dev</code></li>
                </ol>

                <label className="block pt-2 font-medium text-stone-700">
                  Temporary in-memory test key (never stored):
                </label>
                <input
                  type="password"
                  value={devApiKey}
                  onChange={e => setDevApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  onClick={() => setShowDevModal(false)}
                  className="px-4 py-2 rounded-xl bg-amber-700 text-white text-xs font-semibold hover:bg-amber-800"
                >
                  Save & Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
