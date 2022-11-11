import { createStore } from 'vuex';
import axios from 'axios';
import { Storage } from '@capacitor/storage';


const api = 'https://jungle.vgank.net/wp-json/vgank/';
const siteurl = 'https://vgank.net/';

const store = createStore({
    state() {
        return {
            siteurl: siteurl,
            loaded: false,
            videos: [],
            favorites: [],
            untagged: [],
            reported: [],
            query: {
                page: 0,
                total: null,
                filters: {
                    champion:null,
                    rank:null,
                    position:null,
                    channel: null,
                    tag: null,
                    text: null
                }
            },

            shareLinks: {
                whatsapp: 'https://api.whatsapp.com/send/?text=',
                facebook: 'https://www.facebook.com/sharer.php?u=',
                twitter: 'https://twitter.com/share?url=', 
                email: 'mailto:?subject=VGank Video&body=',
            },

            data: {
                champions: [],
                ranks: [],
                positions: [],
                channels: [],
                tags: [],
                translations: {}
            },

            api: {
                initialData: api + 'initialdata',
                getVideos: api + 'getvideos',
                getspecificvideo: api + 'getspecificvideo',
                getUntagged: api + 'getuntagged',
                getReported: api + 'getreported',
                userLogin: api + 'login',
                userRegister: api + 'register',
                getFavorites: api + 'getfavorites',
                updateuserfavorites: api + 'updateuserfavorites',
                deleteVideo: api + 'deletevideo',
                updateVideo: api + 'updatevideo',
                setReported: api + 'setreported',
                removeReported: api + 'removereported',
                updateVideoSeen: api + 'updateVideoSeen',
                addTag: api + 'addtag'                
            },
           
            filters: {
                champion: null,
                rank: null,
                position:null,
                channel: null,
                tag: null,
                text: null
            },

            user: null,

            editingModal: false
        }
    },
    
    getters: {
        AppApi(state) { return state.api; },
        AppData(state) { return state.data; },
        AppFilters(state) {return state.filters; },
        AppUser(state) { return state.user; },
        AppQuery(state) { return state.query; },
        AppVideos(state) { return state.videos; },
        AppUntagged(state) { return state.untagged; },
        AppReported(state) { return state.reported; },
        AppFavorites(state) { return state.favorites; },
        AppLoaded(state) { return state.loaded; },
        AppEditingModal(state) { return state.editingModal; },
        AppShareLinks(state) { return state.shareLinks; },
        AppUrl(state) { return state.siteurl; },
    },

    actions: {

        async getVideos({commit}) {
            const videos = await axios.get(this.getters.AppApi.getVideos);
            commit('setVideoList', videos);
        },

        async setCurrentUser({commit},userdata) {
            commit('setUserData', userdata);
        },

        async fecthInitialData({commit}) {

            console.log('##### FETCH INITIAL DATA');

            const data = await axios.get(this.getters.AppApi.initialData);
            commit('setInitallData', data.data);
            
            const videos = await axios.post(this.getters.AppApi.getVideos);
            commit('setVideoList', videos);
        },

        async getReportedVideos({commit}) {
            if(this.getters.AppUser) {

                console.log('###### GET REPORTED VIDEOS FROM USER ####', this.getters.AppUser);

                let uid = null;
                if(this.getters.AppUser.istagger) {
                    uid = this.getters.AppUser.ID;
                }
                let reported = await axios.post(this.getters.AppApi.getReported, {uid:uid});
                console.log(reported);
                commit('setReportedList', reported.data.videos);
            }
            
        },

        getUserData: async function({commit}){

            const currentUser = await Storage.get({ key: 'currentuser' });
            const currentUserData = JSON.parse(currentUser.value);

            if(currentUser.value) {
                console.log('##### USER FOUND IN STORAGE. GET DATA FROM DB');
                const currentUserResponse = await axios.post(this.getters.AppApi.userLogin, { 
                    email:currentUserData.email, 
                    password:currentUserData.password 
                });

                if(!currentUserResponse.data.userdata.errors) {
                    console.log('##### GOT USER FROM DB');
                    console.log(currentUserResponse.data);
                    commit('setUserData', currentUserResponse.data);
                } else {
                    console.log('##### USER LOGIN ERROR');
                    console.log(currentUserResponse.data.userdata.errors);
                    Storage.remove({ key: 'currentuser' });
                }
            } else {
               console.log('##### USER NOT FOUND IN STORAGE')
            }
        },

        updateFilters({commit}, filters) { commit('updateFilters', filters); },
        resetFilters({commit}) { commit('resetFilters'); },
        updateUserFavs: function({commit}, data){ commit('updateUserFavs', data); },
        updateUserSeen: function({commit}, data){ commit('updateUserSeen', data); },        
        updateVideo: function({commit}, data) { commit('updateVideo', data); },
        removeVideo: function({commit}, data){ commit('removeVideo', data); },
        removeReportedVideo: function({commit}, data){ commit('removeReportedVideo', data); },
        addReportedVideo: function({commit}, data){ commit('addReportedVideo', data); },        
        updateTags: function({commit}, data) { commit('updateTags', data); },
        addVideos: function({commit}, data) { commit('addVideos', data); },
        updatePage: function({commit}, data) { commit('updatePage', data); },
        updateQuery: function({commit}, data) { commit('updateQuery', data); },
        updateVideos: function({commit}, data) { commit('setVideoList', data); },
        updateLoaded: function({commit}, data) { commit('updateLoaded', data); },
        setFavoritesList: function({commit}, data) { commit('setFavoritesList', data); },
        setUntaggedList: function({commit}, data) { commit('setUntaggedList', data); },
        setReportedList: function({commit}, data) { commit('setReportedList', data); },
        setUntaggedVideoInfo: function({commit}, data) { commit('setUntaggedVideoInfo', data); },
        addVideoToEdit: function({commit}, data) { commit('addVideoToEdit', data); },
        changeEditingModal: function({commit}, data) { commit('changeEditingModal', data); }
    },

    mutations: {

        updateLoaded: function(state, data){
            state.loaded = data;
        },

        updateQuery: function(state, data) {
            //console.log('##### SAVE QUERY');               
            state.query.filters = JSON.parse(JSON.stringify(data.filters));
            state.query.page = data.page;
        },

        updatePage: function(state, page){
            state.query.page = page;
        },

        setVideoList(state, props) {
            //console.log('##### SET VIDEO LIST');
            //console.log(props);
            state.videos = props.data.videos;
            state.query.total = props.data.totalpages;
        },

        setFavoritesList(state, videos) {   
            state.favorites = videos;
        },

        setUntaggedList(state, videos) {   
            state.untagged = videos;
        },

        setReportedList(state, videos) {   
            state.reported = videos;
            console.log('#### SET REPORTED LIST ####', videos);
        },

        addVideos: function(state, videos) {
            //console.log('##### ADD NEW VIDEOS');
            let newlist = state.videos.concat(videos);
            state.videos = newlist;
        },

        setInitallData(state, props) {
            state.data.champions = props.champions;
            state.data.ranks = props.ranks;
            state.data.positions = props.positions;
            state.data.copy = props.copy;
            state.data.channels = props.channels;
            state.data.tags = props.tags;
            state.data.translations = props.translations;

            state.query.list = props.videos;
            state.query.total = props.pages;

            //console.log('##### GOT INITAL DATA');
            //console.log(state.data);
        },

        setUserData(state, props) {

            if(!props) {
                state.user = null;
                console.log('##### SET USER DATA TO NULL');
                return;
            }
            state.user = props.userdata.data;
            state.user.favs = props.userfavs;
            state.user.istagger = props.istagger;
            state.user.isadmin = props.isadmin;
            state.user.seen = props.userseen;
            
            //console.log('##### SET USER DATA');
            //console.log(state.user);
        },

        updateFilters(state, data) {

            //console.log('##### UPDATE FILTERS');
            //console.log(data);

            switch(data.type) {
                case 'mainChamp':
                    state.user.champs[0] = data.val;
                    state.vars.champsChanged = true;
                break;
                case 'secondaryChamp':
                    state.user.champs[1] = data.val;
                    state.vars.champsChanged = true;
                break;
                case 'champions': state.filters.champion = data.val;
                    break;
                case 'ranks': state.filters.rank = data.val;
                    break;
                case 'positions': state.filters.position = data.val;
                    break;
                case 'channels': state.filters.channel = data.val;
                    break;
                case 'tags': state.filters.tag = data.val;
                    break;
                case 'text': state.filters.text = data.val;
                    break;
            }
        },

        resetFilters(state) {
            state.filters.champion = null;
            state.filters.rank = null;
            state.filters.position = null;
            state.filters.channel = null;
            state.filters.tag = null;
            state.filters.text = null;
        },

        updateListType(state, type) {            
            state.listType = type;
            console.log('##### LIST TYPE UPDATED: ' + state.listType);
        },

        updateUserFavs: function(state, data) {

            switch(data.type) {
                case 'add':
                    state.user.favs.push(data.vid);
                break;
                case 'remove':
                    var idx1 = state.user.favs.indexOf(data.vid);                    
                    state.user.favs.splice(idx1,1);

                    if(state.favorites) {
                        var idx2 = -1;
                        state.favorites.some((video, idx) => {
                            console.log(video.id, data.vid, idx);
                            if(video.id == data.vid) idx2 = idx;
                        });
                        state.favorites.splice(idx2,1);
                    }
                break;
            }
            
            console.log('##### UPDATED USER FAVS');
        },

        updateUserSeen: function(state, data) {
            console.log('###### updateUserSeen', data);
            state.user.seen = data;
        },

        updateVideo: function(state, data) {
            state.data.videos.some((video) => {  
                if(video.id == data.vid) {
                    video[data.type] = data.val;
                }
            });
        },

        removeVideo: function(state, data) {
            state.untagged.some((video, idx) => {  
                if(video.id == data) {
                    state.untagged.splice(idx, 1);
                }
            });
        },

        removeReportedVideo: function(state, data) {
            state.reported.some((video, idx) => {  
                if(video.id == data) {
                    state.reported.splice(idx, 1);
                }
            });
        },

        addReportedVideo: function(state, data) {
            state.reported.push(data);
        },

        updateTags: function(state, data) {
            console.log('##### UPDATE TAGS', data);
            state.data.tags = data;
        },

        setUntaggedVideoInfo: function(state, data) {

            var videolist = null;
            if(data.vidtype == 'untagged') videolist = state.untagged;
            if(data.vidtype == 'tagged') videolist = state.videos;

            if(!videolist) return;

            videolist.some((video) => {                    
                if(video.id == data.vid) {
                    var exists = false;
                    switch(data.type) {
                        case 'champions':
                            if(!video.champion) video.champion = [];                            
                            
                            if(!data.value)  {
                                video.champion = []; 
                                return;
                            }

                            video.champion.some((champ, idx) => {
                                if(champ == data.value) {
                                   exists = true;
                                   video.champion.splice(idx, 1);
                                } 
                            });
                            if(!exists) video.champion.push(data.value);                             
                        break;
                        case 'ranks':
                            if(!video.rank) video.rank = [];
                            
                            if(!data.value)  {
                                video.rank = []; 
                                return;
                            }

                            video.rank.some((rank, idx) => {
                                if(rank == data.value) {
                                   exists = true;
                                   video.rank.splice(idx, 1);
                                } 
                            });
                            if(!exists) video.rank.push(data.value);                             
                        break;
                        case 'positions':
                            if(!video.position) video.position = [];

                            if(!data.value)  {
                                video.position = []; 
                                return;
                            }

                            video.position.some((position, idx) => {
                                if(position == data.value) {
                                   exists = true;
                                   video.position.splice(idx, 1);
                                } 
                            });
                            if(!exists) video.position.push(data.value);                             
                        break;
                        case 'tags':
                            if(!video.tags) video.tags = [];

                            if(!data.value)  {
                                video.tags = []; 
                                return;
                            }

                            video.tags.some((tags, idx) => {
                                if(tags == data.value) {
                                   exists = true;
                                   video.tags.splice(idx, 1);
                                } 
                            });
                            if(!exists) video.tags.push(data.value);                             
                        break;
                       
                    }
                }
            });
        },

        addVideoToEdit: function(state, data){
            state.untagged.push(data);
        },

        changeEditingModal: function(state, data){
            state.editingModal = data;
        }

    }
});

export default store;