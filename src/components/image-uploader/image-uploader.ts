import { Component } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
//import { FirebaseService } from '../../providers/firebase-service';
import { ImageUploaderService } from '../../providers/image-uploader-service';

@Component({
  selector: 'image-uploader',
  templateUrl: 'image-uploader.html'
})
export class ImageUploaderComponent {
  image: string;
  showImg: boolean = false;
  loader: Loading;

  constructor(private camera: Camera, private loading: LoadingController
                                        , private uploader: ImageUploaderService) {
  }

  presentLoading(content: string) {
    this.loader = this.loading.create({
      content: content,
    });
    this.loader.present();
  }

  async getFromCamera() {
    let coptions: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    await this.getImage(coptions);
  }

  async getImage(coptions: CameraOptions) {
    try {
      debugger;
      this.presentLoading("Loading from gallery")
      let data = await this.camera.getPicture(coptions);
      console.log(data);
      //this.image = "data:image/jpeg;base64," + data;
      this.image = data;
      this.showImg = true;
      //this.uploader.upload_image(this.image);
      this.loader.dismiss();
    }
    catch (err) { console.log(err); this.loader.dismiss(); }
  }

  async getFromGallery() {
    let coptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    console.log(coptions);
    await this.getImage(coptions);
  }

}
