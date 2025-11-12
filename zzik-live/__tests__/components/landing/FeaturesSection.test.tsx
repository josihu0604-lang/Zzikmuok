import { render, screen } from '@testing-library/react';
import FeaturesSection from '@/components/landing/FeaturesSection';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileInView, viewport, initial, animate, variants, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    span: ({ children, initial, whileHover, transition, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="mappin-icon">MapPin</div>,
  Camera: () => <div data-testid="camera-icon">Camera</div>,
  DollarSign: () => <div data-testid="dollarsign-icon">DollarSign</div>,
  Shield: () => <div data-testid="shield-icon">Shield</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  BarChart3: () => <div data-testid="barchart3-icon">BarChart3</div>,
  Smartphone: () => <div data-testid="smartphone-icon">Smartphone</div>,
  Globe: () => <div data-testid="globe-icon">Globe</div>,
}));

describe('FeaturesSection', () => {
  it('renders the section title', () => {
    render(<FeaturesSection />);
    
    // Check for section heading
    expect(screen.getByText('강력한 기능')).toBeInTheDocument();
    expect(screen.getByText('으로 성공을 보장')).toBeInTheDocument();
  });

  it('renders GPS verification feature', () => {
    render(<FeaturesSection />);
    
    expect(screen.getByText('GPS 트리플 검증')).toBeInTheDocument();
    expect(screen.getByText(/실제 방문을 3단계 위치 검증/)).toBeInTheDocument();
  });

  it('renders instant rewards feature', () => {
    render(<FeaturesSection />);
    
    expect(screen.getByText('즉시 리워드')).toBeInTheDocument();
    expect(screen.getByText(/체크인 즉시 포인트 적립/)).toBeInTheDocument();
  });

  it('renders content creation feature', () => {
    render(<FeaturesSection />);
    
    expect(screen.getByText('간편한 콘텐츠 제작')).toBeInTheDocument();
    expect(screen.getByText(/30초 릴스 템플릿 제공/)).toBeInTheDocument();
  });

  it('renders nano creator focused feature', () => {
    render(<FeaturesSection />);
    
    expect(screen.getByText('나노 크리에이터 특화')).toBeInTheDocument();
    expect(screen.getByText(/팔로워 100명부터 시작 가능/)).toBeInTheDocument();
  });

  it('renders secure payment feature', () => {
    render(<FeaturesSection />);
    
    expect(screen.getByText('안전한 정산')).toBeInTheDocument();
    expect(screen.getByText(/PG사 연동 자동 정산/)).toBeInTheDocument();
  });

  it('renders real-time analytics feature', () => {
    render(<FeaturesSection />);
    
    expect(screen.getByText('실시간 분석')).toBeInTheDocument();
    expect(screen.getByText(/방문자 트래픽, 전환율, ROI/)).toBeInTheDocument();
  });

  it('renders all 6 feature cards', () => {
    render(<FeaturesSection />);
    
    const featureTitles = [
      'GPS 트리플 검증',
      '즉시 리워드',
      '간편한 콘텐츠 제작',
      '나노 크리에이터 특화',
      '안전한 정산',
      '실시간 분석',
    ];

    featureTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('renders feature icons', () => {
    render(<FeaturesSection />);
    
    expect(screen.getByTestId('mappin-icon')).toBeInTheDocument();
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    expect(screen.getByTestId('camera-icon')).toBeInTheDocument();
    expect(screen.getByTestId('users-icon')).toBeInTheDocument();
    expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
    expect(screen.getByTestId('barchart3-icon')).toBeInTheDocument();
  });
});
