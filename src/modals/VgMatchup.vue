<template>
    <section id="vg-matchup" class="modal" ref="modal">
        <div class="background" @click="this.$emit('closeModal');"></div>        
        <div class="container">
            <div class="close" @click="this.$emit('closeModal');">
                <svg viewBox="0 0 48 48">
                    <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/>
                </svg>
            </div>
            <h2>Select a matchup</h2>
           <div class="match">
                <div class="champ">
                    <div class="placeholder" @click="this.$emit('openModalChampionFromMatchup', 1);"></div>
                    <div class="label">Champion</div>
                </div>
                <div class="vs">VS</div>
                <div class="champ">
                    <div class="placeholder" @click="this.$emit('openModalChampionFromMatchup', 2);"></div>
                    <div class="label">Champion</div>
                </div>
           </div>
           <div class="bt select">Select</div>
        </div>        
    </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {

    data() {
        return {
           
        };
    },

    computed: {
        ...mapGetters([ 'AppData', 'AppFilters', 'AppEditingModal', 'AppApi', 'AppUser' ])
    },

    methods: {
        ...mapActions(['updateFilters', 'setUntaggedVideoInfo', 'updateTags']),

        choose: function() {

            //this.$emit('closeModal');
        },

    }
}
</script>

<style>

</style>