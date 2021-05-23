import db from '@/utils/localstorage';
import { SAVE_ORNARCHIVES,SAVE_DRUGINFARCHIVES } from '../mutation-types';
import api from '@/api';
const state = {
    orgArchives: db.get('ORG_ARCHIVES',[]), //机构档案
    drugInfArchives: db.get('DRUGINF_ARCHIVES',[]) //商品档案
};
const mutations = {
    SAVE_ORNARCHIVES: (state, data) => {
        db.save('ORG_ARCHIVES', data);
        state.orgArchives = data;
    },
    SAVE_DRUGINFARCHIVES: (state, data) => {
        db.save('DRUGINF_ARCHIVES', data);
        state.drugInfArchives = data;
    }
};
const getters = {
    orgArchives: state => state.orgArchives,
    drugInfArchives: state => state.drugInfArchives

};
const actions = {
    async setOrgArchives({ commit }){
        let r = await api.basic_baseOrg_all();
        commit(SAVE_ORNARCHIVES, r.data.result || []);
    },
    async setDrugInfArchives({ commit }){
        let r = await api.basic_baseDrugInf_all();
        commit(SAVE_DRUGINFARCHIVES, r.data.result || []);
    }

};
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
