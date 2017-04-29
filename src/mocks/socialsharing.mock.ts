import { SocialSharing} from '@ionic-native/social-sharing';
export class SocialSharingMock extends SocialSharing {

            canShareViaEmail(): Promise<any> {
                return Promise.resolve(true);
            }
        shareViaEmail(message: string, subject: string, to: string[], cc?: string[], bcc?: string[], files?: string | string[]): Promise<any> {
                return Promise.resolve('success');
        }

}
