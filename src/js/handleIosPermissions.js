import { AppModal } from './AppModal.js';

export const requestDeviceOrientation = (onPermissionGranted) => {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
    const requestPermission = () => {
      console.log('Requesting permission...');
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            console.log('Permission response:', response);
            if (response === 'granted') {
              console.log('Permission granted. Executing callback.');
              onPermissionGranted(); // Trigger the callback
            } else {
              console.warn('Device orientation permission denied.');
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
  
    if (isIOS) {
      AppModal({
        title: 'Enable Motion?',
        description: 'Would you like to enable motion functionality for better interaction?',
        actions: [
          {
            text: 'No, I\'m a loser',
            style: { fontWeight: 'normal', color: 'rgba(0, 122, 255, 1)' },
            onClick: () => console.log('Cancelled'),
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