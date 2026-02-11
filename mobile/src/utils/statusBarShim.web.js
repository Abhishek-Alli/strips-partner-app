/**
 * Web shim for expo-status-bar
 * StatusBar is not needed on web - browsers handle the status bar automatically
 * This shim accepts all StatusBar props for API compatibility but renders nothing
 */
import React from 'react';

/**
 * StatusBar component shim for web platform
 * @param {Object} props - StatusBar props (style, translucent, hidden, etc.)
 * @returns {null} - Returns null as StatusBar is not needed on web
 */
export const StatusBar = (props) => {
  // Accept all props for API compatibility, but don't render anything on web
  // Props like: style, translucent, hidden, backgroundColor, barStyle, etc.
  return null;
};

// Export default for default import compatibility
export default StatusBar;

