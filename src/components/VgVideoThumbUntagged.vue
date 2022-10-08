<template>
    <div class="video">
        <div class="popup" ref="popup">
            <div class="bg" @click="this.closePopup()"></div>
            <div class="content">
                <h2>{{AppData.translations.delete_title}}</h2>
                <p>{{AppData.translations.delete_text}}</p>
                <div class="bt" @click="this.delete()">{{AppData.translations.delete_confirmation}}</div>
                <div class="close" @click="this.closePopup();">
                    <svg viewBox="0 0 48 48">
                        <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/>
                    </svg>
                </div>
            </div>
        </div>
        <div :class="'image-box ' + formateImage"  @click="this.$router.push('/video/' + data.id)">
            <svg class="play" viewBox="0 0 512 512"><path d="M128,96v320l256-160L128,96L128,96z"/></svg> 
            <img class="" :src="data.thumb" />
        </div>   

        <div class="bottom">       
        
            <div class="info" @click="this.$router.push('/video/' + data.id)">
                <div class="date">{{data.date}}</div>  
                <div class="channel" v-html="data.channel"></div>
                <div class="description" v-html="data.description"></div> 
            </div>
            
            <div v-if="videoTags" class="tags" @click="$emit('openModal', 'tags', {vid:data.id, vidtype:this.type});">
                <div class="tag" v-for="tag in videoTags" :key="tag.id">{{tag.name}}</div>
            </div>

            <div v-else class="tags">
                <div class="tag" @click="$emit('openModal', 'tags', {vid:data.id, vidtype:this.type});">{{AppData.translations.edit_add_tags}}</div>
            </div>    

            <div class="filters">
                <div v-if="!videoChamps" class="filter champion empty" @click="$emit('openModal', 'champions', {vid:data.id, vidtype:this.type});">
                    <label>{{AppData.translations.filter_champion}}</label>
                </div>
                <div v-else class="filter champion clickable" v-for="champ in videoChamps" :key="champ.id" :style="'background-image:url(' + champ.image + ');'" @click="$emit('openModal', 'champions',{vid:data.id, vidtype:this.type});">
                    <label>{{champ.name}}</label>
                </div>

                <div v-if="!videoRanks" class="filter rank empty" @click="$emit('openModal', 'ranks', {vid:data.id, vidtype:this.type});">
                    <label>{{AppData.translations.filter_rank}}</label>
                </div>
                <div v-else class="filter rank clickable" v-for="rank in videoRanks" :key="rank.id" :style="'background-image:url(' + rank.image + ');'" @click="$emit('openModal', 'ranks', {vid:data.id, vidtype:this.type});">
                    <label>{{rank.name}}</label>
                </div>

                <div v-if="!videoPositions" class="filter position empty" @click="$emit('openModal', 'roles', {vid:data.id, vidtype:this.type});">
                    <label>{{AppData.translations.filter_role}}</label>
                </div>
                <div v-else class="filter position clickable" v-for="position in videoPositions" :key="position.id" :style="'background-image:url(' + position.image + ');'" @click="$emit('openModal', 'roles',{vid:data.id, vidtype:this.type});">
                    <label>{{position.name}}</label>
                </div>
            </div>
            <div class="actions">
                <img v-if="isSending" class="loader" src="/img/loader.gif" />
                <div v-if="isChanged" class="bt save icon" @click="this.saveVideo()">
                    <svg viewBox="0 0 64 64">
                        <path fill="none" stroke="#000000" d="M39,14H16a2.1,2.1,0,0,0-2,2.18V47.82A2.1,2.1,0,0,0,16,50H48a2.1,2.1,0,0,0,2-2.18V24.91Z"/>
                        <rect fill="none" stroke="#000000" height="9" width="15" x="19" y="14"/>
                        <rect fill="none" stroke="#000000" height="19" width="24" x="19" y="31"/>
                    </svg>
                </div>            
                <div v-if="!reported" class="bt delete icon" @click="this.openPopup()">
                   <svg viewBox="0 0 512 512">
                        <path d="M400,113.3h-80v-20c0-16.2-13.1-29.3-29.3-29.3h-69.5C205.1,64,192,77.1,192,93.3v20h-80V128h21.1l23.6,290.7   c0,16.2,13.1,29.3,29.3,29.3h141c16.2,0,29.3-13.1,29.3-29.3L379.6,128H400V113.3z M206.6,93.3c0-8.1,6.6-14.7,14.6-14.7h69.5   c8.1,0,14.6,6.6,14.6,14.7v20h-98.7V93.3z M341.6,417.9l0,0.4v0.4c0,8.1-6.6,14.7-14.6,14.7H186c-8.1,0-14.6-6.6-14.6-14.7v-0.4   l0-0.4L147.7,128h217.2L341.6,417.9z"/>
                        <rect height="241" width="14" x="249" y="160"/>
                        <polygon points="320,160 305.4,160 294.7,401 309.3,401"/>
                        <polygon points="206.5,160 192,160 202.7,401 217.3,401"/>
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

    props: { data: Object, type:String, reported: Boolean },

     data() {
      return {
        disabled: false,
        isSending: false,
      }
    },

    computed: {
        ...mapGetters([ 'AppFilters' , 'AppData' , 'AppUser', 'AppApi' ]),

        videoChamps: function(){
            const self = this;
            let champdata = [];

            if(!this.data.champion) return false;
            if(this.data.champion.length == 0) return false;

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
            if(this.data.rank.length == 0) return false;

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
            if(this.data.position.length == 0) return false;

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
            if(this.data.tags.length == 0) return false;

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
            let fav = '';
            if(this.AppUser.favs.indexOf(this.data.id) > -1) fav = 'isfav';
            return fav;
        },

        isChanged: function(){
            let changed = false;

            if(this.videoChamps ||
                this.videoRanks ||
                this.videoPositions ||
                this.videoTags) {
                changed = true;
            }

            return changed;

        }
    },

    methods: {
        ...mapActions(['updateFilters', 'updateUserFavs', 'removeVideo', 'removeReportedVideo']),

        bookmarkVideo: async function(e) {

            if(this.disabled) return;
            this.disabled = true;

            let type = 'add';
            if(e.target.classList.contains('isfav')) type = 'remove';
            
            this.updateUserFavs({vid: this.data.id, type:type});

            await axios.post(this.AppApi.updateuserfavorites, { 
                vid: this.data.id,
                uid: this.AppUser.ID,
                type: type
            });

            this.disabled = false;
        },

        openPopup: function(){
            this.$refs.popup.classList.add('show');            
        },

        closePopup: function(){
            this.$refs.popup.classList.remove('show');
        },

        delete: async function(){
            if(this.disabled) return;
            this.disabled = true;

            await axios.post(this.AppApi.deleteVideo, { vid: this.data.id});
            this.removeVideo(this.data.id);

            this.disabled = false;
        },

        saveVideo: async function(){

            if(this.isSending) return;
            this.isSending = true;

            await axios.post(this.AppApi.updateVideo, { 
                'vid' : this.data.id,
                'champions': this.videoChamps,
                'ranks' : this.videoRanks,
                'positions' : this.videoPositions,
                'tags' : this.videoTags,
                'uid': this.AppUser.ID
            });

            if(this.type == 'tagged') {

                if(this.reported) {
                    await axios.post(this.AppApi.removeReported, {'vid' : this.data.reportedId});
                    this.removeReportedVideo(this.data.id);
                    this.isSending = false;
                } else {
                    this.$router.replace('/');
                    this.isSending = false;
                }
                
            }
            
            if(this.type == 'untagged') {
                this.removeVideo(this.data.id);
                 this.isSending = false;
            } 
        }
      
    }
}
</script>