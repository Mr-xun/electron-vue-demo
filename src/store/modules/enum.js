import db from '@/utils/localstorage';

export default {
    namespaced: true,
    state: {
        medicareType: db.get('MEDICARE_TYPE',[]), //医保类型
        reimbursementType: db.get('REIMBURSEMENT_TYPE',[]), //报销类型
        prescriptionType: db.get('PRESCRIPTION_TYPE',[]), //处方药类型
        carfts: db.get('CARFTS',[]), //工艺
        units: db.get('UNITS',[]), //单位
        urgent: db.get('UGRENT',[]), //紧急度
        classifies: db.get('CLASSIFIES',[]), //工艺
        orgType: db.get('ORG_TYPE',[]), //机构类型
        drugNotes: db.get('DRUGNOTES',[]), //商品备注
        incompatibilities: db.get('INCOMPATIBILITIES',[]), //配伍禁忌规则
        refuseSendReason:db.get('REFUSESENDREASON',[])//拒送理由
    },
    mutations: {
        setMedicareType(state, val) {
            db.save('MEDICARE_TYPE', val);
            state.medicareType = val;
        },
        setReimbursementType(state, val) {
            db.save('REIMBURSEMENT_TYPE', val);
            state.reimbursementType = val;
        },
        setPrescriptionType(state, val) {
            db.save('PRESCRIPTION_TYPE', val);
            state.prescriptionType = val;
        },
        setCrafts(state, val) {
            db.save('CARFTS', val);
            state.carfts = val;
        },
        setUnits(state, val) {
            db.save('UNITS', val);
            state.units = val;
        },
        setUrgent(state, val) {
            db.save('UGRENT', val);
            state.urgent = val;
        },
        setClassifies(state, val) {
            db.save('CLASSIFIES', val);
            state.classifies = val;
        },
        setOrgType(state, val) {
            db.save('ORG_TYPE', val);
            state.orgType = val;
        },
        setDrugNotes(state, val) {
            db.save('DRUGNOTES', val);
            state.drugNotes = val;
        },
        setIncompatibility(state, val) {
            db.save('INCOMPATIBILITIES', val);
            state.incompatibilities = val;
        },
        setRefuseSendReason(state, val){
            db.save('REFUSESENDREASON', val);
            state.refuseSendReason = val;
        }
    }
};
