function validator(reg, text, value, cb) {
    if (value) {
        reg.test(value) ? cb() : cb(text);
    } else {
        cb()
    }
}
//电话
export function regPhone(rule, value, cb) {
    const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    validator(reg, '请输入正确的手机号码', value, cb)
}
// 固定电话
export function regTelephone(rule, value, cb) {
    const reg = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d)|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d))$)/;
    validator(reg, '请输入正确的固定电话', value, cb)
}
//银行卡
export function regBankCard(rule, value, cb) {
    const reg = /^([1-9]{1})(\d{14}|\d{18})$/;
    validator(reg, '请输入正确的银行账号', value, cb)
}
//身份证
export function regIdCard(rule, value, cb) {
    const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    validator(reg, '请输入正确的身份证号码', value, cb)
}
//邮政编码
export function regPostcode(rule, value, cb) {
    const reg = /^[1-9]\d{5}(?!\d)$/
    validator(reg, '请输入正确的邮政编码', value, cb)
}

//数字
export function regNumber(rule, value, cb) {
    const reg = /^[1-9]\d*$/
    validator(reg, '只能输入数字', value, cb)
}
//数字或者大小写字母
export function regW(rule, value, cb) {
    const reg = /^[A-Za-z0-9]+$/
    validator(reg, '只能输入数字或者大小写字母', value, cb)
}
//邮箱
export function regEmail(rule, value, cb) {
    const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    validator(reg, '请输入正确的邮箱', value, cb)
}
//域名
export function regWww(rule, value, cb) {
    const reg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/
    validator(reg, '请输入正确的域名', value, cb)
}
// 正整数
export function regPositiveNumber(rule, value, cb) {
    const reg = /^[+]{0,1}(\d+)$/
    validator(reg, '请输入正整数', value, cb)
}
// 正整数
export function discountRules(rule, value, cb) {
    const reg = /^(\d{1,2}(\.\d{1,2})?|100|100.00)%$|$/
        // const reg = /^(\d{1,2}(\.\d{1,2})?|100)$/
    validator(reg, '请输入0到100或者是小数点后两位', value, cb)
}