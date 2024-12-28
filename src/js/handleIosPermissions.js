import { AppModal } from './AppModal.js';

export const requestDeviceOrientation = (onPermissionGranted) => {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const requestPermission = () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === 'granted') {
            onPermissionGranted();
          } else {
            console.warn('Device orientation permission denied.');
          }
        })
        .catch((error) => {
          console.error('Error requesting device orientation permission:', error);
        });
    } else {
      console.warn('DeviceOrientationEvent.requestPermission() is not supported.');
      onPermissionGranted();
    }
  };

  if (isIOS) {
    AppModal({
        title: 'Enable Motion?',
        description: 'Would you like to enable motion functionality for better interaction?',
        actions: [
          {
            text: 'No, thanks',
            style: { fontWeight: 'normal' }, // Red color
            onClick: () => console.log('Cancelled'),
          },
          {
            text: 'Yes, do it',
            onClick: () => console.log('Enabled!'),
          },
        ],
      });
  } else {
    onPermissionGranted(); // Non-iOS behavior
  }
};