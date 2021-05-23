export default {
    bind(el, binding, vnode) {
        el.addEventListener('keypress', function(e) {
            e = e || window.event;
            let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
            if (charcode === 13) {
                console.log(el, binding, vnode, 'ttt');
                console.log(vnode.context.$refs[binding.value]);
            }
        });
    }
};
