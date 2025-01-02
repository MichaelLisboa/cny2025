import { AppModal } from './AppModal.js';
import getDeviceInfo from './deviceUtils';

const PERMISSION_TIMEOUT = 1200000; // 20 minutes

export const requestDeviceOrientation = (onPermissionGranted) => {
  const { OS } = getDeviceInfo();
  const isIOS = OS === 'iOS';

  const requestPermission = () => {
    console.log('Requesting permission...');
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          console.log('Permission response:', response);
          const timestamp = new Date().getTime();
          if (response === 'granted') {
            console.log('Permission granted. Executing callback.');
            localStorage.setItem('deviceOrientationPermission', JSON.stringify({ status: 'granted', timestamp }));
            onPermissionGranted(); // Trigger the callback
          } else {
            console.warn('Device orientation permission denied.');
            localStorage.setItem('deviceOrientationPermission', JSON.stringify({ status: 'denied', timestamp }));
          }
        })
        .catch((error) => {
          console.error('Error requesting device orientation permission:', error);
        });
    } else {
      console.warn('DeviceOrientationEvent.requestPermission() is not supported.');
      onPermissionGranted(); // For non-iOS or unsupported devices
    }
  };

  const storedPermission = localStorage.getItem('deviceOrientationPermission');
  if (storedPermission) {
    try {
      const { status, timestamp } = JSON.parse(storedPermission);
      const currentTime = new Date().getTime();
      if (currentTime - timestamp < PERMISSION_TIMEOUT) {
        if (status === 'granted') {
          console.log('Permission already granted. Executing callback.');
          onPermissionGranted();
          return;
        } else if (status === 'denied') {
          console.warn('Permission already denied.');
          return;
        }
      }
    } catch (error) {
      console.error('Error parsing stored permission:', error);
    }
  }

  if (isIOS) {
    AppModal({
      title: 'Enable Motion?',
      description: 'Would you like to enable motion functionality for better interaction?',
      actions: [
        {
          text: 'No, I\'m a loser',
          style: { fontWeight: 'normal', color: 'rgba(0, 122, 255, 1)' },
          onClick: () => {
            console.log('Cancelled');
            const timestamp = new Date().getTime();
            localStorage.setItem('deviceOrientationPermission', JSON.stringify({ status: 'denied', timestamp }));
          },
        },
        {
          text: 'Yes, I effin\' rule!',
          onClick: () => {
            console.log('Yes clicked. Calling requestPermission().'); // Debugging log
            requestPermission();
          },
        },
      ],
    });
  } else {
    console.log('Non-iOS device. Directly triggering permission.');
    onPermissionGranted();
  }
};