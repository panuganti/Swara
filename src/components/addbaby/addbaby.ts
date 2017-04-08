import { Input, Output, EventEmitter, Component } from '@angular/core';
import { Camera} from '@ionic-native/camera';
import * as moment from 'moment';
import {LoadingController, Loading} from 'ionic-angular';
import {AngularFire} from 'angularfire2';

@Component({
  selector: 'addbaby',
  templateUrl: 'addbaby.html'
})
export class AddBabyComponent {
  @Input() id: string;
  @Output() add: EventEmitter<any> = new EventEmitter<any>();
  name: string;
  dob: string;
  gender: string;
  momsname: string;
  imgUrl: string;
  storage: any;
  showImg: boolean = false;
  image: string;
  loader: Loading;

  constructor(public camera: Camera, public loading: LoadingController,
    public af: AngularFire) {
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

  reset() {
    this.name = '';
    this.dob = moment().format();
    this.gender = '';
    this.momsname = '';
    this.addbuttonenabled = false;
    this.imgUrl = '';
    this.showImg = false;
  }

  emit() {
    this.add.emit({
      name: this.name,
      dob: this.dob,
      momsname: this.momsname,
      gender: this.gender,
      imgUrl: "dummy"
    });
    this.reset();
  }

  clicked() {
    this.emit();
 //   this.showProgressBar = true;
 //   this.upload(this.image);
  }


/*
  presentLoading(content: string) {
    this.loader = this.loading.create({
      content: content,
    });
    this.loader.present();
  }
*/


/*
  showProgressBar: boolean = false;
  progress: number = 0;
*/


/* handle cancel event
  getFromGallery() {
    let coptions: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.presentLoading("Loading from gallery")
    this.camera.getPicture(coptions).then((data) => {
      this.image = "data:image/jpeg;base64," + data;
      console.log(this.image);
      this.showImg = true;    
      this.loader.dismiss();
    })
    .catch((err) => { console.log(err); this.loader.dismiss();})
  }
*/

/*
  getFromCamera() {
    let coptions: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(coptions).then((data) => {
    this.presentLoading("Loading image...")
      this.image = "data:image/jpeg;base64," + data;
      console.log(this.image);
      this.showImg = true;    
      this.loader.dismiss();
    })
    .catch((err) => { console.log(err); })    
  }
*/

  addbuttonenabled: boolean = false;
  enableAddButton() {
    console.log(this.gender);
    console.log(this.name); console.log(this.momsname);
    if ((this.gender == 'm' || this.gender =='f') && (this.name) && (this.name.length > 0) && (this.momsname) && (this.momsname.length > 0))
    {
      this.addbuttonenabled = true;
      console.log(this.addbuttonenabled);
    }
    else {
      this.addbuttonenabled = false;
      console.log(this.addbuttonenabled);
    }
  }

/*
  upload(file: any) {
    console.log('uploading...');
    this.storage = firebase.storage().ref();
    console.log(this.storage);
    var imgname = 'images/profile' + this.id + '.jpg';
    console.log(imgname);
    var storageref = this.storage.child('images/'+ imgname);
    console.log(storageref);
    var metadata = {
      contentType: 'image/jpeg',
    };
    console.log(file);
    var uploadTask = storageref.put(file, metadata);
    uploadTask.on('state_changed', (snapshot) => {
    console.log('in state chanaged');
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + this.progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    },
      (error) => {
        console.log(error);
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // When the image has successfully uploaded, we get its download URL
        this.imgUrl = uploadTask.snapshot.downloadURL;
        // Set the download URL to the message box, so that the user can send it to the database
        ////textInput.value = downloadUrl;
        console.log(this.imgUrl);
        this.navigateToHome();
      });
  }
*/

}
