'use client';

import { useRef, useEffect, useState } from 'react';
import { FeedItem } from './FeedItem';

export type FeedItemData = {
  id: string;
  mediaUrl: string;
  type: 'video' | 'image';
  author?: {
    name: string;
    avatar?: string;
  };
  caption?: string;
  placeId?: string;
  placeName?: string;
};

export default function VerticalFeed({ items }: { items: FeedItemData[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const topEntry = visibleEntries[0];
        if (topEntry) {
          const id = topEntry.target.getAttribute('data-id');
          if (id) setActiveId(id);
        }
      },
      { threshold: [0.5, 0.75, 1.0] }
    );

    el.querySelectorAll('[data-id]').forEach((node) => io.observe(node));

    return () => io.disconnect();
  }, [items]);

  return (
    <div
      ref={containerRef}
      className="h-[100dvh] snap-y snap-mandatory overflow-y-scroll scrollbar-hide"
    >
      {items.map((item) => (
        <section
          key={item.id}
          data-id={item.id}
          className="h-[100dvh] snap-start relative"
        >
          <FeedItem item={item} active={activeId === item.id} />
        </section>
      ))}
    </div>
  );
}
