<template>
  <section id="vg-refresh">
    <vg-loading></vg-loading>
  </section>
</template>

<script>
import VgLoading from "../components/VgLoading.vue";
import {mapGetters, mapActions} from 'vuex';
import axios from 'axios';

export default {

    components: { VgLoading },

    mounted: function() {
        document.addEventListener('touchstart', this.onSwipeStart.bind(this));
        document.addEventListener('touchend', this.onSwipeEnd.bind(this));
        document.addEventListener('touchmove', this.onTouchMove.bind(this));
    },

    data() {
        return {
            sEnabled: true,
            sStart: { x:0,y:0 },
            sStop: { x:0,y:0 },
            sScrollSize: 80,
            sSmoother: 2,
            isRefreshing: false
        };
    },

    computed: {
        ...mapGetters(['AppQuery', 'AppFilters', 'AppApi']),
    },

    methods: {

        ...mapActions(['updateVideos', 'updateQuery']),

        onTouchMove: function(e){
            if(!this.sEnabled || this.isRefreshing) return;

            let changedTouches = e.changedTouches[0];
            let changeY = 0;

            if(changedTouches) {
                changeY = this.sStart.y - changedTouches.screenY;
            } else {
                changeY = this.sStart.y - e.screenY.screenY;
            }

            if(changeY > 0) return;

            let vgvideos = document.getElementById('vg-videos');
            let vgrefresh = document.getElementById('vg-refresh');

            if(Math.abs(changeY) > this.sScrollSize) {
                8
                vgvideos.classList.add('moving');
                this.refresh();
            } else {
                let move = (changeY * -1) - this.sSmoother;
                vgvideos.classList.remove('moving');
                vgvideos.style.transform = "translate(0," + move + "px)";
                vgrefresh.classList.add('show');
                this.sSmoother += .3;
            }           
        },

        onSwipeStart: function(e){     
            if(this.isRefreshing) return;

            let vgvideos = document.getElementById('vg-videos');
            
            if(vgvideos.getBoundingClientRect().top < 60){
                this.sEnabled = false;
            } else { this.sEnabled = true; }

            let changedTouches = e.changedTouches[0];

            if(changedTouches) {
                this.sStart.x = changedTouches.screenX;
                this.sStart.y = changedTouches.screenY;
            } else {
                this.sStart.x = e.screenX;
                this.sStart.y = e.screenY;
            }
        },

        onSwipeEnd: function(e){
           if(!this.sEnabled || this.isRefreshing) return;

            let changedTouches = e.changedTouches[0];
            if(changedTouches) {
                this.sStop.x = changedTouches.screenX;
                this.sStop.y = changedTouches.screenY;
            } else {
                this.sStop.x = e.screenX;
                this.sStop.y = e.screenY;
            }

            this.onFinishSwipe();
        },

        onFinishSwipe: function(){
            if(this.isRefreshing) return;

            let vgvideos = document.getElementById('vg-videos');
            let vgrefresh = document.getElementById('vg-refresh');

            vgvideos.classList.add('moving');
            vgvideos.style.transform = "translate(0,0px)";
            vgrefresh.classList.remove('show');
            this.sSmoother = 2;
        },

        refresh: async function(){
            if(this.isRefreshing) return;
            this.isRefreshing = true;

            document.body.classList.add('locked');
            console.log('DOING REFRESH');

            this.updateQuery({page: 0,filters: this.AppFilters});
            if(this.$route.name == 'Video') this.$router.push('/');

            const response = await axios.post(this.AppApi.getVideos, this.AppQuery);
            this.updateVideos(response);   

            let view = this;
            setTimeout(function(){
                window.scrollTo(0, 0); 
                view.isRefreshing = false;
                view.onFinishSwipe();     
                document.body.classList.remove('locked'); 
            }, 1000);                 
        }
    }

}
</script>