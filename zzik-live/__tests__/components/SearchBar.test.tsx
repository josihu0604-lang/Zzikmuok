import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '@/components/SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();
  const mockOnClose = jest.fn();
  const mockFilters = [
    { id: 'nearby', label: '근처만', value: 'nearby', active: false },
    { id: 'easy', label: '쉬운 미션', value: 'easy', active: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input correctly', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        onClose={mockOnClose}
        placeholder="미션 검색..."
      />
    );

    expect(screen.getByPlaceholderText('미션 검색...')).toBeInTheDocument();
  });

  it('calls onSearch with debounced query', async () => {
    jest.useFakeTimers();
    render(<SearchBar onSearch={mockOnSearch} onClose={mockOnClose} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '카페' } });

    // Should not call immediately
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Fast-forward 300ms
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('카페');
    });

    jest.useRealTimers();
  });

  it('displays filter chips when provided', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        onClose={mockOnClose}
        filters={mockFilters}
      />
    );

    expect(screen.getByText('근처만')).toBeInTheDocument();
    expect(screen.getByText('쉬운 미션')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<SearchBar onSearch={mockOnSearch} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows recent searches when input is focused', async () => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() =>
      JSON.stringify(['강남 카페', '명동 레스토랑'])
    );

    render(<SearchBar onSearch={mockOnSearch} onClose={mockOnClose} />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText('강남 카페')).toBeInTheDocument();
      expect(screen.getByText('명동 레스토랑')).toBeInTheDocument();
    });
  });

  it('clears input when clear button is clicked', async () => {
    render(<SearchBar onSearch={mockOnSearch} onClose={mockOnClose} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.type(input, '테스트');

    expect(input.value).toBe('테스트');

    const clearButton = screen.getByLabelText(/clear/i);
    fireEvent.click(clearButton);

    expect(input.value).toBe('');
  });

  it('handles empty search query', async () => {
    jest.useFakeTimers();
    render(<SearchBar onSearch={mockOnSearch} onClose={mockOnClose} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '   ' } });

    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('');
    });

    jest.useRealTimers();
  });

  it('applies active styles to filter chips', () => {
    const activeFilters = [
      { id: 'nearby', label: '근처만', value: 'nearby', active: true },
    ];

    render(
      <SearchBar
        onSearch={mockOnSearch}
        onClose={mockOnClose}
        filters={activeFilters}
      />
    );

    const chip = screen.getByText('근처만');
    expect(chip.closest('button')).toHaveClass('bg-primary-500');
  });
});
