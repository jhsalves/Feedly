import { firestore } from "firebase";
import { Timestamp } from "rxjs/internal/operators/timestamp";

export interface Feed{
    createdAt: number,
    owner: string,
    ownerName: string,
    text: string
}