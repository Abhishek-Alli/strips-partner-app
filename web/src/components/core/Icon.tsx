/**
 * Centralized Icon Component
 * 
 * Wraps Material Icons (Outlined) for consistent iconography
 */

import React from 'react';
import { SvgIconProps } from '@mui/material';
import * as MaterialIcons from '@mui/icons-material';
import { iconMap, IconName } from '../../../../shared/icons/iconMap';

interface IconProps extends Omit<SvgIconProps, 'component'> {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  sx,
  ...props
}) => {
  const iconName = iconMap[name];
  const IconComponent = (MaterialIcons as any)[iconName] as React.ComponentType<SvgIconProps>;

  if (!IconComponent) {
    console.warn(`Icon "${name}" (${iconName}) not found in Material Icons`);
    return null;
  }

  return (
    <IconComponent
      sx={{
        fontSize: sizeMap[size],
        ...sx,
      }}
      {...props}
    />
  );
};






