<template>
  <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tagged" href="/videos/tagged">
          <ion-label>TAGGED</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="untagged" href="/videos/untagged">
          <ion-label>UNTAGGED</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
</template>

<script>
import { defineComponent } from 'vue';
import { IonIcon, IonLabel,IonTabBar, IonTabButton, IonTabs, IonRouterOutlet} from '@ionic/vue';
import { calendar, personCircle } from 'ionicons/icons';

export default defineComponent({
  components: { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs, IonRouterOutlet },
  setup() {
    const beforeTabChange = () => {
      console.log('beforeTabChange');
    }
    const afterTabChange = () => {
      console.log('afterTabChange');
    }
    return {
      calendar,
      personCircle,
      beforeTabChange,
      afterTabChange
    }
  }
});
</script>