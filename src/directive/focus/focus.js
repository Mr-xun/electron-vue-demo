export default {
    bind: function(el) {
        if (el.children && el.children.length) {
            el.children[0].focus();
        } else {
            el.focus();
        }
    },
    updated: function(el) {
        if (el.children && el.children.length) {
            el.children[0].focus();
        } else {
            el.focus();
        }
    },
    inserted: function(el) {
        if (el.children && el.children.length) {
            el.children[0].focus();
        } else {
            el.focus();
        }
    }
};
