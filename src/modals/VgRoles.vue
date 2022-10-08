<template>
    <section id="vg-roles" class="modal" ref="modal">
        <div class="background" @click="this.$emit('closeModal');"></div>        
        <div class="container">
            <div class="close" @click="this.$emit('closeModal');">
                <svg viewBox="0 0 48 48">
                    <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/>
                </svg>
            </div>
            <h2>{{AppData.translations.role_title}}</h2>
            <div class="list">
                <div :class="'item blank ' + showClear">
                    <img src="/img/close_icon.svg" alt="clear" @click="choose()" />
                    <p>{{AppData.translations.role_clear}}</p>
                </div>
                <div v-for="role in AppData.positions" class="item" :key="role.id" :rid="role.id" @click="choose(role.id)">
                    <img :src="role.image" />
                    <p v-html="role.name"></p>
                </div>
            </div>
        </div>        
    </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {

    computed: {
        ...mapGetters([ 'AppData', 'AppFilters', 'AppEditingModal' ]),

         showClear: function(){
            let showclear = '';
            if(this.AppFilters.position || this.AppEditingModal) showclear = 'show';
            return showclear;
        }
    },

    methods: {
        ...mapActions(['updateFilters', 'setUntaggedVideoInfo']),

        choose: function(id) {

            let vid = this.$refs.modal.getAttribute('vid');  
            let vidtype = this.$refs.modal.getAttribute('vidtype'); 

            if(vid) {
                this.setUntaggedVideoInfo({vid:parseInt(vid), vidtype:vidtype, type:'positions', value: id});
            } else {
                 this.updateFilters({type:'positions', val:id});
            }

            this.$emit('closeModal');
        }
    }
}
</script>

<style>

</style>