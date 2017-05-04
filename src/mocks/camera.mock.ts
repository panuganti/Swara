import { Camera, CameraOptions } from '@ionic-native/camera';

export class CameraMock extends Camera {
    getPicture(options?: CameraOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve("BASE_64_ENCODED_DATA_GOES_HERE");
        })    
    }
}