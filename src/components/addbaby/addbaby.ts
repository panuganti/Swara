import { Input, Output, EventEmitter, Component } from '@angular/core';
import * as moment from 'moment';
import { FirebaseService } from '../../providers/firebase-service';

import { LoadingController, Loading } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImageUploaderService } from '../../providers/image-uploader-service';
import { MyBaby, Baby } from '../../library/entities';

@Component({
  selector: 'addbaby',
  templateUrl: 'addbaby.html'
})
export class AddBabyComponent {
  @Input() id: string;
  @Output() added: EventEmitter<any> = new EventEmitter<any>();

  name: string;
  dob: string;
  gender: string;
  momsname: string;
  imgUrl: string;

  storage: any;
  showImg: boolean = false;
  image: string;

  constructor(private fbs: FirebaseService, private camera: Camera, private loading: LoadingController
    , private uploader: ImageUploaderService) {
  }

  ngOnInit() {
    this.dob = moment().format();
  }

  maleColor: string = "light";
  femaleColor: string = "light";
  setGender(g: string) {
    this.gender = g;
    if (g == 'm') {
      this.maleColor = "primary";
      this.femaleColor = "light";
    }
    else if (g == 'f') {
      this.maleColor = "light";
      this.femaleColor = "primary";
    }
    this.enableAddButton();
  }

  addbuttonenabled: boolean = false;
  enableAddButton() {
    if ((this.gender == 'm' || this.gender == 'f') && (this.name) && (this.name.length > 0) && (this.momsname) && (this.momsname.length > 0)) {
      this.addbuttonenabled = true;
    }
    else {
      this.addbuttonenabled = false;
    }
  }

  async clicked() {
    var baby: Baby = {
      name: this.name,
      dob: this.dob,
      gender: this.gender,
      momsname: this.momsname,
      imgUrl: this.image
    }
    let babyref = this.fbs.push_baby(baby);
    var new_baby: MyBaby = {
      admintype: 'creator',
      babyid: babyref,
      default: false
    };
    this.fbs.push_my_baby(new_baby)
    this.added.emit();
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
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    await this.getImage(coptions);
  }

  loader: Loading;

  async getImage(coptions: CameraOptions) {
    try {
      this.presentLoading("Loading from gallery")
      let data = await this.camera.getPicture(coptions);
      this.image = "data:image/jpeg;base64," + data;
      this.image = await this.uploader.upload_image(this.image);
      this.showImg = true;
      this.loader.dismiss();
    }
    catch (err) { 
      console.log(err); 
      this.loader.dismiss(); 
    }
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

}
