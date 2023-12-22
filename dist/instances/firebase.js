"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.app = void 0;
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const firebaseConfig = {
    apiKey: process.env.API_FIREBASE,
    authDomain: "chat-de28e.firebaseapp.com",
    projectId: "chat-de28e",
    storageBucket: "chat-de28e.appspot.com",
    messagingSenderId: "717731032964",
    appId: "1:717731032964:web:dde62019c0af4f489c37d1",
    measurementId: "G-K1GDR8DN96"
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.app = app;
const storage = (0, storage_1.getStorage)(app);
exports.storage = storage;
