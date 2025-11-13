'use client';

import { useEffect } from 'react';

export default function TestConsoleGate() {
  useEffect(() => {
    // Test 1: Allowed warning (should pass)
    console.warn('🛡️  [Console Gate] Active - test message');
    
    // Test 2: Unexpected error (should throw after 1 second)
    setTimeout(() => {
      console.warn('About to trigger unexpected error...');
      console.error('THIS IS AN UNEXPECTED ERROR - SHOULD THROW!');
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
          Console Gate Test
        </h1>
        <div className="bg-[var(--bg-secondary)] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Test Sequence:</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
            <li>Allowed warning (should pass silently)</li>
            <li>Unexpected error after 1 second (should throw and stop execution)</li>
          </ol>
          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-sm text-yellow-800">
              <strong>Expected behavior:</strong> You should see an error in the console 
              after 1 second, and the console gate should throw an exception.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
