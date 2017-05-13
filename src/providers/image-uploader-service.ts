import { FirebaseService } from '../providers/firebase-service';
import * as firebase from 'firebase';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class ImageUploaderService {

    constructor(private fbs: FirebaseService) {}

    private complete_handler = () => { console.log('upload completed'); }

    public async upload_image(fileurl: string): Promise<string> {
        let storage = this.fbs.get_storage_ref();
        let now = Date.now();
        var imgname = 'profile_' + now + '.jpg';
        var storageref = storage.child('images/' + imgname);
        var metadata: firebase.storage.UploadMetadata = { contentType: 'image/jpeg' };
        var uploadTask: firebase.storage.UploadTask = storageref.putString(fileurl, 'base64', metadata);
        uploadTask.on('state_changed', this.upload_progress, this.error_handler, this.complete_handler);
        await uploadTask;
        return uploadTask.snapshot.downloadURL;
    }

    private upload_progress = (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                break;
        }
    }

    private error_handler = (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
            case 'storage/unauthorized':
                console.log("User doesn't have permission to access the object");
                break;
            case 'storage/canceled':
                console.log("User canceled the upload");
                break;
            case 'storage/unknown':
                console.log("Unknown error occurred, inspect error.serverResponse");
                break;
        }
    }

}