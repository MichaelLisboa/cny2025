import { Color } from 'three/src/Three.Core.js';
import { AppModal } from './AppModal.js';

export const requestDeviceOrientation = (onPermissionGranted) => {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const requestPermission = () => {
    console.log('Requesting permission...'); // Debugging log
    console.log('DeviceOrientationEvent:', DeviceOrientationEvent);
    console.log('DeviceOrientationEvent.requestPermission:', DeviceOrientationEvent?.requestPermission);

    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
              console.log('Permission response:', response);
              if (response === 'granted') {
                  onPermissionGranted();
                  console.log('Granted:', onPermissionGranted());
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
    onPermissionGranted(); // Non-iOS behavior
  }
};