declare var firebase;

export class StorageService {
    service: any;

    constructor() {
        this.service = firebase.storage();
    }

    async upload(path, file, metadata = {}) {
        return this.service.ref(path).put(file, metadata);
    }
}
