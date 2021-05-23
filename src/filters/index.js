/* eslint-disable camelcase */
// import parseTime, formatTime and set to filter
import store from '@/store';
export { parseTime, formatTime } from '@/utils';

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
    if (time === 1) {
        return time + label;
    }
    return time + label + 's';
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
    const between = Date.now() / 1000 - Number(time);
    if (between < 3600) {
        return pluralize(~~(between / 60), ' minute');
    } else if (between < 86400) {
        return pluralize(~~(between / 3600), ' hour');
    } else {
        return pluralize(~~(between / 86400), ' day');
    }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
    const si = [
        { value: 1E18, symbol: 'E' },
        { value: 1E15, symbol: 'P' },
        { value: 1E12, symbol: 'T' },
        { value: 1E9, symbol: 'G' },
        { value: 1E6, symbol: 'M' },
        { value: 1E3, symbol: 'k' }
    ];
    for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol;
        }
    }
    return num.toString();
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
    return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
/**
 * filter yes or no 过滤是否
 */
export function flYesOrNo(val) {
    let map = {
        1: '是',
        2: '否'
    };
    if (!val) return '--';
    return map[Number(val)];
}
/**
 * filter sex 性别
 */
export function flSex(val) {
    let map = {
        1: '男',
        2: '女'
    };
    if (!val) return '--';
    return map[Number(val)];
}
/**
 * filter clinc or ward 过滤门诊或病房
 */
export function flClincOrWard(val) {
    let map = {
        1: '病房',
        2: '门诊'
    };
    if (!val) return '--';
    return map[Number(val)];
}
/**
 * filter satus 状态
 */
export function flStatus(val) {
    let map = {
        1: '有效',
        2: '无效'
    };
    if (!val) return '--';
    return map[Number(val)];
}
/**
 * get prescription drug name(处方药标识)
 * @param {Number} value
 */
export function prescriptionName(value) {
    let marks = store.state.enum.prescriptionMark;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].enumId == value) {
            return marks[i].name;
        }
    }
    return '--';
}
/**
 * get deliveryType name(交货方式)
 * @param {Number} value
 */
export function flDeliveryType(value) {
    let marks = store.state.enum.deliveryType;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].enumId == value) {
            return marks[i].name;
        }
    }
    return '--';
}
/**
 * get orderWay name(下单方式)
 * @param {Number} value
 */
export function flOrderWay(value) {
    let marks = store.state.enum.orderWay;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].enumId == value) {
            return marks[i].name;
        }
    }
    return '--';
}
/**
 * get payManner name(支付方式)
 * @param {Number} value
 */
export function flPayManner(value) {
    let marks = store.state.enum.payManner;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].enumId == value) {
            return marks[i].name;
        }
    }
    return '--';
}
/**
 * get memberType name(会员类型)
 * @param {Number} value
 */
export function flMemberType(value) {
    let marks = store.state.enum.memberType;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].enumId == value) {
            return marks[i].name;
        }
    }
    return '--';
}
/**
 * get memberType name(医保类型)
 * @param {Number} value
 */
export function flMedicareType(value) {
    let marks = store.state.enum.medicareType;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].enumId == value) {
            return marks[i].name;
        }
    }
    return '--';
}/**
 * get reimbursementType name(报销类型)
 * @param {Number} value
 */
export function flReimbursementType(value) {
    let marks = store.state.enum.reimbursementType;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].enumId == value) {
            return marks[i].name;
        }
    }
    return '--';
}/**
 * get prescriptionType name(处方药类型)
 * @param {Number} value
 */
export function flPrescriptionType(value) {
    let marks = store.state.enum.prescriptionType;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].enumId == value) {
            return marks[i].name;
        }
    }
    return '--';
}/**
 * get carftName(工艺)
 * @param {Number} value
 */
export function flCarftName(value) {
    let marks = store.state.enum.carfts;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].enumId == value) {
            return marks[i].name;
        }
    }
    return '--';
}/**
 * get unitName(单位)
 * @param {Number} value
 */
export function flUnitName(value) {
    let marks = store.state.enum.units;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].enumId == value) {
            return marks[i].name;
        }
    }
    if (value) {
        return value;
    } else {
        return '--';
    }
}/**
 * get levelName(紧急度)
 * @param {Number} value
 */
export function flUrgentName(value) {
    let marks = store.state.enum.urgent;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].enumId == value) {
            return marks[i].name;
        }
    }
    return '--';
}/**
 * get classifyName (分类)
 * @param {Number} value
 */
export function flClassifyName(value) {
    let marks = store.state.enum.classifies;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].enumId == value) {
            return marks[i].name;
        }
    }
    return '--';
}/**
 * get orgType name(机构类型)
 * @param {Number} value
 */
export function flOrgType(value) {
    let marks = store.state.enum.orgType;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].enumId == value) {
            return marks[i].name;
        }
    }
    return '--';
}/**
 * get drugNote(商品备注)
 * @param {Number} value
 */
export function flDrugNote(value) {
    let marks = store.state.enum.drugNotes;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].enumId == value) {
            return marks[i].name;
        }
    }
    return '--';
}
/**
 * get drugNote(配伍规则)
 * @param {Number} value
 */
export function flIncompatibility(value) {
    let marks = store.state.enum.incompatibilities;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].code == value) {
            return marks[i].name;
        }
    }
    return '--';
}
/**
 * get orgType(机构名称)
 * @param {Number} value
 */
export function flOrgName(value) {
    let marks = store.state.basic.orgArchives;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].id == value) {
            return marks[i].name;
        }
    }
    return '--';
}/**
 * get DrugInfName(商品名称)
 * @param {Number} value
 */
export function flDrugInfName(value) {
    let marks = store.state.basic.drugInfArchives;
    for (let i = 0; i < marks.length; i++) {
        if (marks[i].id == value) {
            return marks[i].name;
        }
    }
    return '--';
}
/**
 * get OrderStatusName(订单状态)
 * @param {Number} value
 */
export function flOrderStatusName(value) {
    let orderStatusMap = {
        0: '待提交',
        10: '待收费',
        11: '待审方',
        12: '待调剂',
        13: '调剂中',
        14: '待复核',
        15: '待称重',
        17: '包装称重完成',
        18: '待煎药',
        181: '煎药中',
        182: '煎药完成',
        19: '待加工',
        191: '加工中',
        192: '加工完成',
        20: '送货中',
        21: '待发药',
        22: '发药完成',
        90: '取消申请',
        91: '取消确认',
        92: '销毁申请',
        93: '销毁确认',
        94: '重发申请'
    };
    if (!value && value != 0) return '--';
    return orderStatusMap[Number(value)];
}
/**
 * get flMoney(人民币过滤两位数)
 * @param {Number} val
 */
export function flMoney(val) {
    if (val || val === 0) {
        return Number(val).toFixed(2);
    } else {
        return '--';
    }
}
/**
 * get OrderStatusName(送货人员状态)
 * @param {Number} value
 */
export function flDeliveryStatusName(value) {
    let map = {
        10: '签到',
        11: '送药返回',
        12: '解除脱岗',
        20: '签退',
        21: '送药中',
        22: '解除排队',
        23: '拒送'
    };
    if (!value && value != 0) return '--';
    return map[Number(value)];
}
/**
 * @description 格式化金额
 * @param number：要格式化的数字
 * @param decimals：保留几位小数 默认2位
 * @param decPoint：小数点符号 默认.
 * @param thousandsSep：千分位符号
 */
export const formatMoney = (number, decimals = 2, decPoint = '.', thousandsSep = ',') => {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    let n = !isFinite(+number) ? 0 : +number;
    let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep;
    let dec = (typeof decPoint === 'undefined') ? '.' : decPoint;
    let s = '';

    function toFixedFix(num, fixed) {
        var pos = num.toString().indexOf('.'),
            decimalPlaces = num.toString().length - pos - 1,
            _int = num * Math.pow(10, decimalPlaces),
            divisorOne = Math.pow(10, decimalPlaces - fixed),
            divisorTwo = Math.pow(10, fixed);
        return '' + Math.round(_int / divisorOne) / divisorTwo;
    }
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    let re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, '$1' + sep + '$2');
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
};
/**
 * dealAgeUnit(处理年龄单位重复)
 * @param {Number} value
 */
export function dealAgeUnit(str) {
    if (!str && str != 0) return '--';
    var outStr = str.replace(/岁/g, '');
    return outStr;
}

/**
 * @descript 手机号脱敏处理
 * @param {String} str 要进行隐藏的字符串
 */
export function encryptPhone(str) {
    if (null != str && str != undefined) {
        var pat = /(\d{3})\d*(\d{4})/;
        return str.replace(pat, '$1****$2');
    } else {
        return '';
    }
}
/**
 * @descript 身份证号脱敏处理
 * @param {String} str 要进行隐藏的字符串
 */
export function encryptIdNo(str) {
    if (null != str && str != undefined) {
        var pat = /(\d{4})\d*(\d{4})/;
        return str.replace(pat, '$1***********$2');
    } else {
        return '';
    }
}
/**
 * @descript 姓名脱敏处理
 * @param {String} str 要进行隐藏的字符串
 */
export function encryptName(str) {
    if (null != str && str != undefined) {
        if (str.length <= 3) {
            return '*' + str.substring(1, str.length);
        } else if (str.length > 3 && str.length <= 6) {
            return '**' + str.substring(2, str.length);
        } else if (str.length > 6) {
            return str.substring(0, 2) + '****' + str.substring(6, str.length);
        }
    } else {
        return '';
    }
}
/**
 * @descript 邮箱脱敏处理
 * @param {String} str 要进行隐藏的字符串
 */
export function noPassByEmail(email) {
    let new_email = email;
    if (String(email).indexOf('@') > 0) {
        let str = email.split('@');
        let _s = '';
        if (str[0].length > 3) { //@前面多于3位
            for (let i = 3; i < str[0].length; i++) {
                _s += '*';
            }
            new_email = str[0].substr(0, 3) + _s + '@' + str[1];
        } else { //@前面小于等于于3位
            for (let i = 1; i < str[0].length; i++) {
                _s += '*';
            }
            new_email = str[0].substr(0, 1) + _s + '@' + str[1];
        }
    }
    return new_email;
}
/**
 * @descript 自定义脱敏处理（对字符串进行打码）
 * @param {String} str 要进行隐藏的字符串
 * @param {Number} frontLen 前面需要保留几位
 * @param {Number} endLen 后面需要保留几位
 *
 */
export function hiddenStr(str, frontLen, endLen) {
    let len = str.length - frontLen - endLen;
    let sign = '';
    for (let i = 0; i < len; i++) {
        sign += '*';
    }
    return str.substring(0, frontLen) + sign + str.substring(str.length - endLen);
}
