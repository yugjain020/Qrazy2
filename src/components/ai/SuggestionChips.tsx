'use client';

import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, TrendingUp, Box } from 'lucide-react';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
}

export default function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  const { verticalConfig, businessType } = useBusinessVertical();

  const suggestions = [
    {
      icon: Lightbulb,
      text: `Give me 5 creative AR use cases for a ${businessType} business`,
    },
    {
      icon: TrendingUp,
      text: `How can I use AR to increase sales in my ${verticalConfig.productLabels.singular.toLowerCase()} business?`,
    },
    {
      icon: Box,
      text: `What makes a great 3D model for ${verticalConfig.arExperienceLabel}?`,
    },
    {
      icon: Sparkles,
      text: `Suggest a QR marketing campaign for my ${businessType} business`,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onSelect(suggestion.text)}
          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-xs text-gray-600 dark:text-gray-400 hover:border-brand-400 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-all hover:shadow-sm"
        >
          <suggestion.icon className="w-3.5 h-3.5" />
          <span className="truncate max-w-[200px]">{suggestion.text}</span>
        </motion.button>
      ))}
    </div>
  );
}