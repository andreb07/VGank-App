<template>
    <section id="vg-tags" class="modal" ref="modal">
        <div class="background" @click="this.$emit('closeModal');"></div>        
        <div class="container">
            <div class="close" @click="this.$emit('closeModal');">
                <svg viewBox="0 0 48 48">
                    <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/>
                </svg>
            </div>
            <h2>Select a tag</h2>
            <!--<div class="search" v-if="AppUser && $route.name == 'Untagged'">
                <input type="text" placeholder="New Tag" v-model="newtag" />
                <div v-if="newtag != ''" class="bt" @click="addTag()">Add</div>
                <img v-if="isSending" class="loader" src="/img/loader.gif" />
                <div class="error">{{errorMsg}}</div>
            </div>-->
            <div class="list">
                <div :class="'item blank ' + showClear"  @click="choose()">
                    <p>None</p>
                </div>
                <div v-for="tag in AppData.tags" class="item" :key="tag.id" :tid="tag.id" @click="choose(tag.id)">
                    <p v-html="tag.name"></p>
                </div>
            </div>
        </div>        
    </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {

    data() {
        return {
            newtag:'',
            errorMsg:'',
            isSending: false
        };
    },

    computed: {
        ...mapGetters([ 'AppData', 'AppFilters', 'AppEditingModal', 'AppApi', 'AppUser' ]),

        showClear: function(){
            let showclear = '';
            if(this.AppFilters.tag || this.AppEditingModal) showclear = 'show';
            return showclear;
        }
    },

    methods: {
        ...mapActions(['updateFilters', 'setUntaggedVideoInfo', 'updateTags']),

        choose: function(id) {

            let vid = this.$refs.modal.getAttribute('vid');  
            let vidtype = this.$refs.modal.getAttribute('vidtype')

            if(vid) {
                this.setUntaggedVideoInfo({vid:parseInt(vid), vidtype:vidtype, type:'tags', value: id});
            } else {
                 this.updateFilters({type:'tags', val:id});
            }

            this.$emit('closeModal');
        },

        addTag: async function(){

            this.isSending = true;
            this.errorMsg = '';

            const response = await axios.post(this.AppApi.addTag, { tag:this.newtag });
            
            if(!response.data.error) {
                this.updateTags(response.data.tags);
            } else {
                this.errorMsg = response.data.error;
            }

            this.isSending = false;
        }
    }
}
</script>

<style>

</style>