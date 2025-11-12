import { render, screen } from '@testing-library/react';
import HeroSection from '@/components/landing/HeroSection';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, style, whileInView, viewport, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, whileHover, whileTap, ...props }: any) => <button {...props}>{children}</button>,
    p: ({ children, initial, animate, exit, transition, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, initial, animate, transition, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin-icon">MapPin</div>,
  Sparkles: () => <div data-testid="sparkles-icon">Sparkles</div>,
  TrendingUp: () => <div data-testid="trending-up-icon">TrendingUp</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
}));

describe('HeroSection', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the main headline correctly', () => {
    render(<HeroSection activeMissionsCount={0} />);
    
    expect(screen.getByText('위치 기반 실시간')).toBeInTheDocument();
    expect(screen.getByText('릴스 리워드 플랫폼')).toBeInTheDocument();
  });

  it('displays active missions badge when count is greater than 0', () => {
    render(<HeroSection activeMissionsCount={5} />);
    
    expect(screen.getByText(/지금 5개 미션 활성화 중/)).toBeInTheDocument();
  });

  it('does not display active missions badge when count is 0', () => {
    render(<HeroSection activeMissionsCount={0} />);
    
    expect(screen.queryByText(/미션 활성화 중/)).not.toBeInTheDocument();
  });

  it('renders call-to-action buttons', () => {
    render(<HeroSection activeMissionsCount={0} />);
    
    expect(screen.getByText('지금 시작하기')).toBeInTheDocument();
    expect(screen.getByText('어떻게 작동하나요?')).toBeInTheDocument();
  });

  it('renders statistics section with correct data', () => {
    render(<HeroSection activeMissionsCount={0} />);
    
    expect(screen.getByText('2,847+')).toBeInTheDocument();
    expect(screen.getByText('활성 크리에이터')).toBeInTheDocument();
    expect(screen.getByText('1,234+')).toBeInTheDocument();
    expect(screen.getByText('제휴 매장')).toBeInTheDocument();
    expect(screen.getByText('₩12.5M+')).toBeInTheDocument();
    expect(screen.getByText('누적 리워드')).toBeInTheDocument();
  });

  it('renders interactive map placeholder', () => {
    render(<HeroSection activeMissionsCount={0} />);
    
    expect(screen.getByText('인터랙티브 맵')).toBeInTheDocument();
    expect(screen.getByText('주변 미션을 실시간으로 확인하세요')).toBeInTheDocument();
  });

  it('renders floating point cards', () => {
    render(<HeroSection activeMissionsCount={0} />);
    
    const pointCards = screen.getAllByText('+50 포인트');
    expect(pointCards).toHaveLength(3);
  });

  it('has correct link href for signup button', () => {
    render(<HeroSection activeMissionsCount={0} />);
    
    const signupLink = screen.getByText('지금 시작하기').closest('a');
    expect(signupLink).toHaveAttribute('href', '/signup');
  });

  it('has correct link href for how it works button', () => {
    render(<HeroSection activeMissionsCount={0} />);
    
    const howItWorksLink = screen.getByText('어떻게 작동하나요?').closest('a');
    expect(howItWorksLink).toHaveAttribute('href', '#how-it-works');
  });

  it('renders all required icons', () => {
    render(<HeroSection activeMissionsCount={5} />);
    
    const sparklesIcons = screen.queryAllByTestId('sparkles-icon');
    const usersIcons = screen.queryAllByTestId('users-icon');
    const mapPinIcons = screen.queryAllByTestId('map-pin-icon');
    const trendingUpIcons = screen.queryAllByTestId('trending-up-icon');
    
    expect(sparklesIcons.length).toBeGreaterThan(0);
    expect(usersIcons.length).toBeGreaterThan(0);
    expect(mapPinIcons.length).toBeGreaterThan(0);
    expect(trendingUpIcons.length).toBeGreaterThan(0);
  });
});
