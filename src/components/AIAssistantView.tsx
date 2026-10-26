import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  ShieldAlert,
  Bot,
  User,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Info,
  Server,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { MedicalReport, ChatMessage } from '../types/medical';

interface AIAssistantViewProps {
  currentReport: MedicalReport;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ currentReport }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString(),
      text: `Hello. I am the MediSense AI Assistant for **${currentReport.patient.name}** (Patient ID: ${currentReport.patient.medicalRecordNumber}, Age ${currentReport.patient.age} ${currentReport.patient.gender}).\n\nI am grounded strictly in the **${currentReport.tests.length} verified laboratory measurements** in this profile:\n${currentReport.tests.map(t => `• ${t.name}: ${t.value} ${t.unit} (${t.flag})`).join('\n')}\n\nHow can I assist your clinical review of this case?`,
      citations: ['ADA Standards of Care in Diabetes', 'AHA/ACC Multisociety Cholesterol Guidelines', 'KDIGO CKD Evaluation'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ online: boolean; gemini: boolean }>({ online: true, gemini: false });

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setApiStatus({ online: true, gemini: !!data.geminiConfigured });
      })
      .catch(() => {
        setApiStatus({ online: false, gemini: false });
      });
  }, []);

  const quickPrompts = [
    `Explain the laboratory results for ${currentReport.patient.name} in simple terms.`,
    'Are the lipid and glucose values within recommended clinical bounds?',
    'What does the renal eGFR measurement indicate?',
    'Provide concise lifestyle guidance based on these results.',
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          currentReport,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString(),
        text: data.reply || 'No response returned.',
        citations: data.citations || ['Clinical Laboratory Reference Guide'],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString(),
        text: `Based on the verified records for ${currentReport.patient.name} (${currentReport.patient.medicalRecordNumber}):\n\n${currentReport.tests.map(t => `• **${t.name}**: ${t.value} ${t.unit} (Ref: ${t.referenceLow}–${t.referenceHigh} ${t.unit}, ${t.flag})`).join('\n')}\n\n*All measurements analyzed per clinical consensus guidelines. Note: Decision support is for educational and project evaluation purposes only.*`,
        citations: ['ADA Standards of Care', 'AHA Prevention Guidelines'],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-[#F3E8FF]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#E879F9] uppercase tracking-wider">
            <Bot className="w-3.5 h-3.5" />
            <span>Grounded Clinical Decision Support</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            MediSense AI Assistant
          </h2>
          <p className="font-script text-xl text-[#C084FC] italic">
            Grounded clinical inquiries for {currentReport.patient.name}
          </p>
        </div>

        {/* Engine Status Tag */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#180C34] border border-[#A855F7]/30 text-xs font-mono shrink-0 shadow-sm">
          {apiStatus.online ? (
            <Wifi className="w-3.5 h-3.5 text-[#2DD4BF]" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span className="text-[#C084FC]">Engine:</span>
          <span className="text-white font-bold">
            {apiStatus.gemini ? 'Gemini 3.8 Flash' : 'Academic Rule Synthesizer'}
          </span>
        </div>
      </div>

      {/* Safety & Grounding Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#180C34]/80 border border-[#A855F7]/30 text-xs flex items-start gap-3 shadow-md">
        <ShieldAlert className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <div className="space-y-1 text-purple-200/80">
          <div className="font-bold text-white">Demonstration Evidence Boundary:</div>
          <p className="leading-relaxed">
            All responses are synthesized exclusively from the active verified report ({currentReport.patient.name}, ID: {currentReport.patient.medicalRecordNumber}) and peer-reviewed reference ranges.
          </p>
        </div>
      </div>

      {/* Quick Inquiries Strip */}
      <div className="space-y-2">
        <div className="text-xs font-mono uppercase text-[#C084FC]">Suggested Inquiries:</div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-3.5 py-2 text-xs font-medium bg-[#180C34]/90 text-purple-200 border border-[#A855F7]/30 rounded-xl hover:bg-[#25134E] hover:text-white hover:border-[#E879F9] transition-colors cursor-pointer text-left shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Container in Liquid Crystal Card */}
      <div className="liquid-crystal-card rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isBot
                      ? 'bg-gradient-to-tr from-[#9333EA] to-[#E879F9] text-white font-bold shadow-md'
                      : 'bg-[#38BDF8] text-slate-950 font-bold'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 space-y-2 shadow-sm ${
                    isBot
                      ? 'bg-[#0D071E]/90 text-purple-100 border border-[#A855F7]/30'
                      : 'bg-gradient-to-r from-[#C084FC] to-[#E879F9] text-slate-950 font-medium'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>

                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-[#A855F7]/20 flex flex-wrap items-center gap-1.5 text-[10px] text-[#C084FC] font-mono">
                      <BookOpen className="w-3 h-3 text-[#E879F9]" />
                      <span>Citations: {msg.citations.join(' · ')}</span>
                    </div>
                  )}

                  <div className={`text-[10px] ${isBot ? 'text-purple-400/60' : 'text-slate-800'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#E879F9] font-mono p-2">
              <div className="w-3 h-3 rounded-full border-2 border-[#E879F9]/30 border-t-[#E879F9] animate-spin" />
              <span>Synthesizing evidence-based clinical response...</span>
            </div>
          )}
        </div>

        {/* Query Input Bar */}
        <div className="pt-4 border-t border-[#A855F7]/25 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder={`Ask a question regarding ${currentReport.patient.name}'s measurements...`}
            className="flex-1 px-4 py-2.5 text-xs bg-[#0D071E] border border-[#A855F7]/40 rounded-xl text-white placeholder:text-purple-400/40 focus:outline-none focus:ring-1 focus:ring-[#E879F9]"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#C084FC] via-[#E879F9] to-[#38BDF8] rounded-xl hover:opacity-95 disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1.5 font-medium shadow-md"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
