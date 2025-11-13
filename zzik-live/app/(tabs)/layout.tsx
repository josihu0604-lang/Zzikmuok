import BottomTabBar from '@/components/navigation/BottomTabBar';
import OfflineBanner from '@/components/states/OfflineBanner';
import './tabs.css';

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OfflineBanner />
      <div className="tabs-content-wrapper">
        {children}
      </div>
      <BottomTabBar />
    </>
  );
}
