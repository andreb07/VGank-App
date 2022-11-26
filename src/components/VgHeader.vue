<template>

    <section id="vg-header" ref="header">

        <div class="container">

            <div class="logo">            
                <img :src="logo" alt="VGank" @click="$router.replace({path: '/'});" />   
            </div>

            <div class="desktop">
                <div v-if="!AppUser">
                    <div class="left">
                        <!--<div class="link signin" @click="this.$emit('openModal', 'signin');">
                            <svg viewBox="0 0 50 50.198">
                                <circle cx="25" cy="25" r="24" />
                                <path d="M29.933,35.528a41.33538,41.33538,0,0,1-.09-4.21c.73-.383,2.038-2.825,2.259-4.888.574-.047,1.479-.607,1.744-2.818a2.06392,2.06392,0,0,0-.771-2.065c.934-2.809,2.874-11.499-3.588-12.397-.665-1.168-2.368-1.759-4.581-1.759-8.854.163-9.922,6.686-7.981,14.156a2.06777,2.06777,0,0,0-.771,2.065c.266,2.211,1.17,2.771,1.744,2.818.22,2.062,1.58,4.505,2.312,4.888a41.34553,41.34553,0,0,1-.091,4.21c-1.261,3.39-7.737,3.655-11.473,6.924a24.44959,24.44959,0,0,0,16.916,6.746c6.68,0,14.532-5.274,15.839-6.713C37.688,39.186,31.197,38.93,29.933,35.528Z"/>
                            </svg>
                            <p>{{AppData.translations.header_sign_in}}</p>    
                        </div>-->
                        <div :class="this.$route.name == 'Homepage' ? 'link active' : 'link'" @click="$router.push({path: '/'});">{{AppData.translations.header_videos}}</div>
                        <div :class="this.$route.name == 'About' ? 'link active' : 'link'" @click="$router.push({path: '/about'});">{{AppData.translations.header_about}}</div>
                    </div>
                </div>
                <div v-else>
                    <div class="left">
                        <!--<div class="profile" @click="this.logout()">{{getProfileName}}</div>-->
                        <div :class="this.$route.name == 'Homepage' ? 'link active' : 'link'" @click="$router.push({path: '/'});">{{AppData.translations.header_videos}}</div>
                        <div :class="this.$route.name == 'Favorites' ? 'link active' : 'link'" @click="$router.push({path: '/favorites'});">{{AppData.translations.header_favorites}}</div>
                        <div :class="this.$route.name == 'About' ? 'link active' : 'link'" @click="$router.push({path: '/about'});">{{AppData.translations.header_about}}</div>
                    </div>
                </div>
                <div class="right">

                    <div v-if="!AppUser" class="link signin" @click="this.$emit('openModal', 'signin');">
                        <svg viewBox="0 0 50 50.198">
                            <circle cx="25" cy="25" r="24" />
                            <path d="M29.933,35.528a41.33538,41.33538,0,0,1-.09-4.21c.73-.383,2.038-2.825,2.259-4.888.574-.047,1.479-.607,1.744-2.818a2.06392,2.06392,0,0,0-.771-2.065c.934-2.809,2.874-11.499-3.588-12.397-.665-1.168-2.368-1.759-4.581-1.759-8.854.163-9.922,6.686-7.981,14.156a2.06777,2.06777,0,0,0-.771,2.065c.266,2.211,1.17,2.771,1.744,2.818.22,2.062,1.58,4.505,2.312,4.888a41.34553,41.34553,0,0,1-.091,4.21c-1.261,3.39-7.737,3.655-11.473,6.924a24.44959,24.44959,0,0,0,16.916,6.746c6.68,0,14.532-5.274,15.839-6.713C37.688,39.186,31.197,38.93,29.933,35.528Z"/>
                        </svg>
                        <p>{{AppData.translations.header_sign_in}}</p>    
                    </div>                    

                    <div v-if="AppUser && AppUser.istagger" :class="this.$route.name == 'Untagged' || this.$route.name == 'Reported' ? 'link submenu active' : 'link submenu'" @mouseover="toggleFiltersPointers(false)">
                        {{AppData.translations.header_manager}}
                        <div @mouseleave="toggleFiltersPointers(true)" class="manager">
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

                    <div class="link" v-if="AppUser" @click="this.logout()">{{AppData.translations.header_logout}}</div>

                    <div class="profile" v-if="AppUser">
                        <span v-if="AppUser.display_name">{{AppUser.display_name}}</span>
                        <span v-else>{{AppUser.user_email}}</span>
                    </div>

                    <div class="link" v-if="!this.$isMobile()">
                        <a target="_blank" :href="AppData.translations.downloads_google_play">
                            <svg viewBox="0 0 512 512">
                                <path d="M280.572,246.052L49.721,477.526c-11.034-10.465-16.997-24.819-16.997-40.374V74.096      c0-15.849,6.263-30.207,17.597-40.968L280.572,246.052z M280.572,246.052" style="fill:#2299F8;"/><g>
                                <path d="M480.104,255.62c0,20.938-11.34,39.477-30.131,49.95l-65.605,36.482l-81.428-75.367       l-22.367-20.634l86.193-86.429l83.207,46.056C468.764,216.152,480.104,234.69,480.104,255.62L480.104,255.62z M480.104,255.62" style="fill:#FFC107;"/>
                                <path d="M280.572,246.052L50.321,33.127c2.981-2.996,6.862-5.685,10.739-8.077       c18.787-11.363,41.456-11.667,60.839-0.895l244.867,135.467L280.572,246.052z M280.572,246.052" style="fill:#5ACF5F;"/></g>
                                <path d="M384.367,342.053L121.899,487.095c-9.243,5.386-19.688,7.774-29.826,7.774      c-10.734,0-21.469-2.69-31.013-8.668c-4.182-2.394-8.058-5.384-11.339-8.675l230.851-231.475l22.367,20.634L384.367,342.053z       M384.367,342.053" style="fill:#F84437;"/>
                            </svg>
                        </a>
                    </div>      
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
            this.$emit('closeFilters');
            this.$emit('openMenu');           
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
        },

        toggleFiltersPointers: function(active){
            console.log('toggleFiltersPointer', active);
            if(!active) {
                document.getElementById('vg-filters').classList.add('inactive');
            } else {
                document.getElementById('vg-filters').classList.remove('inactive');
            }
            
        }

    },
}
</script>