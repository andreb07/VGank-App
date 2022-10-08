<template>
  <section id="vg-video" v-if="videodata" :class="hasFilters ? 'wfilters' : ''">
    <div class="v-wrapper">
      <iframe id="ytplayer" type="text/html" :src="videourl" allowfullscreen />
    </div>
    <div class="info">
      <div class="container">

        <div class="col left">   
          <div class="data">          
            <div class="date">{{videodata.date}}</div>
            <div class="channel" v-html="videoChannel.name"></div>  
            <div class="description" v-html="videodata.description"></div> 
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
            <div class="bottom">
              <a target="_blank" :href="'https://www.youtube.com/channel/' + videoChannel.youtube_id">
                <img class="channelimage" :src="videoChannel.image" />
                <div class="channelname">
                  <div class="channel" v-html="videoChannel.name"></div>  
                  <p>{{AppData.translations.others_support_channel}}</p>
                </div>
              </a>
            </div>         
          </div>
        </div> 

        <div class="col right">  
          <div class="actions">
              
            <div class="item" v-if="AppUser">
              <label v-if="!videoseen">Check</label>
              <label v-else>Uncheck</label>
              <svg :class="videoseen ? 'check seen' : 'check'" viewBox="0 0 7.5 5.92" @click="updateSeenVideo()">
                <path d="M7.41,.07c-.1-.1-.25-.1-.35,0L2.41,5.3,.44,3.72c-.1-.1-.26-.1-.36,0-.1,.1-.1,.26,0,.36,.01,.01,.03,.03,.05,.04l2.18,1.72c.1,.09,.25,.09,.35,0L7.43,.44c.09-.11,.08-.27-.02-.36,0,0,0,0,0,0Z"/>
              </svg>
            </div>

            <div class="item" v-if="AppUser">
              <label v-if="!videofavorite">{{AppData.translations.video_save_label}}</label>
              <label v-else>{{AppData.translations.video_remove_label}}</label>
              <svg viewBox="0 0 24 24" ref="savebt" :class="!videofavorite ? 'save add' : 'save remove'" @click="bookmarkVideo()">
                <path d="M3.3 3H20.7C20.8657 3 21 3.13431 21 3.3V21.4811C21 21.7119 20.7503 21.8562 20.5503 21.7411L12.1497 16.9044C12.057 16.851 11.943 16.851 11.8503 16.9044L3.44969 21.7411C3.24969 21.8562 3 21.7119 3 21.4811V3.3C3 3.13431 3.13431 3 3.3 3Z"/>
              </svg>
            </div>            
            <div :class="videoReported ? 'item report blocked' : 'item report'" v-if="AppUser" @click="reportVideo()">
              <label>{{AppData.translations.video_report_label}}</label>
              <svg viewBox="0 0 24 24">
                <path d="M13.18,4l0.24,1.2L13.58,6h0.82H19v7h-5.18l-0.24-1.2L13.42,11H12.6H6V4H13.18 M14,3H5v18h1v-9h6.6l0.4,2h7V5h-5.6L14,3 L14,3z"></path>
                <rect x="5.8" y="3.9" width="7.7" height="7.4"/>
                <rect x="13.3" y="5.5" width="6" height="7.8"/>
             </svg>
            </div>
            <div class="item" @click="toggleShare()">
              <label>{{AppData.translations.video_share_label}}</label>
              <svg class="share" viewBox="0 0 256 256">
                <circle cx="64" cy="128" r="32" />
                <circle cx="176" cy="200" r="32" />
                <circle cx="176" cy="56" r="32" />
                <line x1="149.1" x2="90.9" y1="73.3" y2="110.7"/>
                <line x1="90.9" x2="149.1" y1="145.3" y2="182.7"/>
              </svg>
            </div>            
          </div>  

          <div class="shareicons" ref="shareicons">
              <div class="bg" @click="toggleShare()"></div>
              <div class="center">
                
                <div class="title">
                  <p>{{AppData.translations.video_share}}</p>
                  <div class="close" @click="toggleShare()">
                    <svg viewBox="0 0 48 48">
                        <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/>
                    </svg>
                  </div>  
                </div>
                <a :href="AppShareLinks.whatsapp + videodata.id" target="_blank">
                  <svg viewBox="0 0 1000 1000" >
                    <path class="st0" fill="#25D366" d="M500,1000L500,1000C223.9,1000,0,776.1,0,500v0C0,223.9,223.9,0,500,0h0c276.1,0,500,223.9,500,500v0   C1000,776.1,776.1,1000,500,1000z"/>
                    <path class="st1" fill="#ffffff" d="M733.9,267.2c-62-62.1-144.6-96.3-232.5-96.4c-181.1,0-328.6,147.4-328.6,328.6      c0,57.9,15.1,114.5,43.9,164.3L170.1,834l174.2-45.7c48,26.2,102,40,157,40h0.1c0,0,0,0,0,0c181.1,0,328.5-147.4,328.6-328.6      C830.1,411.9,796,329.3,733.9,267.2z M501.5,772.8h-0.1c-49,0-97.1-13.2-139-38.1l-10-5.9L249,755.9l27.6-100.8l-6.5-10.3      c-27.3-43.5-41.8-93.7-41.8-145.4c0.1-150.6,122.6-273.1,273.3-273.1c73,0,141.5,28.5,193.1,80.1c51.6,51.6,80,120.3,79.9,193.2      C774.6,650.3,652,772.8,501.5,772.8z M651.3,568.2c-8.2-4.1-48.6-24-56.1-26.7c-7.5-2.7-13-4.1-18.5,4.1      c-5.5,8.2-21.2,26.7-26,32.2c-4.8,5.5-9.6,6.2-17.8,2.1c-8.2-4.1-34.7-12.8-66-40.8c-24.4-21.8-40.9-48.7-45.7-56.9      c-4.8-8.2-0.5-12.7,3.6-16.8c3.7-3.7,8.2-9.6,12.3-14.4c4.1-4.8,5.5-8.2,8.2-13.7c2.7-5.5,1.4-10.3-0.7-14.4      c-2.1-4.1-18.5-44.5-25.3-61c-6.7-16-13.4-13.8-18.5-14.1c-4.8-0.2-10.3-0.3-15.7-0.3c-5.5,0-14.4,2.1-21.9,10.3      c-7.5,8.2-28.7,28.1-28.7,68.5c0,40.4,29.4,79.5,33.5,84.9c4.1,5.5,57.9,88.4,140.3,124c19.6,8.5,34.9,13.5,46.8,17.3      c19.7,6.3,37.6,5.4,51.7,3.3c15.8-2.4,48.6-19.9,55.4-39c6.8-19.2,6.8-35.6,4.8-39C665,574.4,659.5,572.4,651.3,568.2z"/>
                  </svg>
                </a>
                <a :href="AppShareLinks.facebook + videodata.id" target="_blank">
                  <svg viewBox="0 0 1000 1000">
                    <path fill="#3B579D" d="M500,1000L500,1000C223.9,1000,0,776.1,0,500v0C0,223.9,223.9,0,500,0h0c276.1,0,500,223.9,500,500v0   C1000,776.1,776.1,1000,500,1000z"/>
                    <path fill="#FFFFFF" d="M630,1000V612.7h130l19.5-150.9H630v-96.4c0-43.7,12.1-73.5,74.8-73.5l79.9,0V157   c-13.8-1.8-61.3-5.9-116.5-5.9c-115.2,0-194.1,70.3-194.1,199.5v111.3H343.8v150.9h130.3V1000H630z"/>
                  </svg>
                </a>
                <a :href="AppShareLinks.twitter + videodata.id" target="_blank">
                  <svg viewBox="0 0 1000 1000" >
                    <path fill="#1DA1F2" d="M500,0L500,0c276.1,0,500,223.9,500,500v0c0,276.1-223.9,500-500,500h0C223.9,1000,0,776.1,0,500v0    C0,223.9,223.9,0,500,0z"/>
                    <path fill="#FFFFFF" d="M384,754c235.8,0,364.9-195.4,364.9-364.9c0-5.5,0-11.1-0.4-16.6c25.1-18.2,46.8-40.6,64-66.4    c-23.4,10.4-48.2,17.2-73.6,20.2c26.8-16,46.8-41.2,56.4-70.9c-25.2,14.9-52.7,25.5-81.4,31.1c-48.6-51.6-129.8-54.1-181.4-5.6    c-33.3,31.3-47.4,78-37.1,122.5c-103.1-5.2-199.2-53.9-264.3-134c-34,58.6-16.7,133.5,39.7,171.2c-20.4-0.6-40.4-6.1-58.2-16    c0,0.5,0,1.1,0,1.6c0,61,43,113.6,102.9,125.7c-18.9,5.1-38.7,5.9-57.9,2.2c16.8,52.2,64.9,88,119.8,89.1    c-45.4,35.7-101.5,55.1-159.2,55c-10.2,0-20.4-0.6-30.5-1.9C246.1,734,314.4,754,384,753.9"/>
                    <path fill="none" d="M500,0L500,0c276.1,0,500,223.9,500,500v0c0,276.1-223.9,500-500,500h0C223.9,1000,0,776.1,0,500v0    C0,223.9,223.9,0,500,0z"/>
                  </svg>
                </a>
                <a :href="AppShareLinks.email + videodata.id" target="_blank">
                  <svg viewBox="0 0 72 72">
                    <path fill="#e55a5a" d="M36,72 L36,72 C55.882251,72 72,55.882251 72,36 L72,36 C72,16.117749 55.882251,-3.65231026e-15 36,0 L36,0 C16.117749,3.65231026e-15 -2.4348735e-15,16.117749 0,36 L0,36 C2.4348735e-15,55.882251 16.117749,72 36,72 Z"/>
                    <path fill="#FFF" d="M18,26.1623226 L18,46.5476129 C18,47.6566452 18.8117419,48.5554839 19.9300645,48.5554839 L51.7447742,48.5554839 C52.8619355,48.5554839 53.6748387,47.6461935 53.6748387,46.5476129 L53.6748387,26.1623226 C53.6748387,24.9452903 52.947871,24 51.7447742,24 L19.9300645,24 C18.6805161,24 18,24.9685161 18,26.1623226 M20.9334194,27.9379355 C20.9334194,27.4467097 21.2307097,27.1656774 21.7056774,27.1656774 C21.9994839,27.1656774 33.560129,34.4910968 34.2603871,34.9207742 L36.0696774,36.0460645 C36.6433548,35.6616774 37.2193548,35.3330323 37.8139355,34.9347097 C39.0274839,34.1589677 49.8251613,27.1656774 50.1224516,27.1656774 C50.5985806,27.1656774 50.8947097,27.4467097 50.8947097,27.9379355 C50.8947097,28.4581935 49.8925161,28.9749677 49.239871,29.3732903 C45.1393548,31.8723871 41.04,34.5967742 36.980129,37.1887742 C36.7432258,37.3490323 36.2845161,37.6916129 35.9407742,37.6393548 C35.5575484,37.580129 23.7936774,30.0224516 21.6534194,28.7636129 C21.3317419,28.5743226 20.9334194,28.4012903 20.9334194,27.9379355"/>
                  </svg>
                </a>
              </div>
          </div>       
        </div>                
      </div>
    </div>
  </section>
  <vg-reported ref="reported" @closeModal="closeModal"></vg-reported>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import VgReported from "../modals/VgReported.vue";
import axios from 'axios';
import { useHead } from "@vueuse/head";

export default {

    components: { VgReported },

    created: function() {
      useHead({
        title: () => 'VGank :: ' + this.videodata.description,
        meta: [
          { name: 'description',content: () => this.AppData.translations.site_description},
          { property: "og:title", content: () => this.AppData.translations.site_title },
          { property: "og:url", content: () => this.AppUrl + 'video/' + this.videodata.id },
          { property: "og:description", content: () => this.AppUrl + 'video/' + this.videodata.id },
          { property: "og:image", content: () => this.AppData.translations.share_image_facebook },
          { name: 'twitter:title',content: () => this.AppData.translations.site_title },
          { name: 'twitter:description',content: () => this.AppUrl + 'video/' + this.videodata.id },
          { name: 'twitter:image',content: () => this.AppData.translations.share_image_twitter },
        ],
      })
    },  

    computed: {
      ...mapGetters(['AppLoaded', 'AppVideos', 'AppData', 'AppFilters', 'AppUntagged', 'AppUser', 'AppApi', 'AppReported', 'AppShareLinks', 'AppUrl']),

      videodata: function(){
        var _video = false;

        this.AppVideos.some((video) => {
            if(video.id == this.$route.params.id) {
                _video = video;
            } 
        });

        if(!_video) {
           this.AppUntagged.some((video) => {             
              if(video.id == this.$route.params.id) {
                  _video = video;
              } 
          });
        }

        return _video;
      },

      videourl: function(){
        let url = 'http://www.youtube.com/embed/';
        let autoplay = 'autoplay=1';
        let mute = '&mute=1';
        let origin = '&origin=' + window.location.origin;
        let mb = '&modestbranding=1';
        let showinfo = '&showinfo=0';
        let rel = '&rel=0';
        let controls = '&controls=1';

        return url + this.videodata.youtube_id + '?' + autoplay + mute + mb + showinfo + rel + controls + origin;
      },

      videoChamps: function(){
            const self = this;
            let champdata = [];

            if(!this.videodata.champion) return false;

            this.videodata.champion.some((videochamp) => {
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

          if(!this.videodata.rank) return false;

            this.videodata.rank.some((videorank) => {
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

          if(!this.videodata.position) return false;

            this.videodata.position.some((videoposition) => {
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

          if(!this.videodata.tags) return false;

            this.videodata.tags.some((videotag) => {
              self.AppData.tags.some((tag) => {
                  if(tag.id == videotag) {
                      tagdata.push({id:tag.id, name:tag.name});
                  }
              });
          });

          return tagdata;
      },

      videoChannel: function(){
        const self = this;
          let channeldata = [];

          this.AppData.channels.some((channel) => {
            if(channel.name == self.videodata.channel) {
                channeldata = channel;
            }
          });

          return channeldata;
      },

      hasFilters: function(){

          let bool = false;

          if(this.AppFilters.champion ||
              this.AppFilters.rank ||
              this.AppFilters.position ||
              this.AppFilters.channel ||
              this.AppFilters.tag ||
              this.AppFilters.text) {
                  bool = true;
          }

          return bool;
      },

      videofavorite: function(){
          let fav = false;
          if(this.AppUser) {
              if(this.AppUser.favs) {
                  if(this.AppUser.favs.indexOf(this.videodata.id) > -1) fav = true;
              }                 
          }           
          return fav;
      },

      videoseen: function(){
          let seen = false;

          if(this.AppUser) {
              if(this.AppUser.seen) {
                  if(this.AppUser.seen.indexOf(this.videodata.id) > -1) seen = true;
              }                 
          }           
          return seen;
      },

      videoReported: function() {
            let reported = false;
            const self = this;

            if(this.AppUser) {
                if(this.AppReported) {                   
                    this.AppReported.some((vid) => {

                        console.log(vid.id, self.videodata.id);
                       if(vid.id == self.videodata.id) {
                        reported = true;
                       }
                    });
                }
            }

            return reported;
        }
    },

    methods: {
      ...mapActions(['updateUserFavs', 'updateUserSeen']),

       bookmarkVideo: async function() {

            if(this.disabled) return;
            this.disabled = true;

            let type = 'add';
            if(this.$refs.savebt.classList.contains('remove')) type = 'remove';            
            this.updateUserFavs({vid: this.videodata.id, type:type});

            await axios.post(this.AppApi.updateuserfavorites, { 
                vid: this.videodata.id,
                uid: this.AppUser.ID,
                type: type
            });

            this.disabled = false;
        },

        updateSeenVideo: async function(){
            if(this.disabled) return;
            this.disabled = true;

            let response = await axios.post(this.AppApi.updateVideoSeen, { 
                vid: this.videodata.id,
                uid: this.AppUser.ID,
                type: this.videoseen
            });

            this.updateUserSeen(response.data.seen);
            this.disabled = false;
        },

        reportVideo: async function(){
          console.log('REPORT VIDEO', this.videodata.id, this.AppUser.ID);

          let report = await axios.post(this.AppApi.setReported, { 
              vid: this.videodata.id,
              uid: this.AppUser.ID
          });

          this.$refs.reported.$el.classList.add('modal', 'show', report.data.status);
        },

         closeModal: function(){
          this.$refs.reported.$el.classList.remove('show');
        },

        toggleShare: function(){
          let icons = this.$refs.shareicons;

          if(icons.classList.contains('show')) {
            icons.classList.remove('show');
          } else {
            icons.classList.add('show');
          }
        }
    },

    watch: {
      AppVideos() {
         if(!this.videodata) this.$router.push('/');
      }
    }

}
</script>