<template>
  <section id="vg-signin" class="modal">
       <div class="background"  @click="closeModal"></div>
       <div class="container">
           <div class="close" @click="this.$emit('closeModal');">
                <svg viewBox="0 0 48 48">
                    <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/>
                </svg>
            </div>
            <div class="area login show" ref="login">
              <h2>{{AppData.translations.login_title}}</h2>
              <form>
                  <input type="email" :placeholder="AppData.translations.login_email" v-model="login_email" autocomplete="on" />
                  <input type="password" :placeholder="AppData.translations.login_password" v-model="login_password" autocomplete="on" />
                  <div @click="doLogin" class="bt">{{AppData.translations.login_button}}</div>
                  <p class="errors" v-html="errors"></p>
                  <img v-if="isWorking" class="loader" :src="loader" />
              </form> 

              <div class="register">
                  <h3>{{AppData.translations.login_secondtitle}}</h3>
                  <p v-for="reason in AppData.translations.login_reasons" :key="reason" >{{reason.text}}</p>  
                  <div class="bt" @click="changeToRegister">{{AppData.translations.login_register_button}}</div>
              </div>         
            </div>
                
            <div class="area register" ref="register">
              <h2>{{AppData.translations.register_title}}</h2>
              <form>
                <input type="name" :placeholder="AppData.translations.register_name" v-model="register_name" autocomplete="on" />
                <input type="email" :placeholder="AppData.translations.register_email" v-model="register_email" autocomplete="on" />
                <input type="password" :placeholder="AppData.translations.register_password" v-model="register_password" autocomplete="on" />
                <input type="password" :placeholder="AppData.translations.register_repeat_password" v-model="register_password2" autocomplete="on" />
                <div @click="doRegister" class="bt">{{AppData.translations.register_button}}</div>
                <div @click="changeToLogin" class="link">{{AppData.translations.register_back}}</div>
                <p class="errors register" v-if="errors" v-html="errors"></p>
                <img v-if="isWorking" class="loader" :src="loader" />
              </form>
            </div>
        </div>
  </section>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import { Storage } from '@capacitor/storage';

export default {

    data() {
      return {
          'login_email': '',
          'login_password': '',
          'register_name': '',
          'register_email': '',
          'register_password': '',
          'register_password2': '',
          'errors': '',
          'isWorking': false,
           loader: require('@/assets/imgs/loader.gif'),
      }
    },

    computed: {
        ...mapGetters([ 'AppApi', 'AppData']),
    },

    methods: {
         ...mapActions(['setCurrentUser']),

         doLogin: async function(){
          
          // eslint-disable-next-line
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.login_email) == false) {
            this.errors = "Empty or Wrong email format!";
            return;
          }

          if(this.login_password.length == 0) {
            this.errors = "The password must be at leats 8 characters long!";
            return;
          }

          this.errors = '';
          this.isWorking = true;
          const response = await axios.post(this.AppApi.userLogin, { email:this.login_email, password:this.login_password });
          this.isWorking = false;
          
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
              await Storage.set({key: 'currentuser',value: JSON.stringify({email:this.login_email, password:this.login_password})});
              console.log('##### USER SAVED IN STORAGE');
              this.closeModal();
            }
          }
        },

        doRegister: async function(){
          // eslint-disable-next-line
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.register_email) == false) {
            this.errors = "Empty or Wrong email format!";
            return;
          }

          if(this.register_password.length < 8) {
            this.errors = "The password must be at leats 8 characters long!";
            return;
          }

          if(this.register_password != this.register_password2) {
            this.errors = "Passwords do not match. Please try again.";
            return;
          }

          let username = this.register_name;
          if(!this.register_name) {
            username = this.register_email;
          }

          this.errors = '';
          this.isWorking = true;
          const response = await axios.post(this.AppApi.userRegister, { 
            username:username, 
            email:this.register_email, 
            password:this.register_password 
          });
          this.isWorking = false;

          if(response) {
            if(response.data.errors) {
              const errors = response.data.errors;               
               for(var error in errors) {
                 this.errors += errors[error][0] + '<br />';
               }
            } else {
              this.setCurrentUser(response.data);
              await Storage.set({key: 'currentuser',value: JSON.stringify({email:this.register_email, password:this.register_password})});
              this.closeModal();
            }
          }
        },

        changeToRegister: function(){
          this.$refs.login.classList.remove('show');
          this.$refs.register.classList.add('show');
          this.errors = '';
        },

         changeToLogin: function(){
          this.$refs.login.classList.add('show');
          this.$refs.register.classList.remove('show');
          this.errors = '';
        },

        closeModal: function(){
          this.$emit('closeModal');
          this.changeToLogin();
        }
    }

}
</script>