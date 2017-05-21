// Start todo comment
export interface TimeVolType  extends TimeType {
    volume: number;
    $ref?: string;
}

export interface TimeType extends TimeNote {
    type: string;
}

export interface Diaper extends TimeType {
}

export interface TimeNote extends Time {
    note: string;
}

export interface Time {
    time: string;
    date: string;
}
// End todo comment


export interface NursingLog extends TimeVolType {
}

export interface PumpingLog extends TimeVolType {
}

export interface DiaperLog extends Diaper {  
    $ref?: string;
}

export interface MyBaby {
    admintype: string;
    babyid: string;
    default: boolean;
    $ref?: string;
}


export interface TimeVol extends TimeNote {
    volume: number;
}

export interface Baby {
    name: string;
    dob: string;
    gender: string;
    momsname: string;
    imgUrl: string;
    $ref?: string;
}

export enum MessageType {
  TEXT = <any>'text'
}

export interface Message {
  content?: string;
  createdAt?: Date;
  type?: MessageType
  createdBy?: string;
  isRead?: boolean;
  $ref?: string;
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
    $ref?: string;
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
