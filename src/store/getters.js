const getters = {
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    tableHeight:state=>state.setting.tableHeight
};
export default getters;
