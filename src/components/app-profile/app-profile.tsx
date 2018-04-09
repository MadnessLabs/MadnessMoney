import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'app-profile',
  styleUrl: 'app-profile.scss'
})
export class AppProfile {

  @Prop() api: any;

  render() {
    return (
      <ion-page>
        <ion-content>
          Your new app-profile component
        </ion-content>
      </ion-page>
    );
  }
}