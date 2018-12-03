import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Like as LikeObject } from '../models/Like';
import { ILike } from '../models/ILike';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  endpoint = environment.apiUrl + "updateLikesCount";
  httpOptions = {
    headers: new HttpHeaders({
      'responseType': 'text',
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  updateLike(like: ILike) {
    console.log(like as Object);
    let body = {
      title: 'foo',
      body: 'bar',
      userId: 1
    };
    return this.http.put(this.endpoint, {
      "courseListIcon": "...",
      "description": "TEST",
      "iconUrl": "..",
      "longDescription": "...",
      "url": "new-url"
    }, this.httpOptions);
  }
}
