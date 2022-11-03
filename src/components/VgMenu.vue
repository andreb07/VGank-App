<template>
  <section id="vg-menu" class="">
    <div class="bg" @click="this.$emit('closeMenu');"></div>
      <div class="main">
        <div class="links">
            <div :class="$route.name == 'Homepage' ? 'link active' : 'link'" @click="openLink('/')">{{AppData.translations.header_videos}}</div><br />
            <div v-if="AppUser">
                <div :class="$route.name == 'Favorites' ? 'link active' : 'link'" @click="openLink('/favorites');">{{AppData.translations.header_favorites}}</div><br />
            </div>
            <div :class="$route.name == 'About' ? 'link active' : 'link'" @click="openLink('/about');">{{AppData.translations.header_about}}</div><br />
            <div v-if="AppUser">
                <div v-if="AppUser.istagger" :class="$route.name == 'Untagged' ? 'link active' : 'link'" @click="openLink('/untagged');"><span class="total" v-if="AppUntagged.length > 0">{{AppUntagged.length}}</span>{{AppData.translations.header_untagged}}</div><br />
                <div v-if="AppUser.istagger" :class="$route.name == 'reported' ? 'link active' : 'link'" @click="openLink('/reported');"><span class="total" v-if="AppReported.length > 0">{{AppReported.length}}</span>{{AppData.translations.header_reported}}</div><br /> 
            </div>         
        </div>    
        <div v-if="AppUser" class="login">
            <p>Logged in</p>
            <p class="name" v-if="AppUser.display_name">{{AppUser.display_name}}</p>
            <p class="name" v-else>{{AppUser.user_email}}</p>
            
            <div class="bt" @click="this.logout()">{{AppData.translations.header_logout}}</div>
        </div>
        <div v-else class="signin">
            <div class="bt" @click="this.openLogin()">{{AppData.translations.header_signin_register}}</div>
        </div>
         
      </div>
      <div class="info" v-html="AppData.translations.header_info"></div>  
     
  </section>
</template>

<script>
import { mapGetters, mapActions} from 'vuex';
import { Storage } from '@capacitor/storage';

export default {

    computed: {
        ...mapGetters(['AppUser', 'AppUntagged', 'AppReported', 'AppData']),
    },

    methods: {

        ...mapActions(['setCurrentUser']),

        openLink: function(route){
            this.$router.push({path: route});
            this.$emit('closeMenu');
        },

        openLogin: function(){
            this.$emit('closeMenu');
            this.$emit('openModal', 'signin');
        },

        logout: async function(){
            await Storage.remove({ key: 'currentuser' });
            this.setCurrentUser(null);
            this.$router.replace('/');
            this.$emit('closeMenu');
        }

    }

}
</script>