/**
 * Design Sandbox Page
 * 
 * Isolated environment for testing design tokens and components
 * without interference from page-specific styles.
 * 
 * Features:
 * - All design tokens visible
 * - Component testing in isolation
 * - No external page styles
 * - Touch target validation (48x48px)
 * 
 * Phase: DEV/HYGIENE Sprint
 */

'use client';

import { useState } from 'react';

export default function DesignSandbox() {
  const [activeTab, setActiveTab] = useState<'tokens' | 'components'>('tokens');

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Design Sandbox
          </h1>
          <p className="text-[var(--text-secondary)]">
            Isolated environment for design token and component testing
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[var(--border-primary)]">
          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'tokens'
                ? 'text-[var(--interactive-primary)] border-b-2 border-[var(--interactive-primary)]'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
            style={{ minHeight: '48px', minWidth: '80px' }}
          >
            Tokens
          </button>
          <button
            onClick={() => setActiveTab('components')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'components'
                ? 'text-[var(--interactive-primary)] border-b-2 border-[var(--interactive-primary)]'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
            style={{ minHeight: '48px', minWidth: '80px' }}
          >
            Components
          </button>
        </div>

        {/* Content */}
        {activeTab === 'tokens' && <TokensPanel />}
        {activeTab === 'components' && <ComponentsPanel />}
      </div>
    </div>
  );
}

/**
 * Tokens Panel - Display all design tokens
 */
function TokensPanel() {
  const colorTokens = [
    { name: 'text-primary', var: '--text-primary' },
    { name: 'text-secondary', var: '--text-secondary' },
    { name: 'text-tertiary', var: '--text-tertiary' },
    { name: 'text-disabled', var: '--text-disabled' },
    { name: 'bg-primary', var: '--bg-primary' },
    { name: 'bg-secondary', var: '--bg-secondary' },
    { name: 'bg-tertiary', var: '--bg-tertiary' },
    { name: 'border-primary', var: '--border-primary' },
    { name: 'border-secondary', var: '--border-secondary' },
    { name: 'interactive-primary', var: '--interactive-primary' },
    { name: 'interactive-secondary', var: '--interactive-secondary' },
    { name: 'interactive-hover', var: '--interactive-hover' },
  ];

  return (
    <div className="space-y-8">
      {/* Color Tokens */}
      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
          Color Tokens
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colorTokens.map(token => (
            <div
              key={token.name}
              className="border border-[var(--border-primary)] rounded-lg p-4"
            >
              <div
                className="h-24 rounded mb-3"
                style={{ backgroundColor: `var(${token.var})` }}
              />
              <p className="font-mono text-sm text-[var(--text-primary)]">
                {token.name}
              </p>
              <p className="font-mono text-xs text-[var(--text-tertiary)]">
                var({token.var})
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Spacing Scale */}
      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
          Spacing Scale
        </h2>
        <div className="space-y-2">
          {[0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32].map(size => (
            <div key={size} className="flex items-center gap-4">
              <div className="w-16 text-sm text-[var(--text-tertiary)]">
                {size}px
              </div>
              <div
                className="h-8 bg-[var(--interactive-primary)]"
                style={{ width: `${size * 4}px` }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Components Panel - Test UI components
 */
function ComponentsPanel() {
  return (
    <div className="space-y-8">
      {/* Buttons */}
      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
          Buttons (48x48px Touch Targets)
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            className="px-6 rounded-lg bg-[var(--interactive-primary)] text-white font-medium hover:bg-[var(--interactive-hover)] transition-colors"
            style={{ minHeight: '48px', minWidth: '48px' }}
          >
            Primary
          </button>
          <button
            className="px-6 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-medium hover:bg-[var(--border-primary)] transition-colors"
            style={{ minHeight: '48px', minWidth: '48px' }}
          >
            Secondary
          </button>
          <button
            className="px-6 rounded-lg border border-[var(--border-primary)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-secondary)] transition-colors"
            style={{ minHeight: '48px', minWidth: '48px' }}
          >
            Outline
          </button>
          <button
            className="px-6 rounded-lg text-[var(--text-disabled)] cursor-not-allowed"
            style={{ minHeight: '48px', minWidth: '48px' }}
            disabled
          >
            Disabled
          </button>
        </div>
      </section>

      {/* Cards */}
      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
          Cards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-[var(--border-primary)] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Card Title
            </h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Card description with secondary text color for readability.
            </p>
            <button
              className="px-4 rounded bg-[var(--interactive-primary)] text-white hover:bg-[var(--interactive-hover)] transition-colors"
              style={{ minHeight: '48px' }}
            >
              Action
            </button>
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Secondary Card
            </h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Background uses bg-secondary token.
            </p>
            <button
              className="px-4 rounded bg-[var(--interactive-primary)] text-white hover:bg-[var(--interactive-hover)] transition-colors"
              style={{ minHeight: '48px' }}
            >
              Action
            </button>
          </div>
        </div>
      </section>

      {/* Form Elements */}
      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
          Form Elements
        </h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Input Field
            </label>
            <input
              type="text"
              placeholder="Enter text..."
              className="w-full px-4 border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--interactive-primary)]"
              style={{ minHeight: '48px' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Select
            </label>
            <select
              className="w-full px-4 border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--interactive-primary)]"
              style={{ minHeight: '48px' }}
            >
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
          Typography Scale
        </h2>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">
            Heading 1
          </h1>
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            Heading 2
          </h2>
          <h3 className="text-2xl font-semibold text-[var(--text-primary)]">
            Heading 3
          </h3>
          <p className="text-base text-[var(--text-primary)]">
            Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            Secondary text - Smaller font size with secondary color.
          </p>
          <p className="text-xs text-[var(--text-tertiary)]">
            Tertiary text - Small caption or helper text.
          </p>
        </div>
      </section>
    </div>
  );
}
