export default {
    inserted: function(el) {
        el.addEventListener('keypress', function(e) {
            e = e || window.event;
            let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
            let values = e.target.value;
            let re = /\d/;
            if (charcode == 46) {
                if (values.includes('.')) {
                    e.preventDefault();
                }
                return;
            } else if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }
        });
    }
};
