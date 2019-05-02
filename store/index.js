import Vuex from 'vuex'
import axios from 'axios'
import Cookie from 'js-cookie'

export const state = () =>({
    token:null,
    user:{}
})

export const mutations = {
    setToken(state,token){
        state.token = token;
    },
    setUser(state,user){
        state.user = user;
    }
}

export const actions = {
    authenticate(vueContext,authData){
        axios.post('http://localhost:8000/api/login',{
            user_name : authData.user_name,
            password : authData.password
        }).then(result => {
            vueContext.commit('setToken',result.data.token);
            localStorage.setItem('token',result.data.token);
            Cookie.set('jwt',result.data.token);

            axios.get('http://localhost:8000/api/user',{headers:{'Authorization':'Bearer ' + result.data.token}})
            .then(user =>{
                vueContext.commit('setUser',user.data);
                localStorage.setItem('user',user.data);
                Cookie.set('user',user.data);
            });
        }).catch(e =>{
            console.log(e);
        });

        

    }
}

export const getters = {
    isAuthenticated(state){
        return state.token != null;
    }
}
