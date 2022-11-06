<template>
    <div class="video">

        <div :class="'image-box ' + formateImage"  @click="this.$router.push('/video/' + data.id)">
            <div v-if="videoseen" class="check">
                <svg viewBox="0 0 7.5 5.92">
                    <path d="M7.41,.07c-.1-.1-.25-.1-.35,0L2.41,5.3,.44,3.72c-.1-.1-.26-.1-.36,0-.1,.1-.1,.26,0,.36,.01,.01,.03,.03,.05,.04l2.18,1.72c.1,.09,.25,.09,.35,0L7.43,.44c.09-.11,.08-.27-.02-.36,0,0,0,0,0,0Z"/>
                </svg>
            </div>
            <svg class="play" viewBox="0 0 512 512"><path d="M128,96v320l256-160L128,96L128,96z"/></svg> 
            <img class="" :src="data.thumb" />
        </div>    

        <div class="bottom">

            <div class="info" @click="this.$router.push('/video/' + data.id)">
                <div class="date">{{data.date}}</div>  
                <div class="channel" v-html="data.channel"></div>
                <div :class="emptyTags ? 'description' : 'description emptyTags'" v-html="data.description"></div> 
            </div>

            <div v-if="videoTags" class="tags">
                <div class="tag" v-for="tag in videoTags" :key="tag.id">{{tag.name}}</div>
            </div>
       
            <div class="filters">
                <div class="filter champion" v-for="champ in videoChamps" :key="champ.id" :style="'background-image:url(' + champ.image + ');'">
                    <label>{{champ.name}}</label>
                </div>
                <div class="filter rank" v-for="rank in videoRanks" :key="rank.id" :style="'background-image:url(' + rank.image + ');'">
                    <label>{{rank.name}}</label>
                </div>
                <div class="filter position" v-for="position in videoPositions" :key="position.id" :style="'background-image:url(' + position.image + ');'">
                    <label>{{position.name}}</label>
                </div>
            </div>

            <div class="actions">
                <div v-if="AppUser">
                    <div :class="videoReported ? 'item report blocked' : 'item report'" v-if="AppUser.istagger" @click="reportVideo($event)">
                        <label>{{AppData.translations.video_report_label}}</label>
                        <svg viewBox="0 0 24 24">
                            <path d="M13.18,4l0.24,1.2L13.58,6h0.82H19v7h-5.18l-0.24-1.2L13.42,11H12.6H6V4H13.18 M14,3H5v18h1v-9h6.6l0.4,2h7V5h-5.6L14,3 L14,3z"></path>
                            <rect x="5.8" y="3.9" width="7.7" height="7.4"/>
                            <rect x="13.3" y="5.5" width="6" height="7.8"/>
                        </svg>
                    </div>
                </div>                
                <div class="item" v-if="AppUser">
                    <label v-if="!videofavorite">{{AppData.translations.edit_save_label}}</label>
                    <label v-else>{{AppData.translations.edit_remove_label}}</label>
                    <svg viewBox="0 0 24 24" ref="savebt" :class="!videofavorite ? 'save add' : 'save remove'" @click="bookmarkVideo()">
                        <path d="M3.3 3H20.7C20.8657 3 21 3.13431 21 3.3V21.4811C21 21.7119 20.7503 21.8562 20.5503 21.7411L12.1497 16.9044C12.057 16.851 11.943 16.851 11.8503 16.9044L3.44969 21.7411C3.24969 21.8562 3 21.7119 3 21.4811V3.3C3 3.13431 3.13431 3 3.3 3Z"/>
                    </svg>
                </div>
            </div>  
        </div>
    </div>    
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import axios from 'axios';

export default {
    components: {  },

    props: { data: Object, type:String },

     data() {
      return {
        disabled: false
      }
    },

    computed: {
        ...mapGetters([ 'AppFilters' , 'AppData' , 'AppUser', 'AppApi', 'AppReported' ]),

        videoChamps: function(){
            const self = this;
            let champdata = [];

            if(!this.data.champion) return false;

            this.data.champion.some((videochamp) => {
                self.AppData.champions.some((champ) => {
                    if(champ.id == videochamp) {
                        champdata.push({id:champ.id, image:champ.image, name:champ.name});
                    }
                });
            });            

            return champdata;
        },

        videoRanks: function(){
            const self = this;
            let rankdata = [];

            if(!this.data.rank) return false;

             this.data.rank.some((videorank) => {
                self.AppData.ranks.some((rank) => {
                    if(rank.id == videorank) {
                        rankdata.push({id:rank.id, image:rank.image, name:rank.name});
                    }
                });
            });

            return rankdata;
        },

        videoPositions: function(){
            const self = this;
            let positiondata = [];

            if(!this.data.position) return false;

             this.data.position.some((videoposition) => {
                self.AppData.positions.some((position) => {
                    if(position.id == videoposition) {
                        positiondata.push({id:position.id, image:position.image, name:position.name});
                    }
                });
            });

            return positiondata;
        },

        videoTags: function(){
            const self = this;
            let tagdata = [];

            if(!this.data.tags) return false;

             this.data.tags.some((videotag) => {
                self.AppData.tags.some((tag) => {
                    if(tag.id == videotag) {
                        tagdata.push({id:tag.id, name:tag.name});
                    }
                });
            });

            return tagdata;
        },

        formateImage: function(){
           let offsetDateArra = '29/02/2022'.split('/');
           let offsetdate = new Date(+offsetDateArra[2], +offsetDateArra[1],+offsetDateArra[0]);
           let vdateArra = this.data.date.split('/');
           let vdate = new Date(+vdateArra[2], +vdateArra[1],+vdateArra[0]);
           let format = 'big';

           if(vdate.getTime() < offsetdate.getTime()) {
              format = 'small';
           }
           
           return format;
        },

        videofavorite: function(){
            let fav = false;
            if(this.AppUser) {
                if(this.AppUser.favs) {
                    if(this.AppUser.favs.indexOf(this.data.id) > -1) fav = true;
                }                 
            }           
            return fav;
        },
        
        videoseen: function(){
          let seen = false;

          if(this.AppUser) {
              if(this.AppUser.seen) {
                  if(this.AppUser.seen.indexOf(this.data.id) > -1) seen = true;
              }                 
          }           
          return seen;
      },

      videoReported: function() {
            let reported = false;

            if(this.AppUser) {
                if(this.AppReported) {                   
                    this.AppReported.some((vid) => {

                       if(vid.id == this.data.id) {
                        reported = true;
                       }
                    });
                }
            }

            return reported;
        },

        emptyTags: function(){
            let notags = false;

            if(this.videoChamps ||
                this.videoRanks ||
                this.videoPositions ||
                this.videoTags) {
                notags = true;
            }

            return notags;
        }
    },

    methods: {
        ...mapActions(['updateFilters', 'updateUserFavs', 'addVideoToEdit']),

        bookmarkVideo: async function() {

            if(this.disabled) return;
            this.disabled = true;

            let type = 'add';
            if(this.$refs.savebt.classList.contains('remove')) type = 'remove';            
            this.updateUserFavs({vid: this.data.id, type:type});



            await axios.post(this.AppApi.updateuserfavorites, { 
                vid: this.data.id,
                uid: this.AppUser.ID,
                type: type
            });

            this.disabled = false;
        },

        editVideo: function(){
            this.addVideoToEdit(this.data);
        },

        reportVideo: async function(e){

            if(e.currentTarget.classList.contains('blocked')) return;

            let response = await axios.post(this.AppApi.setReported, { 
                vid: this.data.id,
                uid: this.AppUser.ID
            });

            this.$emit('openModal', 'reported', {reportedType:response.data.status, vid:this.data});
        }
      
    }
}
</script>