"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.admin = void 0;
const admin = require("firebase-admin");
exports.admin = admin;
admin.initializeApp();
const db = admin.firestore();
exports.db = db;
//# sourceMappingURL=admin.js.map