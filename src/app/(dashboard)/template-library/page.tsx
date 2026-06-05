'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookTemplate, Search, Sparkles, ArrowRight } from 'lucide-react';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import { TEMPLATES, type TemplateData } from '@/lib/templates';
import { BUSINESS_TYPES } from '@/lib/verticals/config';
import { type BusinessType } from '@/types';
import { cn } from '@/lib/utils/cn';
import ApplyTemplateModal from '@/components/templates/ApplyTemplateModal';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function TemplateLibraryPage() {
  const { businessType, verticalConfig } = useBusinessVertical();
  const [selectedCategory, setSelectedCategory] = useState<BusinessType | 'all'>(businessType);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);

  const categories = [
    { id: 'all' as const, name: 'All Templates' },
    ...BUSINESS_TYPES.map((bt) => ({ id: bt.id as BusinessType | 'all', name: bt.name })),
  ];

  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesCategory =
      selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isRecommended = (template: TemplateData) => {
    return template.category === businessType;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookTemplate className="w-6 h-6 text-brand-500" />
          Template Library
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Pre-built AR templates for your {verticalConfig.arExperienceLabel} experiences
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as BusinessType | 'all')}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              selectedCategory === cat.id
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                : 'bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:border-brand-400 dark:hover:border-brand-500'
            )}
          >
            {cat.name}
            {cat.id === businessType && selectedCategory !== cat.id && (
              <span className="ml-1 text-[10px] bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded-md">
                Your Type
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Recommended Banner */}
      {selectedCategory === 'all' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/50 rounded-xl flex items-center gap-3"
        >
          <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0" />
          <p className="text-sm text-brand-700 dark:text-brand-300">
            Templates tagged with <span className="font-semibold">{BUSINESS_TYPES.find(b => b.id === businessType)?.name}</span> are recommended for your business.
          </p>
        </motion.div>
      )}

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.templateId}
              variants={cardVariant}
              whileHover={{
                scale: 1.02,
                rotateX: 3,
                rotateY: -3,
                transition: { duration: 0.2 },
              }}
              className="perspective-1000 group"
            >
              <div
                className={cn(
                  'preserve-3d glass-card overflow-hidden cursor-pointer transition-all duration-300',
                  isRecommended(template) && 'ring-1 ring-brand-400/50 dark:ring-brand-500/30'
                )}
                onClick={() => setSelectedTemplate(template)}
              >
                {/* Template Preview Area */}
                <div className={`h-40 bg-gradient-to-br ${template.gradient} relative overflow-hidden`}>
                  {/* 3D Geometry Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {template.geometryType === 'plate' && (
                        <div className="w-24 h-6 rounded-full bg-white/30 backdrop-blur-sm border border-white/20" />
                      )}
                      {template.geometryType === 'box' && (
                        <div className="w-16 h-16 rounded-lg bg-white/30 backdrop-blur-sm border border-white/20" style={{ transform: 'rotateX(25deg) rotateY(-35deg)', transformStyle: 'preserve-3d' }} />
                      )}
                      {template.geometryType === 'ring' && (
                        <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm border-[6px] border-white/20" />
                      )}
                      {template.geometryType === 'building' && (
                        <div className="w-12 h-24 rounded-lg bg-white/30 backdrop-blur-sm border border-white/20" />
                      )}
                      {template.geometryType === 'plane' && (
                        <div className="w-24 h-16 rounded-lg bg-white/30 backdrop-blur-sm border border-white/20" style={{ transform: 'rotateX(15deg)', transformStyle: 'preserve-3d' }} />
                      )}
                    </motion.div>
                  </div>

                  {/* Recommended Badge */}
                  {isRecommended(template) && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-white" />
                      <span className="text-[10px] font-semibold text-white">Recommended</span>
                    </div>
                  )}

                  {/* Geometry Type Badge */}
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/20 backdrop-blur-md rounded-lg">
                    <span className="text-[10px] font-semibold text-white uppercase tracking-wider">
                      {template.geometryType}
                    </span>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {template.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-400 font-medium">
                      {BUSINESS_TYPES.find(b => b.id === template.category)?.name || template.category}
                    </span>
                    <div className="flex items-center gap-1 text-brand-500 dark:text-brand-400 text-xs font-medium group-hover:translate-x-1 transition-transform">
                      Use
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-16 text-center">
          <BookTemplate className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No templates found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Try adjusting your search or filter to find templates for your {verticalConfig.arExperienceLabel}.
          </p>
        </div>
      )}

      {/* Apply Template Modal */}
      <ApplyTemplateModal
        isOpen={!!selectedTemplate}
        template={selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
      />
    </div>
  );
}