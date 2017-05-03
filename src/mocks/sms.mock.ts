import { SMS, SmsOptions } from '@ionic-native/sms';
export class SMSMock extends SMS {
    hasPermission(): Promise<any> {
        return Promise.resolve(true);
    }

    send(phoneNumber: string | string[], message: string, options?: SmsOptions): Promise<any> {
        console.log(message);
        return Promise.resolve('OK');
    }
}
