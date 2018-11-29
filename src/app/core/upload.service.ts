import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Upload } from '../models/Upload';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private af: AngularFireStorage, private db: AngularFireDatabase) { }

  private basePath:string = '/uploads';

  pushUpload(upload: Upload) {
    let filePath = `${this.basePath}/${upload.name}`;
    let fileRef = this.af.ref(filePath);
    let uploadTask: AngularFireUploadTask;
    let metadata = {};
    if(upload.contentType){
      metadata = {
        contentType: upload.contentType
      };
    }
    if(upload.isBase64){
      uploadTask = fileRef.putString(upload.file, 'data_url', metadata);
    }else{
      uploadTask =  this.af.upload(filePath, upload.file);
    }

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        upload.url = fileRef.getDownloadURL();
      })
    ).subscribe();

    upload.progress = uploadTask.percentageChanges();

    return Promise.resolve(uploadTask);
  }

  private deleteFileStorage(name:string) {
    let filePath = `${this.basePath}/${name}`;
    return this.af.ref(filePath).delete();
  }
}
