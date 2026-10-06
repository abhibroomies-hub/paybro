/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { RulesManager } from './components/RulesManager';
import { RuleBuilderModal } from './components/RuleBuilderModal';
import { CheckoutSimulator } from './components/CheckoutSimulator';
import { ShopifyIntegrationHub } from './components/ShopifyIntegrationHub';
import { BannerCustomizer } from './components/BannerCustomizer';
import { DeveloperCodeExport } from './components/DeveloperCodeExport';
import { ShopifyAdminEmbeddedView } from './components/ShopifyAdminEmbeddedView';
import { HindiGuideModal } from './components/HindiGuideModal';
import { 
  INITIAL_RULES, 
  INITIAL_STORE_CONFIG, 
  INITIAL_ANALYTICS, 
  INITIAL_BANNER_DESIGN 
} from './data/mockData';
import { PrepaidRule, ShopifyStoreConfig, BannerDesignConfig } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [rules, setRules] = useState<PrepaidRule[]>(INITIAL_RULES);
  const [storeConfig, setStoreConfig] = useState<ShopifyStoreConfig>(INITIAL_STORE_CONFIG);
  const [bannerDesign, setBannerDesign] = useState<BannerDesignConfig>(INITIAL_BANNER_DESIGN);
  const [analytics, setAnalytics] = useState(INITIAL_ANALYTICS);

  // Modal states
  const [isHindiGuideOpen, setIsHindiGuideOpen] = useState(false);
  const [isRuleBuilderOpen, setIsRuleBuilderOpen] = useState(false);
  const [ruleToEdit, setRuleToEdit] = useState<PrepaidRule | null>(null);

  // Rule Handlers
  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const handleDeleteRule = (ruleId: string) => {
    if (confirm('Are you sure you want to delete this offer rule?')) {
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
    }
  };

  const handleDuplicateRule = (rule: PrepaidRule) => {
    const duplicated: PrepaidRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      name: `${rule.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      priority: rule.priority + 1,
    };
    setRules((prev) => [...prev, duplicated]);
  };

  const handleEditRule = (rule: PrepaidRule) => {
    setRuleToEdit(rule);
    setIsRuleBuilderOpen(true);
  };

  const handleOpenCreateRule = () => {
    setRuleToEdit(null);
    setIsRuleBuilderOpen(true);
  };

  const handleSaveRule = (savedRule: PrepaidRule) => {
    setRules((prev) => {
      const exists = prev.some((r) => r.id === savedRule.id);
      if (exists) {
        return prev.map((r) => (r.id === savedRule.id ? savedRule : r));
      }
      return [savedRule, ...prev];
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        storeConfig={storeConfig}
        onOpenHindiGuide={() => setIsHindiGuideOpen(true)}
        onOpenCreateRule={handleOpenCreateRule}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'overview' && (
          <DashboardOverview
            rules={rules}
            onToggleRule={handleToggleRule}
            analytics={analytics}
            storeConfig={storeConfig}
            onOpenCreateRule={handleOpenCreateRule}
            onNavigateToSimulator={() => setActiveTab('simulator')}
            onNavigateToIntegration={() => setActiveTab('integration')}
            onNavigateToRules={() => setActiveTab('rules')}
          />
        )}

        {activeTab === 'rules' && (
          <RulesManager
            rules={rules}
            onToggleRule={handleToggleRule}
            onDeleteRule={handleDeleteRule}
            onDuplicateRule={handleDuplicateRule}
            onEditRule={handleEditRule}
            onOpenCreateModal={handleOpenCreateRule}
          />
        )}

        {activeTab === 'shopify-admin' && (
          <ShopifyAdminEmbeddedView
            rules={rules}
            onToggleRule={handleToggleRule}
            onDeleteRule={handleDeleteRule}
            onDuplicateRule={handleDuplicateRule}
            onEditRule={handleEditRule}
            onOpenCreateRule={handleOpenCreateRule}
            analytics={analytics}
            storeConfig={storeConfig}
            bannerDesign={bannerDesign}
            onUpdateDesign={setBannerDesign}
            onNavigateToSimulator={() => setActiveTab('simulator')}
            onNavigateToIntegration={() => setActiveTab('integration')}
          />
        )}

        {activeTab === 'simulator' && (
          <CheckoutSimulator
            rules={rules}
            bannerDesign={bannerDesign}
          />
        )}

        {activeTab === 'integration' && (
          <ShopifyIntegrationHub
            storeConfig={storeConfig}
            onUpdateConfig={setStoreConfig}
            onOpenHindiGuide={() => setIsHindiGuideOpen(true)}
          />
        )}

        {activeTab === 'banner' && (
          <BannerCustomizer
            bannerDesign={bannerDesign}
            onUpdateDesign={setBannerDesign}
          />
        )}

        {activeTab === 'code' && (
          <DeveloperCodeExport
            rules={rules}
            storeConfig={storeConfig}
            bannerDesign={bannerDesign}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-500 text-xs py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Prepaid Perks</span>
            <span>&bull;</span>
            <span>Shopify Checkout Extensibility &amp; Discount Functions Engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsHindiGuideOpen(true)}
              className="hover:text-amber-300 transition-colors"
            >
              🇮🇳 Complete Setup Roadmap (हिंदी)
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className="hover:text-white transition-colors"
            >
              Export Shopify CLI Files
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HindiGuideModal
        isOpen={isHindiGuideOpen}
        onClose={() => setIsHindiGuideOpen(false)}
        appUrl={storeConfig.appUrl}
      />

      <RuleBuilderModal
        isOpen={isRuleBuilderOpen}
        onClose={() => setIsRuleBuilderOpen(false)}
        onSaveRule={handleSaveRule}
        ruleToEdit={ruleToEdit}
      />

    </div>
  );
}
