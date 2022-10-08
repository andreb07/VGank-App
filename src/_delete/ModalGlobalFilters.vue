<template>

  <ion-header>
    <ion-toolbar>
      <ion-title>{{title}}</ion-title>
      <ion-spinner v-if="sending" slot="end"></ion-spinner>
      <ion-button @click="chooseAndClose()" slot="end" color="light" size="small" style="margin-right:20px;" data-tap-disabled="true">Close</ion-button>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">

    <ion-input class="search" v-if="type == 'champions'" placeholder="Search..." v-model="searchTerm">
      <ion-icon slot="icon-only" :icon="searchOutline"></ion-icon>
    </ion-input>

    <ion-list>    
      <ion-item v-if="type != 'tags'">
        <ion-thumbnail slot="start"><img :src="'/assets/' + emptyThumb" /></ion-thumbnail>
        <ion-label><h2>{{any}}</h2></ion-label>
        <ion-button size="small" color="light" slot="end" @click="chooseAndClose()">Clean</ion-button>
      </ion-item>
      <RecycleScroller :item-size="75" :items="type != 'champions' ? list : filteredChamps">
        <template v-slot="{ item }">
          <ion-item :class="selected.indexOf(item.id) > -1 ? 'selected' : ''">
            <ion-thumbnail v-if="type != 'tags'" slot="start">
              <img :src="item.image" :key="item.id" />
            </ion-thumbnail>
            <ion-label>
              <h2 v-html="item.name"></h2>
            </ion-label>
            <ion-button size="small" color="light" @click="chooseAndClose(item.id)">Choose</ion-button>
          </ion-item>
        </template>
      </RecycleScroller>
    </ion-list>
  </ion-content>
</template>

<script>

import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonSpinner, IonList, IonItem, IonLabel, IonThumbnail, IonIcon, modalController, IonInput } from '@ionic/vue';
import { mapGetters, mapActions} from 'vuex';
import { searchOutline } from 'ionicons/icons';
import { RecycleScroller } from 'vue-virtual-scroller';

export default {
  name: 'ModalGlobalFilters',
  components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonSpinner, IonList, IonItem, IonLabel, IonThumbnail,IonIcon, RecycleScroller, IonInput },
  props: { type: String },
  setup() { return { searchOutline }},
  data() {
    return {
      selected: [],
      list: null,
      sending: false,
      title: '',
      any: '',
      field: '',
      emptyThumb: '',
      searchTerm:'',
      filteredChamps: []
    };
  },

  created: function(){
    console.log('##### OPEN MODAL GLOBAL FILTERS (Type: ' + this.type + ')'); 

    switch(this.type) {
        case 'champions': 
            this.title = 'Choose a Champion';
            this.any = "All";
            this.filteredChamps = this.AppData.champions;
            this.field = 'champion';
            this.emptyThumb = 'ChampionSquare.jpg';
        break;
        case 'ranks': 
            this.title = 'Choose Rank';
            this.any = "All";
            this.list = this.AppData.ranks;
            this.field = 'rank';
            this.emptyThumb = 'RankSquareNobg.png';
        break;
        case 'positions': 
            this.title = 'Choose Position';
            this.any = "All";
            this.list = this.AppData.positions;
            this.field = 'position';
            this.emptyThumb = 'PositionSquare.jpg';
        break;
        case 'tags': 
            this.title = 'Choose Tag';
            this.any = "";
            this.list = this.AppData.tags;
            this.field = 'tags';
        break;
        case 'channels': 
            this.title = 'Choose Channel';
            this.any = "All";
            this.list = this.AppData.channels;
            this.field = 'channel';
            this.emptyThumb = 'youtubeicon.jpg';
        break;
    }

  },

  computed: {
    ...mapGetters(['AppData']),
  },

  methods: {
    ...mapActions(['updateFilters', 'updateVideo']),

    chooseAndClose: function(cid){     

        console.log('##### CHOOSE FILTER', cid);
      
        if(!cid) {
            this.updateFilters({type:this.type, val:false});
            modalController.dismiss({dismissed:false});
        } else {
            console.log('#### CLOSE MODAL WITH SELECTED: ' + this.type + ' | ID: ' + cid);
            this.updateFilters({type:this.type, val:cid});
            modalController.dismiss({dismissed:false});
        }
    }
  },

  watch: {
    searchTerm: function(){
      const self = this;
      self.filteredChamps = [];

      this.AppData.champions.filter((champ) => {
        if(champ.name.toLowerCase().includes(self.searchTerm.toLowerCase()))  {
            self.filteredChamps.push(champ);
        }
      });
    }
  }
};
</script>

<style scoped>
  .vue-recycle-scroller {
    height:100vh;
  }

  ion-item ion-thumbnail.selected,
  ion-item  ion-label.selected {
    opacity: .4;
  }

  ion-item.selected ion-thumbnail.selected,
  ion-item.selected ion-label.selected {
    opacity: 1;
  }

  ion-spinner {
    height: 15x;
  }

  .search {
    margin-bottom: 15px;
  }

</style>