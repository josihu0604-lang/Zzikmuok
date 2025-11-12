// ZZIK LIVE - Map-Based Location Photo Sharing App
'use client';

import { useState, useRef } from 'react';
import { Camera, Home, MapPin, User, Heart, Eye, Navigation } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface Location {
  id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  distance: string;
  photos: Photo[];
}

interface Photo {
  id: string;
  views: string;
  likes: number;
  imageUrl: string;
}

export default function MapApp() {
  // Mock location data
  const locations: Location[] = [
    {
      id: 1,
      name: 'Brooklyn Bridge Park',
      category: 'Park',
      lat: 40.7,
      lng: -74.0,
      distance: '0.5km',
      photos: [
        { id: '1', views: '1.5K', likes: 234, imageUrl: '/photo1.jpg' },
        { id: '2', views: '1.5K', likes: 189, imageUrl: '/photo2.jpg' },
        { id: '3', views: '1.5K', likes: 421, imageUrl: '/photo3.jpg' },
      ]
    },
    {
      id: 2,
      name: 'Central Park',
      category: 'Park',
      lat: 40.75,
      lng: -73.97,
      distance: '1.2km',
      photos: [
        { id: '4', views: '2.3K', likes: 567, imageUrl: '/photo4.jpg' },
      ]
    },
    {
      id: 3,
      name: 'Times Square',
      category: 'Landmark',
      lat: 40.68,
      lng: -74.02,
      distance: '0.8km',
      photos: [
        { id: '5', views: '3.1K', likes: 892, imageUrl: '/photo5.jpg' },
      ]
    },
  ];

  const [activeTab, setActiveTab] = useState('map');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(locations[0]); // Default to first location
  const [drawerHeight, setDrawerHeight] = useState(45); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const nearbyCount = locations.length * 4; // Mock total nearby missions

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    const deltaPercentage = (info.offset.y / window.innerHeight) * 100;
    const newHeight = Math.max(20, Math.min(80, 45 - deltaPercentage));
    setDrawerHeight(newHeight);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const velocity = info.velocity.y;
    
    // Snap to positions based on velocity
    if (velocity > 500) {
      // Fast swipe down - minimize
      setDrawerHeight(20);
    } else if (velocity < -500) {
      // Fast swipe up - maximize
      setDrawerHeight(80);
    } else {
      // Snap to nearest position
      if (drawerHeight < 35) {
        setDrawerHeight(20);
      } else if (drawerHeight > 60) {
        setDrawerHeight(80);
      } else {
        setDrawerHeight(45);
      }
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-purple-800 to-purple-900">
      {/* Status Bar */}
      <div className="absolute top-0 inset-x-0 z-50 px-6 pt-3 flex items-center justify-between text-white text-sm">
        <span className="font-medium">10:09</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-0.5 h-3 bg-white rounded-full" />
            ))}
          </div>
          <svg className="w-4 h-4 ml-1" fill="white" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        </div>
      </div>

      {/* Map Header */}
      <div className="absolute top-12 inset-x-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center"
          >
            <Navigation className="w-5 h-5 text-white" />
          </motion.button>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-lg text-white text-sm font-medium"
          >
            Map View
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center"
          >
            <User className="w-5 h-5 text-purple-600" />
          </motion.button>
        </div>
      </div>

      {/* Map Container */}
      <div className="absolute inset-0">
        {/* Map Background with building outlines */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
            {/* Building blocks pattern - Fixed positions for SSR */}
            <rect x="50" y="100" width="80" height="120" fill="none" stroke="white" strokeWidth="1" opacity="0.3" transform="rotate(15 90 160)" />
            <rect x="200" y="80" width="100" height="140" fill="none" stroke="white" strokeWidth="1" opacity="0.3" transform="rotate(345 250 150)" />
            <rect x="320" y="150" width="60" height="100" fill="none" stroke="white" strokeWidth="1" opacity="0.3" transform="rotate(30 350 200)" />
            <rect x="100" y="250" width="90" height="110" fill="none" stroke="white" strokeWidth="1" opacity="0.3" transform="rotate(350 145 305)" />
            <rect x="280" y="300" width="70" height="130" fill="none" stroke="white" strokeWidth="1" opacity="0.3" transform="rotate(25 315 365)" />
            <rect x="150" y="400" width="85" height="95" fill="none" stroke="white" strokeWidth="1" opacity="0.3" transform="rotate(340 192 447)" />
            <rect x="40" y="500" width="75" height="125" fill="none" stroke="white" strokeWidth="1" opacity="0.3" transform="rotate(20 77 562)" />
            <rect x="250" y="480" width="95" height="105" fill="none" stroke="white" strokeWidth="1" opacity="0.3" transform="rotate(355 297 532)" />
            <rect x="330" y="550" width="65" height="115" fill="none" stroke="white" strokeWidth="1" opacity="0.3" transform="rotate(10 362 607)" />
            <rect x="120" y="620" width="88" height="98" fill="none" stroke="white" strokeWidth="1" opacity="0.3" transform="rotate(335 164 669)" />
          </svg>
        </div>

        {/* Location Pins */}
        {locations.map((location, index) => (
          <motion.div
            key={location.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.2, type: 'spring' }}
            className="absolute"
            style={{
              left: `${30 + index * 25}%`,
              top: `${20 + index * 15}%`,
            }}
            onClick={() => {
              setSelectedLocation(location);
              setDrawerHeight(65); // Expand drawer when pin is clicked
            }}
          >
            {/* Pin with photo */}
            <div className="relative">
              {/* Pin Circle */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                {/* Outer glow */}
                <div className="absolute inset-0 w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-xl" />
                
                {/* Pin shape */}
                <div className="relative w-16 h-20 -translate-x-1/2 -translate-y-full">
                  {/* Pin body */}
                  <motion.div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-4 border-white shadow-2xl overflow-hidden cursor-pointer"
                    animate={{
                      scale: selectedLocation?.id === location.id ? 1.15 : 1,
                      borderColor: selectedLocation?.id === location.id ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.95)',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-blue-300 to-purple-400 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-lg bg-white/40 backdrop-blur-sm" />
                    </div>
                  </motion.div>
                  {/* Pin pointer */}
                  <motion.div 
                    className="absolute top-12 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-purple-500"
                    animate={{
                      scale: selectedLocation?.id === location.id ? 1.15 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                </div>
              </motion.div>

              {/* White pulse circle */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-0 left-0 w-16 h-16 -translate-x-1/2 -translate-y-full rounded-full border-2 border-white"
              />
            </div>
          </motion.div>
        ))}

        {/* Nearby Counter */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-[48%] left-6 z-40"
        >
          <div className="bg-blue-900/80 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/20">
            <div className="text-3xl font-bold text-white">{nearbyCount}</div>
            <div className="text-sm text-white/80">nearby</div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Drawer */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{ height: `${drawerHeight}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute bottom-0 inset-x-0 z-40 bg-gradient-to-b from-blue-900/95 to-purple-900/95 backdrop-blur-2xl rounded-t-3xl border-t border-white/10"
      >
        {/* Drag Handle */}
        <motion.div 
          className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/30 rounded-full cursor-grab active:cursor-grabbing"
          animate={{ 
            scaleX: isDragging ? 1.5 : 1,
            opacity: isDragging ? 0.6 : 0.3
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Drawer Content */}
        <div className="h-full overflow-y-auto pt-8 pb-24 px-6">
          {/* Selected Location Header */}
          {selectedLocation ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedLocation.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-white/60">{selectedLocation.category}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-sm text-white/60">{selectedLocation.distance}</span>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsLiked(!isLiked)}
                  whileTap={{ scale: 0.85 }}
                  className="relative"
                >
                  <motion.div
                    animate={{
                      scale: isLiked ? [1, 1.3, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart 
                      className={`w-6 h-6 transition-colors ${
                        isLiked ? 'text-red-500 fill-red-500' : 'text-white/60'
                      }`}
                    />
                  </motion.div>
                </motion.button>
              </div>

              {/* Photo Cards Grid */}
              <div className="space-y-4">
                {/* Featured Large Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 shadow-2xl"
                >
                  {/* Gradient placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400" />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-4 text-white">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">{selectedLocation.photos[0]?.views} Views</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 fill-white" />
                        <span className="text-sm font-medium">{selectedLocation.photos[0]?.likes}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location pin icon */}
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Small Cards Row */}
                <div className="grid grid-cols-2 gap-3">
                  {selectedLocation.photos.slice(1, 3).map((photo) => (
                    <motion.div
                      key={photo.id}
                      whileHover={{ scale: 1.05 }}
                      className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500" />
                      
                      {/* Info overlay */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-black/40 backdrop-blur-lg rounded-lg px-3 py-2">
                          <div className="flex items-center justify-between text-white text-xs">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{photo.views} Views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3 fill-white" />
                              <span>{photo.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Location Name Tag */}
              <div className="mt-4 flex items-center justify-between p-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20">
                <div>
                  <div className="text-white font-semibold">{selectedLocation.name}</div>
                  <div className="text-white/60 text-sm">{selectedLocation.category}</div>
                </div>
                <div className="flex items-center gap-1 text-white/60">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{selectedLocation.photos[0]?.views} Views</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">Select a location pin to view photos</p>
            </div>
          )}
        </div>

        {/* Switch Button */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button className="px-12 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg shadow-2xl">
            Switch
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 inset-x-0 z-50 bg-white/10 backdrop-blur-2xl border-t border-white/20">
        <div className="max-w-md mx-auto px-6 py-3">
          <div className="flex items-center justify-around">
            {[
              { id: 'home', icon: Home, label: '홈' },
              { id: 'map', icon: MapPin, label: '지도' },
              { id: 'camera', icon: Camera, label: '촬영' },
              { id: 'profile', icon: User, label: '프로필' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  activeTab === tab.id ? 'text-white' : 'text-white/50'
                }`}
              >
                <tab.icon className="w-6 h-6" strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
