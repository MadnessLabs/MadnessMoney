import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'app-accounts',
  styleUrl: 'app-accounts.scss'
})
export class AppAccounts {

  @Prop() api: any;

  render() {
    return (
      <ion-page>
        <ion-content>
          Your new app-accounts component
        </ion-content>
      </ion-page>
    );
  }
}