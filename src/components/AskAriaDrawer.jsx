import React, { useState } from 'react';

const KNOWLEDGE_BANK = [
  {
    q: "what happens on day 11",
    match: ["day 11", "switch", "rebuy", "auto-rebuy"],
    a: "On day 11 the switch opens! During days 1 to 10, every daily result automatically buys a small rebuy module. From day 11 onwards, you choose: leave the switch ON to keep compounding results into new modules, or turn the switch OFF to send each day's USDT directly to your app wallet."
  },
  {
    q: "what is a rain day",
    match: ["rain", "rain day", "losing", "zero", "bad day"],
    a: "A rain day is a day when the trading engine makes zero profit or incurs a market drawdown. On rain days, members receive 0 USDT. There is no penalty, but your module's 2x delivery timeline simply extends by one day."
  },
  {
    q: "when do i get my money back",
    match: ["money back", "capital", "breakeven", "200 days", "initial"],
    a: "At the engine's historical average of ~0.50% daily, your original purchase amount returns around day 200 (100% of purchase price). Around day 400, your module reaches its full 2x (200%) cap and then completes."
  },
  {
    q: "what is a module",
    match: ["what is a module", "module size", "how much", "cost"],
    a: "A module is a purchase of software access to the Delta One AI algorithmic trading engine, starting from 1,000 USDT on BNB Smart Chain. It is a software purchase, not a bank deposit. It runs until it delivers 200% (or 220% for Believers) of its purchase value."
  },
  {
    q: "is it guaranteed",
    match: ["guarantee", "risk", "promise", "safe", "lose money"],
    a: "No. Nothing is guaranteed. Every figure shown is an illustration at the engine's average daily result. Real results vary daily from zero to several percent. Capital is at risk, and you can lose some or all of the money you put in."
  },
  {
    q: "what is the line balance rule",
    match: ["line balance", "50%", "rule", "qualification", "qv"],
    a: "The Line Balance Rule ensures distributors cannot qualify for rank commissions from just one single high-volume leg. For Fuji and Kilimanjaro, no more than 50% of your qualifying volume (QV) can come from any one line. At higher ranks, the cap drops to 33.3%, 25%, and 20%."
  },
  {
    q: "how do i withdraw",
    match: ["withdraw", "payout", "wallet", "gas", "minimum"],
    a: "You can withdraw from your app wallet at any time once you have at least 5 USDT. Withdrawals are processed instantly on the BNB Smart Chain with standard network gas fees deducted."
  }
];

export default function AskAriaDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: "aria",
      text: "Hello, I am Aria. Ask me anything about the Momentum Plan: what you buy, what it pays, and what it never promises."
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    setMessages(prev => [...prev, { sender: "user", text }]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let matchedAnswer = null;

      for (const item of KNOWLEDGE_BANK) {
        if (item.match.some(m => lower.includes(m))) {
          matchedAnswer = item.a;
          break;
        }
      }

      if (!matchedAnswer) {
        matchedAnswer = "I don't have that specific question in my verified answer bank. You can speak directly to a live human agent on Zoom, or check the library shelf documents which contain all official rules.";
      }

      setMessages(prev => [...prev, { sender: "aria", text: matchedAnswer }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#0B1A33] border-l border-[#2A3C5E] text-white flex flex-col h-full shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-[#1F2F4D] flex items-center justify-between bg-[#12254A]">
          <div className="flex items-center gap-3">
            <img src="/img/host.svg" alt="Aria" className="w-10 h-10 rounded-full border-2 border-d1blue" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Aria Live</span>
                <span className="w-2 h-2 rounded-full bg-d1ok animate-pulse"></span>
              </div>
              <p className="text-[11px] text-[#A9BAD6]">Online 24/7 · Answers from published rules</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#A9BAD6] hover:text-white text-xl p-1 font-bold"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Zoom live handoff notice */}
        <div className="bg-[#16295A] p-3 px-4 border-b border-[#2A3C5E] text-xs flex items-center justify-between">
          <span className="text-[#EEF3FA]">Need a human specialist?</span>
          <a
            href="https://deltavip24.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-full bg-d1blue text-white font-semibold hover:bg-d1blue-ink flex items-center gap-1.5 transition-colors"
          >
            <span>Live Zoom</span> →
          </a>
        </div>

        {/* Message container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-d1blue text-white rounded-br-none'
                    : 'bg-[#12254A] border border-[#27406B] text-[#EEF3FA] rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#12254A] border border-[#27406B] text-[#A9BAD6] rounded-2xl p-3 text-xs rounded-bl-none flex items-center gap-1.5">
                <span>Aria is thinking</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick prompt chips */}
        <div className="p-3 border-t border-[#1F2F4D] bg-[#0E1F3D]">
          <p className="text-[11px] text-[#A9BAD6] mb-2 font-medium">Suggested questions:</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              "What happens on day 11?",
              "What is a rain day?",
              "When do I get my money back?",
              "What is Line Balance Rule?",
              "Is it guaranteed?"
            ].map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(q)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-[#12254A] hover:bg-[#1A3466] text-[#A9BAD6] hover:text-white border border-[#27406B] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-[#1F2F4D] bg-[#0B1A33] flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything about the plan…"
            className="flex-1 bg-[#12254A] border border-[#2A3C5E] rounded-full px-4 py-2 text-xs text-white placeholder-[#A9BAD6] focus:outline-none focus:border-d1gold"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-d1gold text-[#0B1A33] font-bold text-xs rounded-full hover:brightness-105 transition-all"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

