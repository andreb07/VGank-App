<template>
    <div class="actions">
        <!--<div v-if="Appuser">
            <ion-icon v-if="AppUser.istagger && AppListType == 'untagged'" color="danger" :icon="trashOutline" @click="deleteVideo()"></ion-icon>
        </div> -->               
        <ion-icon v-if="AppListType != 'untagged'" :class="data.isFav ? 'remove' : 'add'" :icon="data.isFav ? bookmark : bookmarkOutline" :color="data.isFav ? 'warning' : ''" @click="bookmarkVideo($event)"></ion-icon> 
        <ion-icon v-if="AppListType != 'untagged'" :class="data.isLiked ? 'remove' : 'add'" :icon="data.isLiked ? thumbsUp : thumbsUpOutline" :color="data.isLiked ? 'warning' : ''" @click="likeVideo($event)"></ion-icon> 
        <ion-badge v-if="AppListType != 'untagged'" color="medium">{{data.likes ? data.likes : 0}}</ion-badge> 
    </div>  
</template>

<script>

import { IonIcon, IonBadge, alertController, toastController} from '@ionic/vue';
import { trashOutline, thumbsUpOutline, bookmarkOutline, bookmark, thumbsUp } from 'ionicons/icons';
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
    name: 'VideoActions',

    props: { data: Object },

    data() {
      return {
        disabled: false
      }
    }, 

    components: { IonIcon, IonBadge },

    computed: {
        ...mapGetters(['AppUser', 'AppListType']),
    },

    created: function(){

    },

    setup() {
        return { trashOutline, thumbsUpOutline, bookmarkOutline, bookmark, thumbsUp}
    },

    methods: {
        ...mapActions(['updateUserFavs', 'removeVideo', 'updateUntagged', 'updateVideoLikes']),

        bookmarkVideo: async function(e) {

            if(this.disabled) return;
            this.disabled = true;

            let type = 'add';
            if(e.target.classList.contains('remove')) type = 'remove';

            this.updateUserFavs({vid: this.data.id, type:type});

            const response = await axios.post('http://abworks.synology.me/mediaorg/wp-json/morg/v1/updateuserfavorites/', { 
                vid: this.data.id,
                uid: this.AppUser.ID,
                type: type
            });

            if(response) {
                this.disabled = false;
                this.openToast({type:'favorites', action:type});
            }     
        },

        deleteVideo: async function(){

                if(this.disabled) return;
                this.disabled = true;

                const alert = await alertController
                    .create({
                        header: 'Confirm deletion!',
                        message: 'Are you sure you want to delete the selected video?',
                        buttons: [{
                            text: 'Yes, delete!',
                            role: 'delete'
                        }],
                    });

                await alert.present();
                const { role } = await alert.onDidDismiss();

                if(role == 'delete') {
                    const response = await axios.post('http://abworks.synology.me/mediaorg/wp-json/morg/v1/draftvideo/', { 
                        vid: this.data.id
                    });

                    if(response) {
                        this.removeVideo(this.data.id);
                        this.disabled = false;
                        this.openToast({type:'delete'});
                    }                
                }
            
        },

        likeVideo: async function(e) {

            if(this.disabled) return;
            this.disabled = true;

            let type = 'add';
            if(e.target.classList.contains('remove')) type = 'remove';

            this.updateVideoLikes({vid: this.data.id, type:type});

            const response = await axios.post('http://abworks.synology.me/mediaorg/wp-json/morg/v1/addvideolike/', { 
                vid: this.data.id,
                uid: this.AppUser.ID,
                type: type
            });             

            if(response) {               
                this.disabled = false;
            }     
        },

        async openToast(data) {

            let message,icon;

            switch(data.type) {
                case 'favorites':
                        message = 'Video saved sucessfully!';
                        icon = bookmarkOutline;

                        if(data.action == 'remove') {
                            message = 'Video removed sucessfully';
                        } 
                break;

                case 'delete':
                        message = 'Video deleted sucessfully!';
                        icon = trashOutline;
                    break;
            }

            const toast = await toastController
                .create({
                    message: message,
                    duration: 3000,
                    color: 'medium',
                    icon: icon
                })
            return toast.present();
        },
    }

}
</script>

<style scoped>
    .actions {
        display: flex;
        padding: 30px 0 0 0;
        align-items: center;
        justify-content: flex-start;
    }

    ion-icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }

    ion-badge {
        font-size: 11px;
        height: 16px;
    }
</style>