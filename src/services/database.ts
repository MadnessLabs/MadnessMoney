declare var firebase: any;

export class DatabaseService {
    service: any;
    watchers: any = {};

    constructor() {
        this.service = firebase.firestore();
        firebase.firestore().enablePersistence().then(() => {
            this.service = firebase.firestore();
        }).catch((error) => {
            console.log(error.message);
        });
    }

    async all(collectionName: string): Promise<any> {
        const collection = await this.get(collectionName);
        const data = {};

        await collection.forEach((doc) => {
            data[doc.id] = doc.data();
        });

        return data;
    }

    async add(collectionName: string, data: any, id?: number | string) {
        let document = await this.collection(collectionName);
        document = id ? document.doc(id) : document.doc();

        return document.set(data);
    }

    collection(collectionName: string) {
        return this.service.collection(collectionName);
    }

    get(collectionName: string) {
        return this.collection(collectionName).get();
    }

    document(collectionName: string, id: string) {
        return this.collection(collectionName).doc(id);
    }

    getDocument(collectionName: string, id: string) {
        return this.document(collectionName, id).get();
    }

    async find(collectionName: string, id: string) {
        const document = await this.getDocument(collectionName, id);

        return document.data();
    }

    async update(collectionName: string, id: string, data: any) {
        const document = this.document(collectionName, id);
        await document.set(data, { merge: true });
        const newDocument = await document.get();

        return newDocument.data();
    }

    watchDocument(collectionName: string, id: string, callback) {
        this.watchers[`${collectionName}:${id}`] = this.document(collectionName, id).onSnapshot((doc) => {
            if (callback && typeof callback === 'function') {
                callback({ data: doc.data() });
            }
        });
    }

    unwatchDocument(collectionName: string, id: string) {
        const watcherName = `${collectionName}:${id}`;
        if (this.watchers[watcherName] && typeof this.watchers[watcherName] === 'function') {
            this.watchers[watcherName]();
            return true;
        } else {
            console.log(`There is no watcher running on ${watcherName} document.`);
            return false;
        }
    }
}
