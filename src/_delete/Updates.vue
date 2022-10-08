<template>
  <ion-page>  
    <app-header></app-header>
    <ion-content>
        <h1>App Updates</h1>
    </ion-content>
  </ion-page>
</template>

<script>

import { IonPage, IonContent } from '@ionic/vue';
import AppHeader from '../components/VgHeader.vue';

export default {
    name: 'Updates',
    components: { IonPage, IonContent, AppHeader }
}
</script>

<style>

</style>