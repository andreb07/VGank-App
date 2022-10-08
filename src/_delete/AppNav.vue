<template>
    <section id="nav">
        <div :class="AppListType == 'all' ? 'tab selected' : 'tab'" data-tab="all" @click="chooseTab($event)">Videos <ion-badge v-if="AppUser.istagger" color="dark">{{AppData.tagged}}</ion-badge></div>
        <div :class="AppListType == 'favorites' ? 'tab selected' : 'tab'" data-tab="favorites" @click="chooseTab($event)">Favorites</div>
        <div v-if="AppUser.istagger && AppData.untagged > 0" :class="AppListType == 'untagged' ? 'tab selected' : 'tab'" data-tab="untagged" @click="chooseTab($event)">Untagged  <ion-badge color="danger">{{AppData.untagged}}</ion-badge></div>
    </section>
</template>

<script>
import {IonSegment, IonSegmentButton, IonLabel, IonBadge} from '@ionic/vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'AppNav',

    components: { IonSegment, IonSegmentButton, IonLabel, IonBadge },

    data() {
        return {
            initialNav: 'all'
        }
    },

    mounted: function() {
        //if(this.AppUser.champs.length > 0) this.initialNav = 'all';
        this.initialNav = 'favorites';
        //console.log(this.initialNav);
    },

    computed: {
        ...mapGetters(['AppUser', 'AppListType', 'AppData'])
    },
    methods: {

        ...mapActions(['changeListType']),

        chooseTab(e) {
            const tabval = e.target.getAttribute('data-tab');
            //$refs.scroller.scrollToItem(0);
            this.changeListType(tabval);
        },
    }
}
</script>

<style scoped>
    #nav {
        display: flex;
        justify-content:space-between;
    }

    #nav .tab {
        width: 100%;
        line-height: 50px;
        text-align: center;
        background: #cccccc10;
        color: #fff;
    }

    #nav .tab.selected {
        background: #00000010;
    }

    ion-badge {
        font-size: 10px;
        pointer-events: none;
        touch-action: none;
    }
</style>
