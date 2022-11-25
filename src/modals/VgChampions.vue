<template>
    <section id="vg-champions" class="modal" ref="modal">
        <div class="background" @click="closeModal()"></div>        
        <div class="container">
            <div class="close" @click="closeModal()">
                <svg viewBox="0 0 48 48">
                    <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/>
                </svg>
            </div>
            <h2>{{AppData.translations.chamion_title}}</h2>
        
            <div class="bar">
                <div class="search">
                    <div class="label" ref="searchlabel">
                        <svg viewBox="0 0 20 20">
                            <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                        </svg>
                        <p>{{AppData.translations.champion_search}}</p>
                    </div>
                    <input type="text" ref="searchInput" :value="searchTerm" @input="e => searchTerm = e.target.value" @focus="onSearchFocus()" @blur="onSearchBlur($event)" />
                </div>

                <div v-if="!isMatchup" class="bt create" @click="toggleMatchup()">{{AppData.translations.champion_mu_btn}}</div>
    
                <div v-if="isMatchup" class="matchup">
                    <div class="match">
                        <div class="champ">
                            <div class="placeholder">
                                <img v-if="champion1" :src="champion1.image" />
                            </div>
                            <div class="label">{{AppData.translations.champion_mu_champlabel}}</div>
                        </div>
                        <div class="vs">VS</div>
                        <div class="champ">
                            <div class="placeholder">
                                <img v-if="champion2" :src="champion2.image" />
                            </div>
                            <div class="label">{{AppData.translations.champion_mu_champlabel}}</div>
                        </div>
                    </div>

                    <div class="bts">
                        <div :class="AppFilters.champion2 ? 'bt select show' : 'bt select'" @click="selectMatchup()">{{AppData.translations.champion_mu_select}}</div>
                        <div class="bt" @click="toggleMatchup()">{{AppData.translations.champion_mu_reset}}</div>
                    </div>
                    
                </div>                
              
            </div>      

            <div class="list" ref="list">
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
            searchTerm:'',
            isMatchup:false
        };
    },

    computed: {
        ...mapGetters([ 'AppData', 'AppFilters', 'AppEditingModal', 'AppEditingModal']),

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

        champion1: function() {
            let _champ = false;
            this.AppData.champions.some((champ) => {
                if(champ.id == this.AppFilters.champion) {
                    _champ = champ;
                }
            });
            return _champ;
        },

        champion2: function() {
            let _champ = false;
            this.AppData.champions.some((champ) => {
                if(champ.id == this.AppFilters.champion2) {
                    _champ = champ;
                }
            });
            return _champ;
        },

        showClear: function(){
            let showclear = '';
            if(this.AppFilters.champion) showclear = 'show';
            return showclear;
        }
    },

    methods: {
        ...mapActions(['updateFilters', 'setUntaggedVideoInfo', 'updateVideo']),

        choose: function(e, cid) {

            if(this.isMatchup) {

                let vid = this.$refs.modal.getAttribute('vid'); 
                let vidtype = this.$refs.modal.getAttribute('vidtype'); 


                if(!cid) {
                    let type = '';
                    if(this.AppFilters.champion2) {
                        type = 'champion2';
                    } else {
                        type = 'champions';
                    }
                    this.updateFilters({type:type, val:cid});

                    if(vid) {
                        this.setUntaggedVideoInfo({vid:parseInt(vid), vidtype:vidtype, type:type, value: cid, route:this.$route.name});
                    }
                    
                } else {                    

                    if(!vid) {
                        if(!this.AppFilters.champion) {
                            this.updateFilters({type:'champions', val:cid});
                        } else {
                            this.updateFilters({type:'champion2', val:cid});
                        }
                    } else {
                        let field = '';

                        if(!this.AppFilters.champion) {
                            field = 'champions';
                        } else {
                            field = 'champion2';
                        }

                        this.updateFilters({type:field, val:cid});
                        this.setUntaggedVideoInfo({vid:parseInt(vid), vidtype:vidtype, type:field, value: cid, route:this.$route.name});
                    }

                    this.searchTerm = '';
                    this.$refs.searchlabel.classList.remove('hide');
                }               
                
            } else {

                let vid = this.$refs.modal.getAttribute('vid'); 
                let vidtype = this.$refs.modal.getAttribute('vidtype');    
                
                if(vid) {
                    this.setUntaggedVideoInfo({vid:parseInt(vid), vidtype:vidtype, type:'champions', value: cid, route:this.$route.name});
                } 
                
                this.updateFilters({type:'champions', val:cid});
                this.searchTerm = '';
                this.$emit('closeModal');
            }
          
        },

        selectMatchup: function(){
            if(!this.AppFilters.champion2) return;
            this.searchTerm = '';
            this.$emit('closeModal');
        },

        onSearchFocus: function(){
            this.$refs.searchlabel.classList.add('hide');
        },

        onSearchBlur: function(e){
            if(!e.target.value) this.$refs.searchlabel.classList.remove('hide');
        }, 

        slidePerspective: function(){
            if(this.$refs.options.classList.contains('on')) {
                this.$refs.options.classList.remove('on');
            } else {
                this.$refs.options.classList.add('on');
            }
        },

        toggleMatchup: function(){
            if(this.isMatchup) {
                let vid = this.$refs.modal.getAttribute('vid'); 
                this.isMatchup = false;
                this.updateFilters({type:'champions', val:''});
                this.updateFilters({type:'champion2', val:''});

                let selected = document.querySelectorAll("#vg-champions .item.selected");
                selected.forEach(el => {
                    el.classList.remove('selected');
                })
                
                if(this.AppEditingModal) {
                    this.updateVideo({type:'champion', val:'', list:'untagged', vid:vid});
                    this.updateVideo({type:'champion2', val:'', list: 'untagged', vid:vid});
                }
                
            } else {
                this.isMatchup = true;
            }
        },

        closeModal: function() {
            this.$emit('closeModal');

            if(!this.AppFilters.champion && !this.AppFilters.champion2) {
                this.isMatchup = false;
            }
        }
    }
}
</script>

<style>

</style>