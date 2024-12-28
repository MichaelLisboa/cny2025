import { Color } from 'three/src/Three.Core.js';
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
            text: 'No, thanks',
            onClick: () => console.log('Permission request canceled.'),
          },
          {
            text: 'Yes, enable',
            onClick: () => {
              console.log('Requesting permission from user...');
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