import React, { memo, useMemo } from 'react';
import { type ColorValue, type StyleProp, type ViewStyle } from 'react-native';
import TurboImage from 'react-native-turbo-image';

export interface IconProps {
  size?: number;
  color?: ColorValue;
  strokeWidth?: number;
  fill?: ColorValue;
  style?: StyleProp<ViewStyle>;
}

const PATHS = {
  MessageSquare: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="8" cy="12" r="1" fill="__detail__" stroke="none"/><circle cx="12" cy="12" r="1" fill="__detail__" stroke="none"/><circle cx="16" cy="12" r="1" fill="__detail__" stroke="none"/>',
  Radio: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="m8 13 2-2 2 2 3-3 2 2"/>',
  Phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"/>',
  User: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
  Camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  EllipsisVertical: '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
  Search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
  Archive: '<path d="M3 7h18v14H3z"/><path d="M1 4h22v3H1z"/><path d="M12 10v7m-3-3 3 3 3-3"/>',
  Check: '<path d="m5 12 4 4L19 6"/>',
  CheckCheck: '<path d="m1 12 4 4L15 6"/><path d="m9 12 4 4L23 6"/>',
  ChevronLeft: '<path d="m15 18-6-6 6-6"/>',
  ChevronRight: '<path d="m9 18 6-6-6-6"/>',
  Play: '<path d="m6 3 14 9-14 9V3z"/>',
  Smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  SendHorizontal: '<path d="m3 3 3 9-3 9 19-9Z"/><path d="M6 12h16"/>',
  Plus: '<path d="M12 5v14M5 12h14"/>',
  Video: '<path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  Bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  Image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  Star: '<path d="m12 3 2.78 5.63 6.22.9-4.5 4.38 1.06 6.2L12 17.18l-5.56 2.93 1.06-6.2L3 9.53l6.22-.9z"/>',
  Lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
  Flag: '<path d="M5 22V4M5 4c5-3 9 3 14 0v10c-5 3-9-3-14 0"/>',
  CircleSlash: '<circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/>',
  Mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 21v-4M8 21h8"/>',
} as const;

type IconName = keyof typeof PATHS;

function asSvgColor(value: ColorValue | undefined, fallback: string) {
  return typeof value === 'string' ? value : fallback;
}

function Icon({
  name,
  size = 24,
  color = '#000',
  strokeWidth = 2,
  fill,
  style,
}: IconProps & { name: IconName }) {
  const stroke = asSvgColor(color, '#000');
  const paint = asSvgColor(
    fill,
    name === 'Play' || name === 'EllipsisVertical' ? stroke : 'none',
  );
  const uri = useMemo(() => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="' +
      paint +
      '" stroke="' +
      stroke +
      '" stroke-width="' +
      strokeWidth +
      '" stroke-linecap="round" stroke-linejoin="round">' +
      PATHS[name].replaceAll('__detail__', fill ? '#fff' : stroke) +
      '</svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }, [fill, name, paint, stroke, strokeWidth]);

  return (
    <TurboImage
      source={{ uri }}
      format="svg"
      resize={size}
      resizeMode="contain"
      fadeDuration={0}
      style={[{ width: size, height: size }, style]}
    />
  );
}

const makeIcon = (name: IconName) => memo((props: IconProps) => <Icon {...props} name={name} />);

export const MessageSquare = makeIcon('MessageSquare');
export const Radio = makeIcon('Radio');
export const Phone = makeIcon('Phone');
export const User = makeIcon('User');
export const Camera = makeIcon('Camera');
export const EllipsisVertical = makeIcon('EllipsisVertical');
export const Search = makeIcon('Search');
export const Archive = makeIcon('Archive');
export const Check = makeIcon('Check');
export const CheckCheck = makeIcon('CheckCheck');
export const ChevronLeft = makeIcon('ChevronLeft');
export const ChevronRight = makeIcon('ChevronRight');
export const Play = makeIcon('Play');
export const Smile = makeIcon('Smile');
export const SendHorizontal = makeIcon('SendHorizontal');
export const Plus = makeIcon('Plus');
export const Video = makeIcon('Video');
export const Bell = makeIcon('Bell');
export const ImageIcon = makeIcon('Image');
export const Star = makeIcon('Star');
export const Lock = makeIcon('Lock');
export const Flag = makeIcon('Flag');
export const CircleSlash = makeIcon('CircleSlash');
export const Mic = makeIcon('Mic');
