import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { User } from '../../library/fb-entities';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImageUploaderService } from '../../providers/image-uploader-service';

@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html'
})
export class MyProfilePage {
  name: string;
  loader: Loading;
  image: string;
  showImg: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private uploader: ImageUploaderService,
      private fbs: FirebaseService, private camera: Camera, private loading: LoadingController) {}

  ionViewDidLoad() { }

async  name_changed() {
    let phone = window.localStorage.getItem('phone');
    let users: User[] = await this.fbs.get_users_once(phone);
    let user = users[0];
    user.displayName = this.name;
    await this.fbs.update_user(phone, user);
  }

async image_changed(img: string) {
    let phone = window.localStorage.getItem('phone');
    let users: User[] = await this.fbs.get_users_once(phone);
    debugger;
    let user = users[0];
    user.picture = img;
    await this.fbs.update_user(phone, user);
}

    async getFromGallery() {
    let coptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    await this.getImage(coptions);
  }

  presentLoading(content: string) {
    this.loader = this.loading.create({
      content: content,
    });
    this.loader.present();
  }


  async getImage(coptions: CameraOptions) {
    try {
      let data = await this.camera.getPicture(coptions);
      this.image = "data:image/jpeg;base64," + data;
      console.log(this.image);
      this.presentLoading("Loading from gallery")
      this.image = await this.uploader.upload_image(this.image);
      this.image_changed(this.image);
      this.showImg = true;
      this.loader.dismiss();
    }
    catch (err) { 
      console.log(err); 
      this.loader.dismiss(); 
    }
  }

}
