const getDeviceInfo = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Check if the device is mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

  // Determine the OS
  const OS = (() => {
    switch (true) {
      case /iPhone|iPad|iPod/i.test(userAgent):
        return 'iOS';
      case /Android/i.test(userAgent):
        return 'Android';
      case /Windows NT/i.test(userAgent):
        return 'Windows';
      case /Macintosh/i.test(userAgent):
        return 'macOS';
      case /Linux/i.test(userAgent):
        return 'Linux';
      default:
        return 'unknown';
    }
  })();

  // Determine the device type if it's not a desktop browser
  const deviceType = (() => {
    if (!isMobile) return 'desktop';
    switch (true) {
      case /iPhone/i.test(userAgent):
        return 'iPhone';
      case /iPad/i.test(userAgent):
        return 'iPad';
      case /iPod/i.test(userAgent):
        return 'iPod';
      case /Android/i.test(userAgent):
        return 'Android';
      default:
        return 'unknown';
    }
  })();

  // Determine the browser
  const browser = (() => {
    switch (true) {
      case /Chrome/i.test(userAgent):
        return 'Chrome';
      case /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent):
        return 'Safari';
      case /Firefox/i.test(userAgent):
        return 'Firefox';
      case /MSIE|Trident/i.test(userAgent):
        return 'Internet Explorer';
      case /Edge/i.test(userAgent):
        return 'Edge';
      default:
        return 'unknown';
    }
  })();

  return {
    isMobile,
    oS: OS,
    deviceType,
    browser,
  };
};

export default getDeviceInfo;