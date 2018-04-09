import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'app-cards',
  styleUrl: 'app-cards.scss'
})
export class AppCards {

  @Prop() api: any;

  render() {
    return (
      <ion-page>
        <ion-content>
          Your new app-cards component
        </ion-content>
      </ion-page>
    );
  }
}