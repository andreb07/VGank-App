<template>
  <ion-page class="ion-text-center" v-if="AppData.loaded">
      <h1>Login</h1>
      <form>
        <ion-input placeholder="E-Mail" v-model="email" class="ion-margin-vertical"></ion-input>
        <ion-input placeholder="Password" v-model="password" type="password" class="ion-margin-vertical"></ion-input>
        <ion-button @click="doLogin" class="ion-margin-vertical">Login</ion-button>
      </form>     
      <a href="#" @click="skipToRegister($event)" class="ion-margin-vertical">Register</a><br><br>
      <a href="#" @click="skipToHome($event)" class="ion-margin-vertical">Skip</a>
       <p class="errors" v-html="errors"></p>
  </ion-page>
</template>

<script>

import { IonPage, IonInput, IonButton } from '@ionic/vue';
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import { Storage } from '@capacitor/storage';

export default {

    name:'Login',

    components: { IonPage, IonInput, IonButton },
    
    data() {
      return {
          'email': '',
          'password': '',
          'errors': ''
      }
    },

    computed: {
        ...mapGetters(['AppData']) 
    },

    created: function(){
      console.log('###### CREATED LOGIN VIEW');
    },

    methods: {

      ...mapActions(['setCurrentUser']),

        doLogin: async function(){
          
          // eslint-disable-next-line
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email) == false) {
            this.errors = "Empty or Wrong email format!";
            return;
          }

          if(this.password.length == 0) {
            this.errors = "The password must be at leats 8 characters long!";
            return;
          }

          const response = await axios.post('http://abworks.synology.me/mediaorg/wp-json/morg/v1/login/', { email:this.email, password:this.password });
          this.errors = '';
          
          if(response) {
             if(response.data.userdata.errors) {
               const errors = response.data.userdata.errors; 
               console.log('##### LOGIN ERROR');
               console.log(errors);              
               for(var error in errors) {
                 this.errors += errors[error][0] + '<br />';
               }
            } else {
              console.log('##### USER LOGGED IN');              
              this.setCurrentUser(response.data);
              await Storage.set({key: 'currentuser',value: JSON.stringify({email:this.email, password:this.password})});
              console.log('##### USER SAVED IN STORAGE');
              this.$router.replace({path: '/home'});

            }
          }
        },

        skipToHome: async function(e){
          e.preventDefault();
          await Storage.set({key: 'skippedLogin',value: true});
          this.$router.replace({path: '/home'});
        },

        skipToRegister: async function(e){
          e.preventDefault();
          this.$router.replace({path: '/register'});
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