<template>
    <ion-menu side="end" menu-id="app-menu" content-id="main-content">
        <ion-content>
            <ion-list>
                <ion-item>
                    <ion-icon slot="end" :icon="closeOutline" @click="closeMenu()"></ion-icon>
                </ion-item>
                <ion-item><ion-label slot="end" @click="go('/home/');">Home</ion-label></ion-item>
                <ion-item><ion-label slot="end" color="warning" @click="go('/updates/');">Updates</ion-label></ion-item>
                <ion-item><ion-label slot="end">Suggestions</ion-label></ion-item>
                <ion-item><ion-label slot="end">About</ion-label></ion-item>
                <ion-item><ion-label slot="end">Logout</ion-label></ion-item>
            </ion-list>
          
          <div class="bottom ion-padding">
               <ion-text v-if="AppUser" class="name">{{AppUser.display_name}}</ion-text>
               <ion-text v-if="AppUser" class="email">{{AppUser.user_email}}</ion-text>
               <ion-button color="light">Generate Videos</ion-button>
               <ion-text class="small">Latest Update: <span>12/02/2022</span></ion-text>
          </div>    
         
        </ion-content>
    </ion-menu>

</template>

<script>
import { IonPage, IonContent, IonMenu, IonHeader, IonToolbar, IonTitle, IonList, IonButton, IonItem, IonIcon, menuController, IonText, IonLabel } from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import { mapGetters} from 'vuex';

export default {

    components: {  IonPage, IonContent, IonMenu, IonHeader, IonToolbar, IonTitle, IonList, IonButton, IonItem, IonIcon, IonText, IonLabel } ,

    computed: {
        ...mapGetters(['AppData', 'AppUser']),
    },

    setup() {
        return {            
            closeOutline
        }
    },

    methods: {
        go: function(route){
            this.$router.push({path: route});
            this.closeMenu();
        },
        closeMenu: function(){
            console.log('##### CLOSE MENU');
            menuController.close('app-menu');
        }
    }
}
</script>

<style>

    .toolbar-background {
        background: none !important;
    }

    .menu-content-open {
        cursor: default !important;
        touch-action:auto !important;
        pointer-events: all !important;
    }

    .header-md::after {
        background: none ;
    }

    ion-text.small {
        color: #6c6c6c;
        font-size: 12px;
        display: block;
        padding-bottom: 5px;
    }

     ion-text.name {
        font-size: 14px;
        display: block;
        padding-bottom: 5px;
    }

    ion-text.email {
        font-size: 11px;
        display: block;
        padding-bottom: 5px;
        padding-top: 0;
        opacity: .6;
    }

    .logoutbt {
        padding-top: 0;
    }

    .bottom {
        text-align: center;
    }

    .bottom .small {
        display: block;
        font-size: 12px;
        padding-top: 5px;
        text-align: center;
    }

    .bottom .small span {
        color: #ccc;
    }

    .bottom .email {
        margin-bottom: 10px;
    }

    ion-list {
        padding: 0 !important;
        margin-bottom: 30px !important;
    }

    ion-item {
        text-align: center;
    }

    ion-label {
        text-align: center;
        width: 100%;
        padding: 0;
        margin: 0;
    }
   
</style>