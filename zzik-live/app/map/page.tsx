'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, SlidersHorizontal, List, Navigation as NavigationIcon, MapPin } from 'lucide-react';
import { MapDrawer, PhotoCard } from '@/components/design-system';
import { Button } from '@/components/design-system';

/**
 * Map Screen - ZZIK LIVE
 * 
 * Based on UXUI_SPECIFICATION.md Section 7.2
 * Features:
 * - Interactive map with location pins
 * - Draggable bottom drawer with 3 snap points
 * - Location clustering
 * - Smooth transitions
 * - My location button
 * - Filter and list view options
 */

// Mock data types
interface Location {
  id: number;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  distance: string;
  photos: Photo[];
  mission?: Mission;
}

interface Photo {
  id: string;
  imageUrl: string;
  views: string;
  likes: number;
  creator: {
    name: string;
    avatarUrl: string;
  };
  createdAt: Date;
}

interface Mission {
  id: string;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Mock locations data
const mockLocations: Location[] = [
  {
    id: 1,
    name: 'Brooklyn Bridge Park',
    category: '파크',
    address: '서울 성동구 성수동',
    lat: 40.7,
    lng: -74.0,
    distance: '0.5km',
    photos: [
      {
        id: '1',
        imageUrl: '/photo1.jpg',
        views: '1.5K',
        likes: 234,
        creator: { name: '민지', avatarUrl: '/avatar1.jpg' },
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        id: '2',
        imageUrl: '/photo2.jpg',
        views: '1.2K',
        likes: 189,
        creator: { name: '수현', avatarUrl: '/avatar2.jpg' },
        createdAt: new Date(Date.now() - 7200000),
      },
      {
        id: '3',
        imageUrl: '/photo3.jpg',
        views: '2.1K',
        likes: 421,
        creator: { name: '지훈', avatarUrl: '/avatar3.jpg' },
        createdAt: new Date(Date.now() - 10800000),
      },
    ],
    mission: {
      id: 'm1',
      reward: 15000,
      difficulty: 'easy',
    },
  },
  {
    id: 2,
    name: 'Central Park',
    category: '파크',
    address: '서울 강남구 역삼동',
    lat: 40.75,
    lng: -73.97,
    distance: '1.2km',
    photos: [
      {
        id: '4',
        imageUrl: '/photo4.jpg',
        views: '2.3K',
        likes: 567,
        creator: { name: '예진', avatarUrl: '/avatar4.jpg' },
        createdAt: new Date(Date.now() - 14400000),
      },
    ],
    mission: {
      id: 'm2',
      reward: 20000,
      difficulty: 'medium',
    },
  },
  {
    id: 3,
    name: 'Times Square',
    category: '랜드마크',
    address: '서울 마포구 홍대입구',
    lat: 40.68,
    lng: -74.02,
    distance: '0.8km',
    photos: [
      {
        id: '5',
        imageUrl: '/photo5.jpg',
        views: '3.1K',
        likes: 892,
        creator: { name: '태양', avatarUrl: '/avatar5.jpg' },
        createdAt: new Date(Date.now() - 18000000),
      },
    ],
    mission: {
      id: 'm3',
      reward: 18000,
      difficulty: 'easy',
    },
  },
];

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    mockLocations[0]
  );
  const [drawerOpen, setDrawerOpen] = useState(true);

  // Handle location pin click
  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setDrawerOpen(true);
  };

  // Handle my location button
  const handleMyLocation = () => {
    console.log('Center map to user location');
  };

  // Handle mission start
  const handleStartMission = () => {
    console.log('Start mission:', selectedLocation?.mission?.id);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Floating Header */}
      <header className="absolute top-0 inset-x-0 z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Back button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </motion.button>

          {/* Center: Title */}
          <div className="absolute left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white shadow-lg">
            <span className="text-sm font-semibold text-gray-900">지도</span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
            >
              <SlidersHorizontal className="w-5 h-5 text-gray-900" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
            >
              <List className="w-5 h-5 text-gray-900" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-800 to-purple-900">
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg
            className="w-full h-full"
            viewBox="0 0 400 800"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Building pattern */}
            <rect
              x="50"
              y="100"
              width="80"
              height="120"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.3"
              transform="rotate(15 90 160)"
            />
            <rect
              x="200"
              y="80"
              width="100"
              height="140"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.3"
              transform="rotate(345 250 150)"
            />
            <rect
              x="320"
              y="150"
              width="60"
              height="100"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.3"
              transform="rotate(30 350 200)"
            />
            <rect
              x="100"
              y="250"
              width="90"
              height="110"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.3"
              transform="rotate(350 145 305)"
            />
            <rect
              x="280"
              y="300"
              width="70"
              height="130"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.3"
              transform="rotate(25 315 365)"
            />
          </svg>
        </div>

        {/* Location Pins */}
        {mockLocations.map((location, index) => (
          <motion.div
            key={location.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.15, type: 'spring', stiffness: 300 }}
            className="absolute cursor-pointer"
            style={{
              left: `${30 + index * 25}%`,
              top: `${25 + index * 18}%`,
            }}
            onClick={() => handleLocationClick(location)}
          >
            {/* Pin Container */}
            <div className="relative">
              {/* Pulse Animation */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
              />

              {/* Pin Body */}
              <motion.div
                className="relative w-14 h-14 -translate-x-1/2 -translate-y-1/2"
                animate={{
                  scale: selectedLocation?.id === location.id ? 1.15 : 1,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-4 border-white shadow-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
              </motion.div>

              {/* Hot Indicator */}
              {location.mission && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🔥</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* My Location Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleMyLocation}
          className="absolute right-6 bottom-[55%] z-40 w-14 h-14 rounded-full bg-white shadow-2xl flex items-center justify-center"
        >
          <NavigationIcon className="w-6 h-6 text-primary-600" />
        </motion.button>

        {/* Nearby Counter */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-[55%] left-6 z-40"
        >
          <div className="bg-white rounded-2xl px-4 py-3 shadow-2xl">
            <div className="text-3xl font-bold text-primary-600">
              {mockLocations.length}
            </div>
            <div className="text-sm text-gray-600">nearby</div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Drawer using MapDrawer component */}
      <MapDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        location={
          selectedLocation
            ? {
                name: selectedLocation.name,
                address: selectedLocation.address,
                category: selectedLocation.category,
                distance: selectedLocation.distance,
              }
            : undefined
        }
        photos={selectedLocation?.photos.map((p) => ({
          id: p.id,
          imageUrl: p.imageUrl,
          likes: p.likes,
        }))}
        mission={selectedLocation?.mission}
        onViewMission={handleStartMission}
      />
    </div>
  );
}
