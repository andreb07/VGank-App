<template>
    <section id="vg-champions" class="modal" ref="modal">
        <div class="background" @click="this.$emit('closeModal');"></div>        
        <div class="container">
            <div class="close" @click="this.$emit('closeModal');">
                <svg viewBox="0 0 48 48">
                    <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/>
                </svg>
            </div>
            <h2>{{AppData.translations.chamion_title}}</h2>
           <div class="search">
                <div class="label" ref="searchlabel">
                    <svg viewBox="0 0 20 20">
                        <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                    </svg>
                    <p>{{AppData.translations.champion_search}}</p>
                </div>
                <input type="text" v-model="searchTerm" @focus="onSearchFocus()" @blur="onSearchBlur($event)" />
            </div>

            <div class="list">
                <div :class="'item blank ' + showClear" @click="choose()">
                    <svg viewBox="0 0 48 48">
                        <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/>
                    </svg>
                    <p>{{AppData.translations.champion_clear}}</p>
                </div>
                <div v-for="champ in filteredChamps" class="item" :key="champ.id" :cid="champ.id" @click="choose($event, champ.id)">
                    <img :src="champ.image" />
                    <p v-html="champ.name"></p>
                </div>
            </div>
        </div>        
    </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
            searchTerm:''
        };
    },

    computed: {
        ...mapGetters([ 'AppData', 'AppFilters', 'AppEditingModal']),

        filteredChamps: function(){
            const self = this;
            let champs = [];            
            
            this.AppData.champions.filter((champ) => {
                if(champ.name.toLowerCase().includes(self.searchTerm.toLowerCase()))  {
                    champs.push(champ);
                }
            });
            
            return champs;
        },

        showClear: function(){
            let showclear = '';
            if(this.AppFilters.champion || this.AppEditingModal) showclear = 'show';
            return showclear;
        }
    },

    methods: {
        ...mapActions(['updateFilters', 'setUntaggedVideoInfo']),

        choose: function(e, cid) {

            let vid = this.$refs.modal.getAttribute('vid'); 
            let vidtype = this.$refs.modal.getAttribute('vidtype');      

            if(vid) {
                this.setUntaggedVideoInfo({vid:parseInt(vid), vidtype:vidtype, type:'champions', value: cid});
            } else {
                 this.updateFilters({type:'champions', val:cid});
            }
            
            this.searchTerm = '';
            this.$emit('closeModal');
        },

        onSearchFocus: function(){
            this.$refs.searchlabel.classList.add('hide');
        },

        onSearchBlur: function(e){
            if(!e.target.value) this.$refs.searchlabel.classList.remove('hide');
        }
    }
}
</script>

<style>

</style>