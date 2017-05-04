export interface TimeVolType  extends TimeVol {
    type: string;
}

export interface TimeVol extends Time {
    volume: number;
}

export interface Diaper extends Time {
    type: string
}

export interface Time {
    time: string;
    date: string;
}

export interface Baby {
    name: string;
    dob: string;
    gender: string;
    momsname: string;
    imgUrl: string;
}

export enum MessageType {
  TEXT = <any>'text'
}

export interface Message {
  _id?: string;
  content?: string;
  createdAt?: Date;
  type?: MessageType
  createdBy?: string;
  isRead?: boolean
}

export interface ChatRoom {
  _ids?: string[];
  _roomid?: string;
  title?: string;
  picture?: string;
  lastMessage?: Message;
  inNetwork: boolean;
}

export interface User {
    displayName?: string;
    phone: string;
    email: string;
    picture?: string;
}

export class MyContact {
    displayName: string;
    phoneNumbers: MyContactField[];
    emails: MyContactField[];
};

export class MyContactField {
    pref?: boolean;
    value?: string;
    type?: string;
}
