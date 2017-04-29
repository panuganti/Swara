import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// Import Ionic Native
import { Camera } from '@ionic-native/camera';
import { SocialSharing} from '@ionic-native/social-sharing';
import { CodePush } from '@ionic-native/code-push';
import { LocalNotifications} from '@ionic-native/local-notifications'
import { BackgroundMode } from '@ionic-native/background-mode';

// Import Mocks
import { LocalNotificationsMock } from '../mocks/localnotifications.mock';
import { CameraMock } from '../mocks/camera.mock';
import { SocialSharingMock } from '../mocks/socialsharing.mock';
import { Utils } from '../library/utils';

export class AppProviders {
    public static getProviders() {
        let providers;
        if(document.URL.includes('https://') || document.URL.includes('http://')){
          // Use browser providers
          providers =   [
            StatusBar,
            SplashScreen,
            BackgroundMode,
            Utils,
            { provide: LocalNotifications, useClass: LocalNotificationsMock},
            { provide: Camera, useClass: CameraMock},
            { provide: SocialSharing, useClass: SocialSharingMock},
            {provide: ErrorHandler, useClass: IonicErrorHandler}
            ];  
            } else {
                // Use device providers
          providers = [
            StatusBar,
            SplashScreen,
            BackgroundMode,
            Camera,
            LocalNotifications,
            SocialSharing,
            Utils,
            {provide: ErrorHandler, useClass: IonicErrorHandler}
            ];  
        } 
        return providers;
    } 
}