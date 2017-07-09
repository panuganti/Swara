import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications'
export class LocalNotificationsMock extends LocalNotifications {
    schedule(options?: ILocalNotification | Array<ILocalNotification>) {}
}
