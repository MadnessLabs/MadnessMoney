import * as firebase from 'firebase';

declare global {
    namespace MadnessMoney {

        namespace api {

            interface IResponse {
                /**
                 * Was the request completed without errors
                 */
                success: boolean,
                /**
                 * Response data from the request made
                 */
                data: any
            }
        }

        namespace user {

            export interface IQueryDocumentSnapshot extends firebase.firestore.QueryDocumentSnapshot {
                data(options?: firebase.firestore.SnapshotOptions): IDocument;
            }

            export interface IColllection extends firebase.firestore.QuerySnapshot {
                readonly docs: IQueryDocumentSnapshot[];
            }

            export interface IDocument {
                /**
                 * The email address for the user
                 */
                email: string,
                /**
                 * The user's full name
                 */
                name?: string
            }

            export interface IDocumentSnapshot extends firebase.firestore.DocumentSnapshot {
                data(options?: firebase.firestore.SnapshotOptions): IDocument;
            }
            export interface IDocumentReference extends firebase.firestore.DocumentReference {
                get(): Promise<IDocumentSnapshot>
            }
        }
    }
}