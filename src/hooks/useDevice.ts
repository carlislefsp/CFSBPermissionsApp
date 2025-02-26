import { useEffect, useState } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isMac: boolean;
  isWindows: boolean;
}

export function useDevice(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isMac: false,
    isWindows: false,
  });

  useEffect(() => {
    // Check for mobile using userAgent
    const isMobile =
      /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(
        navigator.userAgent,
      );

    // Check for Mac vs Windows
    const isMac = navigator.platform.toLowerCase().includes('mac');
    const isWindows = navigator.platform.toLowerCase().includes('win');

    setDeviceInfo({
      isMobile,
      isMac,
      isWindows,
    });
  }, []);

  return deviceInfo;
}
