/**
 * @module Pages
 * @preferred
 *
 * The pages for the test site
 */
import '@capacitor/core';
import '@ionic/core';
import '@stencil/core';

import * as config from '../../../enjin.local';

import { Element, Component, Prop, State, Listen } from '@stencil/core';
import { ToastController } from '@ionic/core';

import { AuthService } from '../../services/auth';
import { APIService } from '../../services/api';
import { DatabaseService } from '../../services/database';
import { UserService } from '../../services/user';

@Component({
  tag: 'madness-app',
  styleUrl: 'madness-app.scss'
})
export class MadnessApp {
  auth: AuthService;
  api: APIService;
  user: UserService;
  db: DatabaseService;
  modal: HTMLIonModalElement;
  router: HTMLIonRouterElement;

  @Element() madnessAppEl: HTMLMadnessAppElement;

  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: ToastController;

  @State() session: any;
  @State() isLoggedIn: boolean = false;
  @State() profile: MadnessMoney.user.IDocument;
  @State() defaultProps: {
    auth: AuthService,
    session: any,
    api: APIService,
    user: UserService,
    db: DatabaseService
  };

  @Listen('userProfileUpdated')
  onProfileUpdate(event) {
    this.user.update(this.session.uid, { ...event.detail.data, isNew: false }).then(() => {
      if (event.detail.onboarding) {
        this.modal.dismiss();
      }
    }).catch((error) => {
      console.log(error.message);
    });
  }

  @Listen('body:ionToastWillDismiss')
  reload() {
    window.location.reload();
  }

  componentWillLoad() {
    this.auth = new AuthService(config.firebase);
    this.api = new APIService;
    this.db = new DatabaseService;
    this.user = new UserService(this.db, this.api);
    this.session = this.auth.isLoggedIn();
    this.profile = this.user.profile;
    this.defaultProps = {
      auth: this.auth,
      session: this.session,
      api: this.api,
      user: this.user,
      db: this.db
    };
  }

  componentDidLoad() {
    window.addEventListener('swUpdate', () => {
      if (localStorage.getItem('app:lastVisit')) {
        this.toastCtrl.create({
          message: 'New version available',
          showCloseButton: true,
          closeButtonText: 'Reload'
        }).then((toast) => {
          toast.present();
        });
      } else {
        localStorage.setItem('app:lastVisit', new Date().toISOString());
      }
    });

    this.router = document.querySelector('ion-router');

    this.auth.onAuthChanged((session) => {
      if (session) {
        this.session = session;
        this.defaultProps = { ...this.defaultProps, session };
        if (['/', '/join', '/reset'].indexOf(window.location.pathname) > -1) {
          this.router.push('/dashboard');
        }

        this.api.get(`user/verify`).then(() => {
          this.watchProfile();
        }).catch((error) => {
          if (error.logout) {
            this.auth.logout();
            localStorage.clear();
            window.location.replace('/');
          }
        });
      }
    });

    this.madnessAppEl.classList.add('is-loaded');
  }

  watchProfile() {
    this.user.watchProfile(this.session.uid, (profile) => {
      if (profile) {
        this.profile = profile;
      }
    });
  }

  render() {
    return (
      <ion-app>
        <ion-split-pane when="lg">
          <ion-menu content-id="app-content">
            <ion-content>
              <ion-list>
                <ion-item href="/">
                  <ion-icon name="md-home" slot="end" />
                  Home
                </ion-item>
                <ion-item href="/accounts">
                  <ion-icon name="md-home" slot="end" />
                  Accounts
                </ion-item>
                <ion-item href="/cards">
                  <ion-icon name="md-home" slot="end" />
                  Cards
                </ion-item>
              </ion-list>
            </ion-content>
          </ion-menu>
          <div main id="app-content">
            <ion-router id="router" useHash={false}>
              <ion-route url="/" component="app-home" componentProps={this.defaultProps} />
              <ion-route url="/profile" component="app-profile" componentProps={this.defaultProps} />
              <ion-route url="/cards" component="app-cards" componentProps={this.defaultProps} />
              <ion-route url="/accounts" component="app-accounts" componentProps={this.defaultProps} />
            </ion-router>
            <ion-nav swipeBackEnabled={false} main></ion-nav>
          </div>
        </ion-split-pane>
      </ion-app>
    );
  }
}
