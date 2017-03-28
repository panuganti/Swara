export interface TimeVolType  extends Time {
    volume: number;
    type: string;
}

export interface Diaper extends Time {
    type: DiaperType
}

export enum FeedingType {
    Pumped,
    Formula,
}

export enum DiaperType {
    Pee,
    Poop,
    Both
}

export interface Time {
    time: number;
    date: string;
}