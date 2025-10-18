import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

class PushNotificationService {
    constructor() {
        this.configure();
    }

    configure() {
        PushNotification.configure({
            // Required: called when token is generated
            onRegister: function (token) {
                console.log('TOKEN:', token);
            },

            // Required: called when remote notification is received
            onNotification: function (notification) {
                console.log('REMOTE NOTIFICATION:', notification);

                // Process the notification
                if (notification.foreground) {
                    // Notification received in foreground - already handled by FCM
                    console.log('Foreground notification handled by FCM');
                }

                // Required for iOS - call completion handler
                notification.finish(PushNotificationIOS.FetchResult.NoData);
            },

            // IOS ONLY
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            // Should the initial notification be popped automatically
            popInitialNotification: true,

            // Request permissions on start
            requestPermissions: true,
        });

        // Create notification channel for Android
        PushNotification.createChannel(
            {
                channelId: 'fcm_fallback_notification_channel',
                channelName: 'Default Channel',
                channelDescription: 'A channel to categorize your notifications',
                playSound: true,
                soundName: 'default',
                importance: 4, // IMPORTANCE_HIGH
                vibrate: true,
            },
            (created) => console.log(`createChannel returned '${created}'`)
        );
    }

    // Method to show local notification
    showLocalNotification(title, message) {
        PushNotification.localNotification({
            channelId: 'fcm_fallback_notification_channel',
            title: title,
            message: message,
            playSound: true,
            soundName: 'default',
        });
    }
}

export default new PushNotificationService();