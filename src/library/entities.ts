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

export interface TimeVol extends TimeNote {
    volume: number;
}

// Chatrooms
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

export interface MyChatRoom {
    title?: string;
    chatroom?: ChatRoom
    inNetwork: boolean;
    contact: MyContact;
}
// End


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

export interface ActiveChatRoom extends MyLocalChatRoom {
    chatroom_id: string;
    last_message: string;
    unread_count: number;
}

export interface InNetworkChatRoom extends MyLocalChatRoom {
    chatroom_id?: string;
    userid: string;
}

export interface NotInNetworkChatRoom extends MyLocalChatRoom {
}

export interface MyLocalChatRoom {
    title: string;
    contact: MyContact;
    picture?: string;
}

// Entities in db
export interface ChatRoom {
    _roomid?: string;
    picture?: string;
    lastMessage?: Message;
}

export interface DbChatRoom extends DbEntity {
    title: string;
    picture?: string;
}

export interface DbMyChatRoom extends DbEntity{
    chatroom_id: string;
}

export interface DbEntity {
    $ref: string;
}
