import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
//import * as moment from 'moment';
import * as Enumerable from 'linq';
import { Baby } from '../../library/entities';
import * as firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';

//declare var Camera;

@Component({
  selector: 'page-profiles',
  templateUrl: 'profiles.html'
})
export class ProfilesPage {
  name: string = "";
  dob: string = "";
  gender: string = "";
  momsname: string = "";
  imgUrl: string = "";

  mybabies: FirebaseListObservable<any>;
  babies: FirebaseListObservable<any>;
  storage: any;
  showAddDialog: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public af: AngularFire, private camera: Camera) { }


  ionViewDidLoad() {
    let user = firebase.auth().currentUser;
    this.mybabies = this.af.database.list('/Babies' + '_' + user.email);
    this.babies = this.af.database.list('/Babies');
  }

  showBaby(ev: string) {
    this.navCtrl.push(HomePage, { id: ev });
  }

  newBaby() {
    this.showAddDialog = true;
    console.log(this.showAddDialog);
  }

  // TODO: Share

  addBaby() {
    var baby: Baby = {
      name: this.name,
      dob: this.dob,
      gender: this.gender,
      momsname: this.momsname,
      imgUrl: ''
    }
    let babyRef = this.babies.push(baby);
    this.mybabies.push({
      babyid: babyRef.key,
      admintype: 'creator'
    });
  }

  sanitizeEmail(email: string): string {
    return '';
  }

  upload(ev: any) {
    console.log(ev);
    var files = ev.srcElement.files;
    console.log(files);
    this.storage = firebase.storage().ref();
    var storageref = this.storage.child('images/pic.jpg');
    var file = files[0];
    var metadata = {
      contentType: 'image/jpeg',
    };
    var uploadTask = storageref.put(file, metadata);
    uploadTask.on('state_changed', (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
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
        var downloadUrl = uploadTask.snapshot.downloadURL;
        // Set the download URL to the message box, so that the user can send it to the database
        ////textInput.value = downloadUrl;
        console.log(downloadUrl);
      });

  }

  getCount(babies: Baby[]): number {
    if (babies == null || !Enumerable.from(babies).any()) {
      return 0;
    }
    return Enumerable.from(babies).count();
  }

  getStarted() {
    window.localStorage.setItem("name", this.name);
    console.log(Date.parse(this.dob));
    window.localStorage.setItem("dob", this.dob);
    this.navCtrl.push(HomePage);
  }

  getPicture() {
    let coptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(coptions).then((data) => {
      let image = "data:image/jpeg;base64," + data;
      console.log(image);
    })
    .catch((err) => { console.log(err); })

  }

}
