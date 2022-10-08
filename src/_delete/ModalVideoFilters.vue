<template>

  <ion-header>
    <ion-toolbar>
      <!--<ion-title>{{title}}</ion-title>-->
      <ion-spinner v-if="sending" slot="end"></ion-spinner>
      <ion-button @touchstart="closeModal($event, null)" slot="start" color="light" size="small" style="margin-left:20px;" data-tap-disabled="true">Close</ion-button>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">

    <ion-input class="search" v-if="type == 'champions'" placeholder="Search..." v-model="searchTerm">
      <ion-icon slot="icon-only" :icon="searchOutline"></ion-icon>
    </ion-input>

    <ion-item class="addtag" v-if="type == 'tags'">
         <ion-input placeholder="Create new tag..." v-model="newTag"></ion-input>
        <ion-button :disabled="newTag.length > 2 ? 'false' : 'true'" size="small" color="light" clear item-right @touchstart="addTag()">Create</ion-button>
    </ion-item>    

    <ion-list>    
      <ion-item v-if="type != 'tags'">
        <ion-thumbnail slot="start"><img :src="'/assets/' + emptyThumb" /></ion-thumbnail>
        <ion-label><h2>{{any}}</h2></ion-label>
        <ion-button size="small" color="light" slot="end" @touchstart="choose($event, null)">Clean</ion-button>
      </ion-item>
      <RecycleScroller :item-size="75" :items="type != 'champions' ? list : filteredChamps">
        <template v-slot="{ item }">        
          <ion-item :class="selected.indexOf(item.id) > -1 ? 'selected' : ''">
            <ion-thumbnail v-if="type != 'tags'" slot="start" :class="vid ? 'selected' : ''">
              <img :src="item.image" :key="item.id" />
            </ion-thumbnail>
            <ion-label :class="vid ? 'selected' : ''">
              <h2 v-html="item.name"></h2>
            </ion-label>
            <ion-button v-if="selected.indexOf(item.id) > -1" size="small" color="light" @touchstart="choose($event, item.id)">Remove</ion-button>
            <ion-button v-if="selected.indexOf(item.id) == -1" size="small" color="light" @touchstart="choose($event, item.id)">Add</ion-button>
          </ion-item>
        </template>
      </RecycleScroller>
    </ion-list>
  </ion-content>
</template>

<script>

import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonSpinner, IonList, IonItem, IonLabel, IonThumbnail, IonIcon, modalController, IonInput, alertController  } from '@ionic/vue';
import { mapGetters, mapActions} from 'vuex';
import { searchOutline, addOutline } from 'ionicons/icons';
import { RecycleScroller } from 'vue-virtual-scroller';
import axios from 'axios';

export default {
  name: 'ModalVideoFilters',
  components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonSpinner, IonList, IonItem, IonLabel, IonThumbnail,IonIcon, RecycleScroller, IonInput, alertController  },
  props: { type: String, vid: Number, data: Object },
  setup() { return { searchOutline, addOutline}},
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
      newTag: '',
      filteredChamps: []
    };
  },

  created: function(){
    console.log('##### OPEN MODAL VIDEO FILTERS (Type: ' + this.type + ' | Vid: ' + this.vid + ')');

    switch(this.type) {
        case 'champions': 
            this.title = 'Tag a champions';
            this.any = "All Champions";
            this.filteredChamps = this.AppData.champions;
            this.field = 'champion';
            this.emptyThumb = 'ChampionSquare.jpg';
        break;
        case 'ranks': 
            this.title = 'Tag a rank';
            this.any = "Choose any rank";
            this.list = this.AppData.ranks;
            this.field = 'rank';
            this.emptyThumb = 'RankSquareNobg.png';
        break;
        case 'positions': 
            this.title = 'Tag a position';
            this.any = "Choose all positions";
            this.list = this.AppData.positions;
            this.field = 'position';
            this.emptyThumb = 'PositionSquare.jpg';
        break;
        case 'tags': 
            this.title = 'Choose any tag';
            this.any = "Choose all positions";
            this.list = this.AppData.tags;
            this.field = 'tags';
        break;
    }

    this.selected = this.data ? [...this.data] : [];
  },

  computed: {
    ...mapGetters(['AppData', 'AppUser'])
  },

  methods: {
    ...mapActions(['updateFilters', 'updateVideo', 'updateTags', 'updateUntagged']),

    closeModal: async function() {      
        const self = this;
        let changed = true;        
        this.sending = true;

        console.log('##### DATA', this.data);
        console.log('##### SELECTED', this.selected);

        if(this.data) {
          if(this.data.length > 0) {
            const selectedSorted = this.selected.slice().sort();
            const dataSorted = this.data.slice().sort();
            if(selectedSorted.length == dataSorted.length && selectedSorted.every((value, index) => value === dataSorted[index])) {
                changed = false;
            }
          }
        } else {
          if(this.selected.length == 0) {
            changed = false;
          }
        }

        if(changed) {

           console.log('##### SOMETHING CHANGED');

           let response;
            
            if(this.AppUser.istagger) {
               response = await axios.post('http://abworks.synology.me/mediaorg/wp-json/morg/v1/updatevideo/', { 
                  vid: self.vid, 
                  field: self.field, 
                  value: self.selected 
              })
            } 
            
            if(this.AppUser.istagger) {
              console.log('##### VIDEO IS TAGGED', response.data.tagged);
              this.updateVideo({vid:response.data.vid, type: self.field, val:this.selected});
              this.updateVideo({vid:response.data.vid, type: 'tagged', val:response.data.tagged});
              this.updateUntagged();
            } else {
              //this.openAlert();
            }

            this.sending = false;           
            
            modalController.dismiss({dismissed:false});
        } else {

             console.log('##### NOTHING CHANGED');

            modalController.dismiss({dismissed:false});
        }
    },

    openAlert: async function(){
      const alert = await alertController
        .create({
          cssClass: 'my-custom-class',
          header: 'Thank You!',
          message: 'Your tag has been registered! <br /> The video wil be updated soon!<br><br>Keep tagging...',
          buttons: [  {text: 'Okay',id: 'confirm-button',handler: () => {console.log('Confirm Okay')} },
          ],
        });
      return alert.present();
    },

    choose: function(e, cid){
        e.preventDefault();
        
        if(!cid) {
            this.selected = [];
        } else {
            if(this.selected.indexOf(cid) > -1) {
                this.selected.splice(this.selected.indexOf(cid), 1);
            } else {
                this.selected.push(cid);
            }
        }
    },

    addTag: async function(){
      console.log('addTag', this.newTag);
      let response = await axios.post('http://abworks.synology.me/mediaorg/wp-json/morg/v1/addtag/', {tag: this.newTag});

      if(!response.data.error) {
        this.updateTags(response.data.tags);
        this.list = this.AppData.tags;
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

  .search,
  .addtag {
    margin-bottom: 15px;
  }

</style>