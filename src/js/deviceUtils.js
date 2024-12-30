const getDeviceInfo = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
    // Check if the device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
  
    // Determine the OS
    let OS = 'unknown';
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      OS = 'iOS';
    } else if (/Android/i.test(userAgent)) {
      OS = 'Android';
    }
  
    // Determine the device type
    let deviceType = 'desktop';
    if (/iPhone/i.test(userAgent)) {
      deviceType = 'iPhone';
    } else if (/iPad/i.test(userAgent)) {
      deviceType = 'iPad';
    } else if (/iPod/i.test(userAgent)) {
      deviceType = 'iPod';
    } else if (/Android/i.test(userAgent)) {
      deviceType = 'Android';
    }
  
    return {
      isMobile,
      OS,
      deviceType,
    };
  };
  
  export default getDeviceInfo;