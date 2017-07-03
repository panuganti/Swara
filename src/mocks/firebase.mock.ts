import { FirebaseService } from '../providers/firebase-service';
import { Observable } from 'rxjs/Rx';
import * as Enumerable from 'linq';
import { User, Baby, MyBaby, NursingLog, PumpingLog, DiaperLog } from '../library/fb-entities';

export class FirebaseMock extends FirebaseService {
    NursingLog: { [id: string]: NursingLog[] } = {};
    PumpingLog: { [id: string]: PumpingLog[] } = {};
    DiaperLog: { [id: string]: DiaperLog[] } = {};
    Babies: { [id: string]: Baby } = {};
    MyBabies: { [id: string]: MyBaby } = {};
    Users: { [id: string]: User } = {};
    isLoggedIn: boolean;

    init_load() {
        let users = JSON.parse(window.localStorage.getItem('users'));
        if (users) { this.Users = users; }
        let my_babies = JSON.parse(window.localStorage.getItem('my_babies'));
        if (my_babies) { this.MyBabies = my_babies; }
        let babies = JSON.parse(window.localStorage.getItem('babies'));
        if (babies) { this.Babies = babies; }

        let nursing_logs = JSON.parse(window.localStorage.getItem('nursing_log'));
        if (nursing_logs) { this.NursingLog = nursing_logs; }
        let pumping_logs = JSON.parse(window.localStorage.getItem('pumping_log'));
        if (pumping_logs) { this.PumpingLog = pumping_logs; }
        let diaper_logs = JSON.parse(window.localStorage.getItem('diaper_log'));
        if (diaper_logs) { this.DiaperLog = diaper_logs; }
    }

    private save_users() {
        window.localStorage.setItem('users', JSON.stringify(this.Users));
    }

    private save_babies() {
        window.localStorage.setItem('babies', JSON.stringify(this.Babies));
    }
    private save_my_babies() {
        window.localStorage.setItem('my_babies', JSON.stringify(this.MyBabies));
    }
    private save_nursing_log() {
        window.localStorage.setItem('nursing_log', JSON.stringify(this.NursingLog));
    }
    private save_pumping_log() {
        window.localStorage.setItem('pumping_log', JSON.stringify(this.PumpingLog));
    }
    private save_diaper_log() {
        window.localStorage.setItem('diaper_log', JSON.stringify(this.DiaperLog));
    }

    is_logged_in(): boolean {
        this.init_load();
        let user = JSON.parse(window.localStorage.getItem('user'));
        if (user) {
            this.isLoggedIn = true;
            return this.isLoggedIn;
        }
        this.isLoggedIn = false;
        return this.isLoggedIn;
    }

    async logout(): Promise<void> {
        this.isLoggedIn = false;
        window.localStorage.removeItem('user');
    }

    async login(email, phone, passwd): Promise<void> {
        this.create_user(email, passwd);
    }

    async create_user(email: string, password: string): Promise<void> {
        let new_user: any = { email: email, password: password };
        let user = JSON.parse(window.localStorage.getItem('user'));
        if (!user || user.email != new_user.email || user.password != new_user.password) {
            window.localStorage.setItem('user', JSON.stringify(new_user));
        }
    }

    //#region Log
    get_nursing_log(key): Observable<any> {
        return Observable.of(this.NursingLog[key]);
    }

    async get_nursing_log_once(key: string, date: string): Promise<any> {
        let log = this.NursingLog[key];
        return Promise.resolve(Enumerable.from(log)
            .where(l => l.date == date).toArray());
    }

    async delete_nursing_log(key): Promise<void> {
        if (!this.NursingLog[key]) { return; }
        delete this.NursingLog[key];
        this.save_nursing_log();
    }

    push_nursing_log(id: string, log: NursingLog) {
        if (!this.NursingLog[id]) {
            var empty_log: NursingLog[] = [];
            this.NursingLog[id] = empty_log;
        }
        this.NursingLog[id].push(log);
        this.save_nursing_log();
    }

    get_pumping_log(key): Observable<any> {
        return Observable.of(this.PumpingLog[key]);
    }

    async get_pumping_log_once(key: string, date: string): Promise<any> {
        let log = this.PumpingLog[key];
        return Promise.resolve(Enumerable.from(log)
            .where(l => l.date == date).toArray());
    }

    async delete_pumping_log(key): Promise<void> {
        if (!this.PumpingLog[key]) { return; }
        delete this.PumpingLog[key];
        this.save_pumping_log();
    }

    push_pumping_log(id: string, log: PumpingLog) {
        if (!this.PumpingLog[id]) {
            var empty_log: PumpingLog[] = [];
            this.PumpingLog[id] = empty_log;
        }
        this.PumpingLog[id].push(log);
        this.save_pumping_log();
    }

    get_diaper_log(key): Observable<any> {
        return Observable.of(this.DiaperLog[key]);
    }

    async get_diaper_log_once(key: string, date: string): Promise<any> {
        let log = this.DiaperLog[key];
        return Promise.resolve(Enumerable.from(log)
            .where(l => l.date == date).toArray());
    }

    async delete_diaper_log(key): Promise<void> {
        if (!this.DiaperLog[key]) { return; }
        delete this.DiaperLog[key];
        this.save_diaper_log();
    }

    push_diaper_log(id: string, log: DiaperLog) {
        if (!this.DiaperLog[id]) {
            var empty_log: DiaperLog[] = [];
            this.DiaperLog[id] = empty_log;
        }
        this.DiaperLog[id].push(log);
        this.save_diaper_log();
    }

    //#endregion Log

    get_baby_obs(key: string): Observable<any> {
        return Observable.of(this.Babies[key]);
    }

    async delete_baby(key: string): Promise<void> {
        delete this.Babies[key];
        this.save_babies();
    }

    async delete_baby_from_my_babies(key: string): Promise<void> {
        delete this.MyBabies[key];
        this.save_my_babies();
    }

    async update_user(phone: string, user) {
        this.Users[phone] = user;
        this.save_users();
    }

    async get_baby_once(key: string) {
        let b = [this.Babies[key]];
        return await Promise.resolve(b);
    }

    async get_my_babies_once() {
        let my_babies = Enumerable.from(this.MyBabies).select(mb => mb.value).toArray()
        return await Promise.resolve(my_babies);
    }

    get_my_babies_obs(): Observable<any> {
        let my_babies = Enumerable.from(this.MyBabies).select(mb => mb.value).toArray();
        return Observable.of(my_babies);
    }

    async get_users_once(phone: string): Promise<any> {
        if (!this.Users || !this.Users[phone]) { return null; }
        let user = this.Users[phone];
        await Promise.resolve(user);
    }

    push_my_baby(my_baby: MyBaby) {
        let id = Date.now().toString();
        this.MyBabies[id] = my_baby;
        this.save_my_babies();
    }

    push_baby(baby: Baby): string {
        let id = Date.now().toString();
        this.Babies[id] = baby;
        this.save_babies()
        return id;
    }

    async push_user(user: User): Promise<void> {
        this.Users[user.phone] = user;
    }

    async upload_image(imgname: string, fileurl: string, progress_handler: any, error_handler: any, complete_handler: any): Promise<string> {
        return await Promise.resolve(fileurl);
    }

}