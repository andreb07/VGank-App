<template>

    <section id="vg-header" ref="header">

        <div class="container">

            <div class="logo">            
                <img :src="logo" alt="VGank" @click="$router.replace({path: '/'});" />   
            </div>

            <div class="desktop">
                <div v-if="!AppUser">
                    <div class="left">
                        <div class="link signin" @click="this.$emit('openModal', 'signin');">
                            <svg viewBox="0 0 50 50.198">
                                <circle cx="25" cy="25" r="24" />
                                <path d="M29.933,35.528a41.33538,41.33538,0,0,1-.09-4.21c.73-.383,2.038-2.825,2.259-4.888.574-.047,1.479-.607,1.744-2.818a2.06392,2.06392,0,0,0-.771-2.065c.934-2.809,2.874-11.499-3.588-12.397-.665-1.168-2.368-1.759-4.581-1.759-8.854.163-9.922,6.686-7.981,14.156a2.06777,2.06777,0,0,0-.771,2.065c.266,2.211,1.17,2.771,1.744,2.818.22,2.062,1.58,4.505,2.312,4.888a41.34553,41.34553,0,0,1-.091,4.21c-1.261,3.39-7.737,3.655-11.473,6.924a24.44959,24.44959,0,0,0,16.916,6.746c6.68,0,14.532-5.274,15.839-6.713C37.688,39.186,31.197,38.93,29.933,35.528Z"/>
                            </svg>
                            <p>{{AppData.translations.header_sign_in}}</p>    
                        </div>
                        <div :class="this.$route.name == 'Homepage' ? 'link active' : 'link'" @click="$router.push({path: '/'});">{{AppData.translations.header_videos}}</div>
                        <div :class="this.$route.name == 'About' ? 'link active' : 'link'" @click="$router.push({path: '/about'});">{{AppData.translations.header_about}}</div>
                    </div>
                </div>
                <div v-else>
                    <div class="left">
                        <div class="profile" @click="this.logout()">{{getProfileName}}</div>
                        <div :class="this.$route.name == 'Homepage' ? 'link active' : 'link'" @click="$router.push({path: '/'});">{{AppData.translations.header_videos}}</div>
                        <div :class="this.$route.name == 'Favorites' ? 'link active' : 'link'" @click="$router.push({path: '/favorites'});">{{AppData.translations.header_favorites}}</div>
                        <div :class="this.$route.name == 'About' ? 'link active' : 'link'" @click="$router.push({path: '/about'});">{{AppData.translations.header_about}}</div>
                        <div v-if="this.AppUser.istagger" :class="this.$route.name == 'Untagged' || this.$route.name == 'Reported' ? 'link submenu active' : 'link submenu'">
                            {{AppData.translations.header_manager}}
                            <div class="manager">
                                <div @click="$router.push({path: '/untagged'});" :class="this.$route.name == 'Untagged' ? 'link active' : 'link'">
                                    <span class="total" v-if="this.AppUntagged.length > 0"><p>{{this.AppUntagged.length}}</p></span>
                                    <span class="total green" v-else><p>0</p></span>
                                    {{AppData.translations.header_untagged}}
                                </div>
                                <div @click="$router.push({path: '/reported'});" :class="this.$route.name == 'reported' ? 'link active' : 'link'">
                                    <span class="total" v-if="this.AppReported.length > 0">
                                        <p>{{this.AppReported.length}}</p>
                                    </span>
                                    <span v-else class="total green">
                                        <p>0</p>
                                    </span>
                                    {{AppData.translations.header_reported}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <p>{{AppData.translations.header_download}}</p>
                    <a href="#">
                    <svg class="apple" viewBox="0 0 56.693 56.693"><g><path d="M41.777,30.517c-0.062-6.232,5.082-9.221,5.312-9.372c-2.891-4.227-7.395-4.807-8.998-4.873   c-3.83-0.389-7.477,2.256-9.42,2.256c-1.939,0-4.941-2.199-8.117-2.143c-4.178,0.062-8.029,2.43-10.179,6.17   c-4.339,7.527-1.11,18.682,3.118,24.791c2.067,2.986,4.532,6.346,7.766,6.223c3.117-0.123,4.293-2.016,8.061-2.016   s4.826,2.016,8.123,1.953c3.352-0.061,5.477-3.043,7.527-6.041c2.373-3.469,3.35-6.828,3.408-6.998   C48.305,40.433,41.844,37.958,41.777,30.517z"/><path d="M35.582,12.229c1.715-2.082,2.877-4.975,2.561-7.855c-2.475,0.1-5.471,1.645-7.248,3.725   c-1.592,1.846-2.984,4.785-2.611,7.613C31.045,15.926,33.861,14.307,35.582,12.229z"/></g></svg>
                    </a>
                    <a href="#">
                        <svg class="gplay" enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.0" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="PLAY"><defs><path d="M23.028,11.518l-6.69-3.862c0,0-12.19-7.04-12.908-7.453C2.715-0.211,2,0.039,2,0.902    c0,1.44,0,15.029,0,15.029s0,14.685,0,15.333c0,0.649,0.512,0.93,1.133,0.569c0.624-0.359,13.205-7.625,13.205-7.625l6.69-3.862    c0,0,5.678-3.278,6.433-3.714c0.754-0.435,0.683-1.032,0.045-1.376S23.028,11.518,23.028,11.518z" id="SVGID_1_"/></defs><clipPath id="SVGID_2_"><use overflow="visible" xlink:href="#SVGID_1_"/></clipPath><polygon clip-path="url(#SVGID_2_)" fill="#2CAFA2" points="2,-0.504 2,15.932 2,32.367 18.577,15.932  "/><polygon clip-path="url(#SVGID_2_)" fill="#77E888" points="23.028,11.518 16.338,7.655 2,-0.624 2,-0.504 18.577,15.932  "/><polygon clip-path="url(#SVGID_2_)" fill="#CC3A72" points="2,32.367 2,32.487 16.338,24.209 23.028,20.347 18.577,15.932  "/><polygon clip-path="url(#SVGID_2_)" fill="#EA9053" points="23.028,11.518 18.577,15.932 23.028,20.347 30.676,15.932  "/></g><g/><g/><g/><g/><g/><g/></svg>
                    </a>
                </div>
            </div>

            <div class="mobile" ref="mobile">
                <svg v-if="currentRouteName == 'Video'" @click="$router.replace({path: '/'});" viewBox="0 0 24 24">
                    <path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z"/>
                </svg>

                <svg v-if="currentRouteName == 'Homepage'" :class="hasFilters ? 'filter hasfilters' : 'filter'" viewBox="0 0 36 30" @click="this.openFilters()">
                    <polygon fill="#231F20" points="14,30 22,25 22,17 35.999,0 17.988,0 0,0 14,17 "/>
                </svg>

                <svg class="handle" viewBox="0 0 16 14" @click="this.openMenu();">
                    <rect height="2" width="16"/>
                    <rect height="2" width="16" y="5"/>
                    <rect height="2" width="16" y="10"/>
                </svg>

                <svg class="close" viewBox="0 0 48 48" @click="$emit('closeMenu');">
                    <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/>
                </svg>
            </div>
        </div>
    </section>

</template>

<script>
import { mapActions, mapGetters} from 'vuex';
import { Storage } from '@capacitor/storage';

export default {

    data: () => ({
        logo: require('@/assets/imgs/vgank_logo.svg'),
    }),

    computed: {
        ...mapGetters(['AppData', 'AppUser', 'AppUntagged', 'AppReported', 'AppFilters']),

        currentRouteName() {
            return this.$route.name;
        },

        getProfileName() {
            let name = '';
            let names = this.AppUser.display_name.split(' ');

            if(names.length > 1) {
                name = names[0].substr(0,1) + names[1].substr(0,1);
            } else {
                name = names[0].substr(0,2);
            }

            return name;            
        },

        hasFilters: function(){

            let bool = false;

            if(this.AppFilters.champion ||
               this.AppFilters.rank ||
               this.AppFilters.position ||
               this.AppFilters.channel ||
               this.AppFilters.tag ||
               this.AppFilters.text) {
                   bool = true;
            }

            return bool;
       }
    },
    methods: {
       ...mapActions(['setCurrentUser', 'changeListType']),

        openMenu: function(){
            this.$emit('openMenu');
            this.$emit('closeFilters');
            document.body.classList.add('hidescroll');
        },

        openFilters() {
            document.body.classList.add('hidescroll');
            this.$refs.header.classList.add('filtersopen');
            this.$emit('openFilters');
        },

        login: function(){
            this.$router.replace('/login');
        },

        logout: async function(){
            await Storage.remove({ key: 'currentuser' });
            this.setCurrentUser(null);
            this.$router.replace('/');
        }

    },
}
</script>