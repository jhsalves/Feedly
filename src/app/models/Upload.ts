import { Observable } from "rxjs";

export class Upload {

    $key: string;
    file:any;
    name:string;
    contentType: string;
    url: Observable<string>;
    progress: Observable<number>;
    createdAt: Date = new Date();

    get isBase64(){
        return typeof this.file === 'string' || this.file instanceof String
    }
  
    constructor(file: any, contentType?: string) {
        this.contentType = contentType;
        this.file = file;
    }
  }