/**
 * @module Services
 */
import { APIService } from './api';
import { DatabaseService } from './database';

export class UserService {
    collectionName: string = 'users';
    endpoint: string = 'user';
    protected db: DatabaseService;
    protected api: APIService;
    public profile: MadnessMoney.user.IDocument;

    constructor(db?: DatabaseService, api?: APIService) {
        this.db = db ? db : new DatabaseService;
        this.api = api;
        this.profile = JSON.parse(localStorage.getItem('app:profile'));
    }

    emitProfileUpdatedEvent(data) {
        document.body.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: { data } }));
    }

    async listFavorites() {
        return this.db.all('favorites');
    }

    async find(id: string) {
        return this.db.find(this.collectionName, id);
    }

    async update(id: string, data: any) {
        return this.db.update(this.collectionName, id, data);
    }

    jsonToString(v) {
        const cache = new Map();
        return JSON.stringify(v, function (_key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.get(value)) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our map
                cache.set(value, true);
            }
            return value;
        });
    }

    watchProfile(id: string, callback) {
        this.db.watchDocument(this.collectionName, id, (snapshot) => {
            localStorage.setItem('app:profile', this.jsonToString(snapshot.data));
            this.profile = snapshot.data;
            this.emitProfileUpdatedEvent(this.profile);

            if (callback && typeof callback === 'function') {
                callback(this.profile);
            }
        });
    }

    unwatchProfile(id: string) {
        return this.db.unwatchDocument(this.collectionName, id);
    }
}