// Start todo comment
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
// End todo comment

export interface Log {
    type: LogType,
    time: string;
    date: string;
    volume: number;
}

export enum LogType {
    Feeding,
    Diaper,
    Pumping
}

export interface MyBaby {
    admintype: string;
    babyid: string;
    default: boolean;
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
