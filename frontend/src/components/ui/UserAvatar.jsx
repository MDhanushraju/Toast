import React from 'react';

/**
 * Reusable UserAvatar Component supporting Custom Photos, Emojis, and Initial Badges
 */
export default function UserAvatar({ user, size = 'md', className = '' }) {
  const name = user?.name || user?.username || 'User';
  const initial = name.charAt(0).toUpperCase();

  const avatarType = user?.avatarType || (user?.avatarPhoto ? 'photo' : user?.avatarEmoji ? 'emoji' : 'initial');
  const photo = user?.avatarPhoto;
  const emoji = user?.avatarEmoji;

  // Size mappings
  const sizeClasses = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-24 h-24 text-4xl',
    '2xl': 'w-32 h-32 text-5xl sm:w-36 sm:h-36 sm:text-6xl',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  if (avatarType === 'photo' && photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`${currentSizeClass} rounded-full object-cover shadow-md border-2 border-white/50 shrink-0 ${className}`}
      />
    );
  }

  if (avatarType === 'emoji' && emoji) {
    return (
      <div
        className={`${currentSizeClass} rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 shadow-md flex items-center justify-center shrink-0 ${className}`}
      >
        <span className="leading-none">{emoji}</span>
      </div>
    );
  }

  // Default Initial Letter Badge
  return (
    <div
      className={`${currentSizeClass} rounded-full bg-white text-[#781327] font-black flex items-center justify-center shadow-md border-2 border-white/40 shrink-0 select-none ${className}`}
    >
      {initial}
    </div>
  );
}
