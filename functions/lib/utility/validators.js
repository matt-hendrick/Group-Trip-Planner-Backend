"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginData = exports.validateSignupData = exports.isEmpty = exports.isEmail = void 0;
const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx))
        return true;
    else
        return false;
};
exports.isEmail = isEmail;
const isEmpty = (string) => {
    if (string.trim() === '')
        return true;
    else
        return false;
};
exports.isEmpty = isEmpty;
const validateSignupData = (data) => {
    let errors = {};
    if (exports.isEmpty(data.email)) {
        errors.email = 'Must not be empty';
    }
    else if (!exports.isEmail(data.email)) {
        errors.email = 'Must be a valid email address';
    }
    if (exports.isEmpty(data.password))
        errors.password = 'Must not be empty';
    if (exports.isEmpty(data.confirmPassword))
        errors.confirmPassword = 'Must not be empty';
    if (data.password !== data.confirmPassword)
        errors.confirmPassword = 'Passwords must match';
    if (exports.isEmpty(data.handle))
        errors.handle = 'Must not be empty';
    return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};
exports.validateSignupData = validateSignupData;
const validateLoginData = (data) => {
    let errors = {};
    if (exports.isEmpty(data.email))
        errors.email = 'Must not be empty';
    if (exports.isEmpty(data.password))
        errors.password = 'Must not be empty';
    return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};
exports.validateLoginData = validateLoginData;
//# sourceMappingURL=validators.js.map