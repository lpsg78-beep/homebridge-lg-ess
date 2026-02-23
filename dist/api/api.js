"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LgEssApi = void 0;
const axios_1 = __importDefault(require("axios"));
const node_https_1 = __importDefault(require("node:https"));
const types_1 = require("./types");
__exportStar(require("./types"), exports);
function dateToStr(date) {
    return date.toISOString().substring(0, 10).replace(/-/g, '');
}
class LgEssApi {
    client;
    authKey;
    paths = {
        battery: '/user/setting/batt',
        common: '/user/essinfo/common',
        graph: '/user/graph/',
        home: '/user/essinfo/home',
        info: '/user/essinfo/home',
        login: '/user/setting/login',
        network: '/user/setting/network',
        system: '/user/setting/systeminfo',
    };
    constructor(ipOrHostname) {
        if (!ipOrHostname) {
            throw new Error('Required "ipOrHostname" not found.');
        }
        const httpsAgent = new node_https_1.default.Agent({
            rejectUnauthorized: false,
        });
        this.client = axios_1.default.create({
            httpsAgent: httpsAgent,
            baseURL: String(`https://${ipOrHostname}/v1`),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }
    async login(password) {
        if (!password) {
            throw new Error('Required "password" not set');
        }
        const requestData = { password };
        const response = await this.client.put(this.paths.login, requestData);
        this.authKey = response.data.auth_key;
        return this;
    }
    async state(type) {
        return this.postWithAuth(this.paths[type]);
    }
    async battery() {
        return this.state('battery');
    }
    async home() {
        return this.state('home');
    }
    async common() {
        return this.state('common');
    }
    async network() {
        return this.state('network');
    }
    async system() {
        return this.state('system');
    }
    async postWithAuth(uri) {
        const requestData = { auth_key: this.authKey };
        return this.client.post(uri, requestData);
    }
    async range(device, start, end) {
        const curDate = new Date(start.toISOString());
        let data = [];
        while (curDate <= end) {
            curDate.setDate(curDate.getDate() + 1);
            const d = await this.graph(device, types_1.GRAPH_TIMESPAN.DAY, curDate);
            data = [...data, ...d.data.loginfo];
        }
        return data;
    }
    async graph(device, timespan, date = new Date()) {
        const requestData = {
            auth_key: this.authKey,
        };
        switch (timespan) {
            case types_1.GRAPH_TIMESPAN.DAY:
            case types_1.GRAPH_TIMESPAN.WEEK:
                requestData.year_month_day = dateToStr(date).substring(0, 8);
                break;
            case types_1.GRAPH_TIMESPAN.MONTH:
                requestData.year_month = dateToStr(date).substring(0, 6);
                break;
            case types_1.GRAPH_TIMESPAN.YEAR:
                requestData.year = dateToStr(date).substring(0, 4);
                break;
        }
        const url = `${this.paths.graph}/${device}/${timespan}`;
        const response = await this.client.post(url, requestData);
        if (!response.data.loginfo) {
            response.data.loginfo = [];
        }
        response.data.loginfo.forEach((item) => this.parseGraphItem(item));
        return response;
    }
    parseGraphItem(item) {
        item.date = this.strToDate(item.time);
        return item;
    }
    strToDate(str) {
        const d = new Date();
        d.setUTCFullYear(parseInt(str.substring(0, 4), 10));
        d.setUTCMonth(parseInt(str.substring(4, 6), 10) - 1);
        d.setUTCDate(parseInt(str.substring(6, 8), 10));
        d.setUTCHours(parseInt(str.substring(8, 10), 10));
        d.setUTCMinutes(parseInt(str.substring(10, 12), 10));
        d.setUTCSeconds(parseInt(str.substring(12, 14), 10));
        d.setUTCMilliseconds(0);
        return d;
    }
}
exports.LgEssApi = LgEssApi;
//# sourceMappingURL=api.js.map