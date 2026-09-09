import React, { useState } from 'react';
import { Send, MapPin, DollarSign } from 'lucide-react';

interface ChatComposerProps {
  onSendMessage: (text: string, offerAmount?: number) => void;
  disabled?: boolean;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({ onSendMessage, disabled = false }) => {
  const [text, setText] = useState('');
  const [isOfferMode, setIsOfferMode] = useState(false);
  const [offerInput, setOfferInput] = useState('');

  const quickPrompts = [
    'Can we meet at the Student Union?',
    'Can we meet at the Science Library lobby?',
    'Is the price negotiable?',
    'What hours work best for you today?'
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() && !offerInput) return;

    if (isOfferMode && offerInput) {
      const amount = Number(offerInput);
      onSendMessage(text.trim() || `I would like to offer \$${amount} for this item.`, amount);
      setIsOfferMode(false);
      setOfferInput('');
    } else {
      onSendMessage(text.trim());
    }

    setText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    setText(prompt);
  };

  return (
    <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2">
      {/* Quick shortcuts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setIsOfferMode(!isOfferMode)}
          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg flex items-center gap-1 shrink-0 transition-colors ${
            isOfferMode
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
          }`}
        >
          <DollarSign className="w-3 h-3" />
          <span>Make Offer</span>
        </button>

        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickPrompt(prompt)}
            className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0 transition-colors truncate max-w-[200px]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Offer amount box if toggled */}
      {isOfferMode && (
        <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
            Offer Amount ($):
          </span>
          <input
            type="number"
            min="1"
            value={offerInput}
            onChange={(e) => setOfferInput(e.target.value)}
            placeholder="e.g. 35"
            className="w-24 px-2 py-1 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
            autoFocus
          />
          <span className="text-[11px] text-slate-500">Add a note below (optional)</span>
        </div>
      )}

      {/* Main Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isOfferMode ? 'Add message with offer...' : 'Type a message to the seller...'}
          disabled={disabled}
          className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          type="submit"
          disabled={disabled || (!text.trim() && !offerInput)}
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-colors shadow-sm"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
