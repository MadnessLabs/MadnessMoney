import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss'
})
export class AppHome {

  @Prop() api: any;

  render() {
    return (
      <ion-page>
        <ion-content>
          Your new app-home component
        </ion-content>
      </ion-page>
    );
  }
}