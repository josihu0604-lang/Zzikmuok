import { render, screen } from '@testing-library/react';
import SalientHero from '@/components/salient/SalientHero';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, ...props }: any) => <div {...props}>{children}</div>,
    a: ({ children, whileHover, whileTap, ...props }: any) => <a {...props}>{children}</a>,
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-right-icon">→</span>,
  CheckCircle: () => <span data-testid="check-circle-icon">✓</span>,
  Users: () => <span data-testid="users-icon">Users</span>,
  MapPin: () => <span data-testid="mappin-icon">MapPin</span>,
  TrendingUp: () => <span data-testid="trending-up-icon">TrendingUp</span>,
}));

describe('SalientHero', () => {
  it('renders the main headline', () => {
    render(<SalientHero />);
    
    expect(screen.getByText('카페 가서 사진만 찍으면')).toBeInTheDocument();
    expect(screen.getByText('15,000원 받아요')).toBeInTheDocument();
  });

  it('renders the badge with activity stats', () => {
    render(<SalientHero />);
    
    expect(screen.getByText(/이미 500명이 활동 중/)).toBeInTheDocument();
    expect(screen.getByText(/평균 월 6만원/)).toBeInTheDocument();
  });

  it('renders the sub-headline', () => {
    render(<SalientHero />);
    
    expect(screen.getByText(/팔로워 100명 이상이면 누구나 가능/)).toBeInTheDocument();
    expect(screen.getByText(/성수동, 이태원, 홍대에서 시작하세요/)).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<SalientHero />);
    
    expect(screen.getByText('지금 무료로 시작하기')).toBeInTheDocument();
    expect(screen.getByText(/어떻게 작동하나요?/)).toBeInTheDocument();
  });

  it('has correct href for main CTA button', () => {
    render(<SalientHero />);
    
    const ctaButton = screen.getByText('지금 무료로 시작하기').closest('a');
    expect(ctaButton).toHaveAttribute('href', '#download');
  });

  it('has correct href for secondary button', () => {
    render(<SalientHero />);
    
    const secondaryButton = screen.getByText(/어떻게 작동하나요?/).closest('a');
    expect(secondaryButton).toHaveAttribute('href', '#how-it-works');
  });

  it('renders trust indicators', () => {
    render(<SalientHero />);
    
    expect(screen.getByText('GPS 검증으로 안전')).toBeInTheDocument();
    expect(screen.getByText('즉시 정산')).toBeInTheDocument();
    expect(screen.getByText('수수료 0%')).toBeInTheDocument();
  });

  it('renders creator activity section', () => {
    render(<SalientHero />);
    
    expect(screen.getByText('500+ 활동 크리에이터')).toBeInTheDocument();
    expect(screen.getByText('지난 30일간 2,400개 미션 완료')).toBeInTheDocument();
  });

  it('renders creator avatars', () => {
    render(<SalientHero />);
    
    expect(screen.getByText('1K')).toBeInTheDocument();
    expect(screen.getByText('2K')).toBeInTheDocument();
    expect(screen.getByText('3K')).toBeInTheDocument();
    expect(screen.getByText('4K')).toBeInTheDocument();
    expect(screen.getByText('5K')).toBeInTheDocument();
  });

  it('renders revenue dashboard card', () => {
    render(<SalientHero />);
    
    expect(screen.getByText('이번 주 수익')).toBeInTheDocument();
    expect(screen.getByText('실시간')).toBeInTheDocument();
  });

  it('renders weekday labels in revenue section', () => {
    render(<SalientHero />);
    
    expect(screen.getByText('월')).toBeInTheDocument();
    expect(screen.getByText('화')).toBeInTheDocument();
    expect(screen.getByText('수')).toBeInTheDocument();
    expect(screen.getByText('목')).toBeInTheDocument();
    expect(screen.getByText('금')).toBeInTheDocument();
  });

  it('renders check circle icons for trust indicators', () => {
    render(<SalientHero />);
    
    const checkIcons = screen.getAllByTestId('check-circle-icon');
    expect(checkIcons.length).toBeGreaterThanOrEqual(3);
  });

  it('renders arrow icon in CTA button', () => {
    render(<SalientHero />);
    
    expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument();
  });
});
