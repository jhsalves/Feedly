import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ILike } from '../models/ILike';
import { FeedService } from './feed.service';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  endpoint = environment.apiUrl + "updateLikesCount";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': "*"
    }),
    responseType : 'text' as 'json',
  };

  constructor(private http: HttpClient,
              private feedService: FeedService) { }

  updateLike(like: ILike) {
    this.feedService.modifyingPost = true;
    const likeUpdate = this.http.post(this.endpoint, like, this.httpOptions);
    return likeUpdate;
  }
}
