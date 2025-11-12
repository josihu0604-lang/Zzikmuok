'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Mission {
  type: string;
  location: string;
  reward: string;
  distance: string;
  color: string;
}

const missions: Mission[] = [
  { 
    type: "카페", 
    location: "강남역", 
    reward: "15,000원", 
    distance: "0.5km", 
    color: "from-primary/20 to-primary/10"
  },
  { 
    type: "브런치", 
    location: "성수동", 
    reward: "20,000원", 
    distance: "1.2km", 
    color: "from-secondary/20 to-secondary/10"
  },
  { 
    type: "베이커리", 
    location: "연남동", 
    reward: "18,000원", 
    distance: "2.1km", 
    color: "from-pink-500/20 to-pink-500/10"
  }
];

export function DeviceFrame() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use setTimeout to defer state update and avoid cascading renders
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={cn(
        "relative mx-auto transition-all duration-1000",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ width: '340px', height: '680px' }}
    >
      {/* Phone Frame */}
      <div className="absolute inset-0 rounded-[3.5rem] bg-gradient-to-br from-foreground/90 to-foreground shadow-2xl ring-1 ring-foreground/20 animate-float">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-background rounded-b-3xl z-20"></div>
        
        {/* Screen Content */}
        <div className="absolute inset-3 rounded-[3rem] bg-gradient-to-br from-muted to-background overflow-hidden">
          {/* Status Bar */}
          <div className="relative h-12 glass flex items-center justify-between px-8 pt-3 z-10">
            <span className="text-xs font-semibold text-foreground">9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-3 bg-foreground/80 rounded-sm"></div>
              <div className="w-4 h-3 bg-foreground/80 rounded-sm"></div>
              <div className="w-4 h-3 bg-foreground/80 rounded-sm"></div>
            </div>
          </div>
          
          {/* App Content */}
          <div className="h-full bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6 pt-8">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-1">
                오늘의 미션
              </h3>
              <p className="text-sm text-muted-foreground">
                내 주변 3개 미션
              </p>
            </div>
            
            {/* Mission Cards */}
            <div className="space-y-4">
              {missions.map((mission, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "relative overflow-hidden rounded-2xl glass p-5 shadow-lg animate-fade-up",
                    `delay-${(index + 1) * 100}`
                  )}
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br", mission.color)}></div>
                  <div className="relative">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full glass text-xs font-bold text-primary mb-2">
                          {mission.type}
                        </span>
                        <p className="text-base font-bold text-foreground">
                          {mission.location}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        {mission.reward}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>📍 {mission.distance}</span>
                      <span>•</span>
                      <span>⏱️ 15분</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Bottom Navigation Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-20 glass border-t border-border/50">
            <div className="flex justify-around items-center h-full px-6">
              {[
                { icon: "🏠", label: "홈", active: true },
                { icon: "🎯", label: "미션", active: false },
                { icon: "💰", label: "수익", active: false },
                { icon: "👤", label: "프로필", active: false }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "text-xl transition-all",
                    item.active ? "scale-110" : "opacity-60"
                  )}>
                    {item.icon}
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium",
                    item.active ? "text-primary" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-foreground/30 rounded-full"></div>
        </div>
      </div>

      {/* Floating Cards */}
      <FloatingCard 
        icon="☕" 
        title="스타벅스 강남점" 
        amount="+15,000원"
        position="top-left"
        delay="0s"
      />
      
      <FloatingCard 
        icon="🍰" 
        title="디저트 카페" 
        amount="+18,000원"
        position="top-right"
        delay="1s"
      />
      
      <FloatingCard 
        icon="🥗" 
        title="샐러드 전문점" 
        amount="+20,000원"
        position="bottom-left"
        delay="2s"
      />
    </div>
  );
}

interface FloatingCardProps {
  icon: string;
  title: string;
  amount: string;
  position: 'top-left' | 'top-right' | 'bottom-left';
  delay: string;
}

function FloatingCard({ icon, title, amount, position, delay }: FloatingCardProps) {
  const positionClasses = {
    'top-left': '-top-6 -left-24',
    'top-right': 'top-40 -right-20',
    'bottom-left': 'bottom-24 -left-20'
  };

  const gradients = {
    '☕': 'from-primary to-primary/80',
    '🍰': 'from-pink-500 to-pink-600',
    '🥗': 'from-secondary to-secondary/80'
  };

  return (
    <div 
      className={cn(
        "absolute animate-float",
        positionClasses[position]
      )}
      style={{ animationDelay: delay }}
    >
      <div className="w-48 rounded-2xl glass shadow-xl p-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl text-2xl shadow-lg bg-gradient-to-br",
            gradients[icon as keyof typeof gradients]
          )}>
            {icon}
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              {title}
            </p>
            <p className="text-lg font-bold text-foreground">
              {amount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
