import {Diaper, TimeType } from './entities';

export interface Baby {
    name: string;
    dob: string;
    gender: string;
    momsname: string;
    imgUrl: string;
    $ref?: string;
}

export interface User {
    displayName?: string;
    phone: string;
    email: string;
    picture?: string;
    $ref?: string;
}

export interface MyBaby {
    admintype: string;
    babyid: string;
    default: boolean;
    $ref?: string;
}

export interface TimeVolType extends TimeType {
    volume: number;
    $ref?: string;
}

export interface NursingLog extends TimeVolType {
}

export interface PumpingLog extends TimeVolType {
    left_volume?: number;
    right_volume?: number;
}

export interface DiaperLog extends Diaper {
    $ref?: string;
}
