<template>
  <ion-page class="ion-text-center">
      <h1>Register</h1>
      <ion-button fill="clear" color="medium" @click="back()">
            <ion-icon slot="icon-only" :icon="arrowBackOutline" size="large"></ion-icon>
        </ion-button>
      <form>
        <ion-input class="ion-margin-vertical" placeholder="Name" v-model="username"></ion-input>
        <ion-input class="ion-margin-vertical" placeholder="E-Mail" v-model="email"></ion-input>
        <ion-input class="ion-margin-vertical" placeholder="Password" v-model="password" type="password"></ion-input>
        <ion-input class="ion-margin-vertical" placeholder="Repeat Password" v-model="password2" type="password"></ion-input>
        <ion-button class="ion-margin-vertical" @click="doRegister">Register</ion-button>
      </form>
      <p class="errors" v-html="errors"></p>
  </ion-page>
</template>

<script>

import { IonPage, IonInput, IonButton, IonIcon} from '@ionic/vue';
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import { Storage } from '@capacitor/storage';
import { arrowBackOutline } from 'ionicons/icons';

export default {

    name:'Register',

    components: { IonPage, IonInput, IonButton, IonIcon},

    setup() {
        return{ arrowBackOutline }
    },
    
    data() {
      return {
          'email': '',
          'password': '',
          'password2': '',
          'username': '',
          'errors': ''
      }
    },

    computed: {
        ...mapGetters(['AppData']) 
    },

    created: function(){
      console.log('##### CREATED REGISTER VIEW');
    },

    methods: {

      ...mapActions(['setCurrentUser']),

        doRegister: async function(){

          // eslint-disable-next-line
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email) == false) {
            this.errors = "Empty or Wrong email format!";
            return;
          }

          if(this.password.length < 8) {
            this.errors = "The password must be at leats 8 characters long!";
            return;
          }

          if(this.password != this.password2) {
            this.errors = "Passwords do not match. Please try again.";
            return;
          }

          let username = this.username;
          if(!this.username) {
            username = this.email;
          }

          this.errors = '';
          const response = await axios.post('http://abworks.synology.me/mediaorg/wp-json/morg/v1/register/', { 
            username:username, 
            email:this.email, 
            password:this.password 
          });

          if(response) {
            if(response.data.errors) {
              const errors = response.data.errors;               
               for(var error in errors) {
                 this.errors += errors[error][0] + '<br />';
               }
            } else {
              this.setCurrentUser(response.data);
              await Storage.set({key: 'currentuser',value: JSON.stringify({email:this.email, password:this.password})});
              this.$router.replace({path: '/home'});
            }
          }
        },

        skipToHome: async function(e){
          e.preventDefault();
          await Storage.set({key: 'skippedLogin',value: true});
          this.$router.replace({path: '/home'});
        },

        back: function(){
          this.$router.replace({path: '/login'});
        }
    }
 
}
</script>

<style scoped>
  ion-input {
    --background: rgb(41, 41, 41);
  }

  .errors {
    font-size: 14px;
    color: #912727;
  }
</style>