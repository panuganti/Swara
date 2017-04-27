import { MyContact } from '../providers/contacts';

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

export interface Friend {
    contact: MyContact;
    name: string;
    state: InviteState;
    accountemail: string;
}

export enum InviteState {
    InNetwork,
    InviteSent,
    NoInviteSent
}