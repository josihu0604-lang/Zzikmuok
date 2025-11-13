import { render, screen, waitFor } from '@testing-library/react';
import { InfiniteScroll } from '@/components/InfiniteScroll';

// Mock IntersectionObserver
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];
  
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {}

  observe = jest.fn((target: Element) => {
    // Simulate intersection after a short delay
    setTimeout(() => {
      this.callback(
        [
          {
            isIntersecting: true,
            target,
            intersectionRatio: 1,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            time: Date.now(),
          },
        ],
        this as unknown as IntersectionObserver
      );
    }, 100);
  });

  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
}

// Store the original IntersectionObserver
const originalIntersectionObserver = global.IntersectionObserver;

describe('InfiniteScroll Component', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = MockIntersectionObserver as any;
  });

  afterEach(() => {
    // Restore original IntersectionObserver
    global.IntersectionObserver = originalIntersectionObserver;
    jest.clearAllMocks();
  });

  it('renders loading skeleton by default', () => {
    render(<InfiniteScroll onLoadMore={jest.fn()} hasMore={true} />);

    // Check for loading skeleton elements
    expect(screen.getByTestId('infinite-scroll-loader')).toBeInTheDocument();
  });

  it('calls onLoadMore when element is intersecting', async () => {
    const mockLoadMore = jest.fn().mockResolvedValue(undefined);

    render(
      <InfiniteScroll
        onLoadMore={mockLoadMore}
        hasMore={true}
        threshold={500}
      />
    );

    await waitFor(
      () => {
        expect(mockLoadMore).toHaveBeenCalledTimes(1);
      },
      { timeout: 3000 }
    );
  });

  it('does not call onLoadMore when hasMore is false', async () => {
    const mockLoadMore = jest.fn();

    render(
      <InfiniteScroll
        onLoadMore={mockLoadMore}
        hasMore={false}
        threshold={500}
      />
    );

    // Wait a bit to ensure onLoadMore is not called
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(mockLoadMore).not.toHaveBeenCalled();
  });

  it('renders end message when hasMore is false', () => {
    render(
      <InfiniteScroll
        onLoadMore={jest.fn()}
        hasMore={false}
        endMessage="모든 미션을 불러왔습니다"
      />
    );

    expect(screen.getByText('모든 미션을 불러왔습니다')).toBeInTheDocument();
  });

  it('shows loading state while loading', async () => {
    const mockLoadMore = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

    render(
      <InfiniteScroll
        onLoadMore={mockLoadMore}
        hasMore={true}
        threshold={500}
      />
    );

    await waitFor(() => {
      expect(mockLoadMore).toHaveBeenCalled();
    });

    // Should show loading skeleton
    expect(screen.getByTestId('infinite-scroll-loader')).toBeInTheDocument();
  });

  it('handles loading errors gracefully', async () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockLoadMore = jest
      .fn()
      .mockRejectedValue(new Error('Load failed'));

    render(
      <InfiniteScroll
        onLoadMore={mockLoadMore}
        hasMore={true}
        threshold={500}
      />
    );

    await waitFor(
      () => {
        expect(mockLoadMore).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );

    // Error should be logged
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
    });

    consoleError.mockRestore();
  });

  it('uses custom threshold value', () => {
    const mockObserve = jest.fn();
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: mockObserve,
      unobserve: jest.fn(),
      disconnect: jest.fn(),
      takeRecords: jest.fn(() => []),
    }));

    render(
      <InfiniteScroll
        onLoadMore={jest.fn()}
        hasMore={true}
        threshold={1000}
      />
    );

    // Check if IntersectionObserver was created with correct threshold
    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: '1000px',
      })
    );
  });

  it('debounces multiple load more calls', async () => {
    const mockLoadMore = jest.fn().mockResolvedValue(undefined);

    render(
      <InfiniteScroll
        onLoadMore={mockLoadMore}
        hasMore={true}
        threshold={500}
      />
    );

    // Wait for first call
    await waitFor(() => {
      expect(mockLoadMore).toHaveBeenCalledTimes(1);
    });

    // Should not call again immediately
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockLoadMore).toHaveBeenCalledTimes(1);
  });

  it('cleans up observer on unmount', () => {
    const mockUnobserve = jest.fn();
    const mockDisconnect = jest.fn();

    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
      takeRecords: jest.fn(() => []),
    }));

    const { unmount } = render(
      <InfiniteScroll onLoadMore={jest.fn()} hasMore={true} />
    );

    unmount();

    expect(mockUnobserve).toHaveBeenCalled();
  });
});
