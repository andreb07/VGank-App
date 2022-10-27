<template>

    <section id="vg-filters">
        <div class="bg" @click="this.$emit('closeFilters');"></div>
        <div class="container">
            <div class="main">
                <div class="filter champion" @click="this.$emit('openModal', 'champions');">
                    <div class="placeholder">
                        <img v-if="champion" :src="champion.image" />
                    </div>  
                    <div v-if="champion" class="label" v-html="champion.name"></div>                 
                    <div v-else class="label">{{AppData.translations.filter_champion}}</div>
                </div>
                <div class="filter rank" @click="this.$emit('openModal', 'ranks');">
                    <div class="placeholder">
                        <img v-if="rank" :src="rank.image" />
                    </div>  
                    <div v-if="rank" class="label" v-html="rank.name"></div>                 
                    <div v-else class="label">{{AppData.translations.filter_rank}}</div>
                </div>
                <div class="filter position" @click="this.$emit('openModal', 'roles');">
                    <div class="placeholder">
                        <img v-if="position" :src="position.image" />
                    </div>  
                    <div v-if="position" class="label" v-html="position.name"></div>                 
                    <div v-else class="label">{{AppData.translations.filter_role}}</div>
                </div>
                <div class="filter channel" @click="this.$emit('openModal', 'sources');">
                    <div class="placeholder">
                        <img v-if="channel" :src="channel.image" />
                    </div>  
                    <div class="label">{{AppData.translations.filter_source}}</div>
                </div>
            </div>
            <div class="inputs">
                <div class="search">                    
                    <div class="label" ref="searchlabel">
                        <svg viewBox="0 0 20 20">
                            <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                        </svg>
                        <p>{{AppData.translations.filter_search}}</p>
                    </div>
                    <input type="text" v-model="searchTerm" @focus="onSearchFocus()" @blur="onSearchBlur($event)" />
                </div>
                <div class="tag" @click="this.$emit('openModal', 'tags');">                    
                    <div v-if="!tag" class="bt">
                        <svg viewBox="0 0 256 256">
                            <path d="M194.4 196.4 240 128l-45.6-68.4a7.9 7.9 0 0 0-6.7-3.6H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h147.7a7.9 7.9 0 0 0 6.7-3.6Z"></path>
                        </svg>
                        <p>{{AppData.translations.filter_tag}}</p>
                    </div>
                    <div v-else class="bt filled">{{tag.name}}</div>
                </div>      
            </div>

            <div :class="'bt filter ' + activeFilters" ref="btfilter" @click="doFilters()">{{AppData.translations.filter_button}}</div>
            <div class="bt show" @click="showFilters()">Filter</div>
            <div class="reset" v-if="hasFilters" @click="doResetFilters()">{{AppData.translations.filter_reset}}</div>

            <section id="vg-loading" class="loading-filter" ref="filter">
                <img class="logo" :src="logo" />
                <img class="spinner" :src="spinner" />
            </section>
        </div>
    </section>

</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import axios from 'axios';

export default {

    data() {
        return {
            searchTerm:'',
            hidden: false,
            logo: require('@/assets/imgs/loading_logo.svg'),
            spinner: require('@/assets/imgs/loading_spinner.svg')
        };
    },

    computed: {
        ...mapGetters(['AppFilters', 'AppData', 'AppQuery', 'AppApi']),

        champion: function() {
            let _champ = false;
            this.AppData.champions.some((champ) => {
                if(champ.id == this.AppFilters.champion) {
                    _champ = champ;
                }
            });
            return _champ;
        },

        rank: function() {
            let _rank = false;
            this.AppData.ranks.some((rank) => {
                if(rank.id == this.AppFilters.rank) {
                    _rank = rank;
                }
            });
            return _rank;
        },

        position: function() {
            let _position = false;
            this.AppData.positions.some((position) => {
                if(position.id == this.AppFilters.position) {
                    _position = position;
                }
            });
            return _position;
        },

        channel: function() {
            let _channel = false;
            this.AppData.channels.some((channel) => {
                if(channel.id == this.AppFilters.channel) {
                    _channel = channel;
                }
            });
            return _channel;
        },

        tag: function() {
            let _tag = false;
            this.AppData.tags.some((tag) => {
                if(tag.id == this.AppFilters.tag) {
                    _tag = tag;
                }
            });
            return _tag;
        },

        activeFilters: function(){
            let active = '';

            if(JSON.stringify(this.AppFilters) === JSON.stringify(this.AppQuery.filters)) {
                active = 'blocked';
            }

            return active;
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
        ...mapActions(['updateFilters', 'updateSearchTerm', 'updateQuery', 'updateVideos', 'resetFilters']),

        doResetFilters: async function(){
            if(this.filtering) return;
             
            this.resetFilters();
            this.updateQuery({page: 0,filters: this.AppFilters});
            document.getElementById('vg-videos').classList.add('block');
            this.searchTerm = '';

            if(this.$route.name == 'Video') this.$router.push('/');
            
            const response = await axios.post(this.AppApi.getVideos, this.AppQuery);
            this.updateVideos(response);             
           
           window.scrollTo(0, 0);
           this.filtering = false;
           document.getElementById('vg-videos').classList.remove('block');
           this.$emit('closeFilters');
        },

        doFilters: async function(){
            
            if(this.filtering || this.$refs.btfilter.classList.contains('blocked')) return;
            this.filtering = true;
            this.$refs.filter.classList.add('show');
            document.getElementById('vg-videos').classList.add('block');
            this.updateQuery({page: 0,filters: this.AppFilters});

            if(this.$route.name == 'Video') this.$router.push('/');

            const response = await axios.post(this.AppApi.getVideos, this.AppQuery);
            this.updateVideos(response);   
            window.scrollTo(0, 0);            

            this.filtering = false;
            this.$refs.filter.classList.remove('show');
            this.$emit('closeFilters');
            document.getElementById('vg-videos').classList.remove('block');

            // eslint-disable-next-line
            gtag('event', 'filter_videos');
            
        },

        showFilters: function(){
            document.getElementById('vg-app').classList.remove('fixed');
            document.getElementById('vg-header').classList.add('blackened');
        },

        closeFilters: function(){
            document.getElementById('vg-app').classList.add('fixed');
            document.getElementById('vg-header').classList.remove('blackened');
        },

        onSearchFocus: function(){
            this.$refs.searchlabel.classList.add('hide');
        },

        onSearchBlur: function(e){
            if(!e.target.value) this.$refs.searchlabel.classList.remove('hide');
        }

    },

    watch: {
        searchTerm: function(val){
            this.updateFilters({type:'text', val:val});
        }
    }
}
</script>