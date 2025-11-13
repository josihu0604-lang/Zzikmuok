import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';

// Test component that uses the theme context
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeProvider Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear document classes
    document.documentElement.classList.remove('light', 'dark');
  });

  it('initializes with light theme by default', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('initializes with theme from localStorage if available', () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles theme between light and dark', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByText('Toggle Theme');
    const themeDisplay = screen.getByTestId('current-theme');

    expect(themeDisplay).toHaveTextContent('light');

    fireEvent.click(button);

    await waitFor(() => {
      expect(themeDisplay).toHaveTextContent('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(themeDisplay).toHaveTextContent('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(localStorage.getItem('theme')).toBe('light');
    });
  });

  it('persists theme to localStorage on toggle', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByText('Toggle Theme');
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(localStorage.getItem('theme')).toBe('light');
    });
  });

  it('updates meta theme-color when theme changes', async () => {
    // Create meta element
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('content', '#8B5CF6');
    document.head.appendChild(meta);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByText('Toggle Theme');
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(meta.getAttribute('content')).toBe('#1F2937'); // Dark theme color
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(meta.getAttribute('content')).toBe('#8B5CF6'); // Light theme color
    });

    // Cleanup
    document.head.removeChild(meta);
  });

  it('detects system theme preference', () => {
    // Mock matchMedia to return dark preference
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Should initialize with system preference (dark)
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('respects manual theme selection over system preference', () => {
    // Mock matchMedia to return dark preference
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    // But localStorage has light theme
    localStorage.setItem('theme', 'light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Should use localStorage theme, not system preference
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    console.error = originalError;
  });
});
