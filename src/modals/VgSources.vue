<template>
    <section id="vg-sources" class="modal">
        <div class="background" @click="this.$emit('closeModal');"></div>        
        <div class="container">
             <div class="close" @click="this.$emit('closeModal');">
                <svg viewBox="0 0 48 48">
                    <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/>
                </svg>
            </div>
            <h2>{{AppData.translations.source_title}}</h2>
            <div class="list">
                <div :class="'item blank ' + showClear" @click="choose()">
                    <svg viewBox="0 0 48 48">
                        <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/>
                    </svg>
                    <p>{{AppData.translations.source_clear}}</p>
                </div>
                <div v-for="source in AppData.channels" class="item" :key="source.id" @click="choose(source.id)">
                    <img :src="source.image" />
                    <p v-if="source.short_name" v-html="source.short_name"></p>
                    <p v-else v-html="source.name"></p>
                </div>
            </div>
        </div>        
    </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {

    computed: {
        ...mapGetters([ 'AppData', 'AppFilters', 'AppEditingModal']),

        showClear: function(){
            let showclear = '';
            if(this.AppFilters.channel || this.AppEditingModal) showclear = 'show';
            return showclear;
        }
    },

    methods: {
        ...mapActions(['updateFilters']),

        choose: function(id) {
            this.updateFilters({type:'channels', val:id});
            this.$emit('closeModal');
        }
    }
}
</script>

<style>

</style>