"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LgEssPlatform = void 0;
const api_1 = require("./api/api");
const settings_1 = require("./settings");
const battery_1 = require("./accessories/battery");
const solar_1 = require("./accessories/solar");
const load_1 = require("./accessories/load");
const grid_1 = require("./accessories/grid");
const system_1 = require("./accessories/system");
class LgEssPlatform {
    log;
    config;
    api;
    Service;
    Characteristic;
    cachedAccessories = new Map();
    handlers = new Map();
    essApi;
    pollingTimer;
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.Service = api.hap.Service;
        this.Characteristic = api.hap.Characteristic;
        const essConfig = config;
        if (!essConfig.essIp || !essConfig.essPassword) {
            this.log.error('Missing required config: essIp and essPassword must be set');
            return;
        }
        this.api.on('didFinishLaunching', () => {
            this.bootstrap(essConfig).catch((err) => {
                this.log.error('Failed to start LG ESS plugin:', err.message);
            });
        });
        this.api.on('shutdown', () => {
            if (this.pollingTimer) {
                clearInterval(this.pollingTimer);
            }
        });
    }
    configureAccessory(accessory) {
        this.log.info('Restoring cached accessory:', accessory.displayName);
        this.cachedAccessories.set(accessory.UUID, accessory);
    }
    async bootstrap(config) {
        this.essApi = new api_1.LgEssApi(config.essIp);
        await this.essApi.login(config.essPassword);
        this.log.info('Authenticated with ESS at', config.essIp);
        this.discoverDevices();
        const interval = (config.pollingInterval ?? settings_1.DEFAULT_POLL_INTERVAL) * 1000;
        await this.pollData(config);
        this.pollingTimer = setInterval(() => this.pollData(config), interval);
        this.log.info(`Polling every ${interval / 1000}s`);
    }
    discoverDevices() {
        const devices = [
            { name: settings_1.ACCESSORY_NAMES.BATTERY, factory: battery_1.BatteryAccessory },
            { name: settings_1.ACCESSORY_NAMES.SOLAR, factory: solar_1.SolarAccessory },
            { name: settings_1.ACCESSORY_NAMES.LOAD, factory: load_1.LoadAccessory },
            { name: settings_1.ACCESSORY_NAMES.GRID, factory: grid_1.GridAccessory },
            { name: settings_1.ACCESSORY_NAMES.SYSTEM, factory: system_1.SystemAccessory },
        ];
        const activeUUIDs = new Set();
        for (const device of devices) {
            const uuid = this.api.hap.uuid.generate(settings_1.PLUGIN_NAME + ':' + device.name);
            activeUUIDs.add(uuid);
            const existingAccessory = this.cachedAccessories.get(uuid);
            if (existingAccessory) {
                this.log.info('Restoring accessory:', device.name);
                const handler = new device.factory(this, existingAccessory);
                this.handlers.set(uuid, handler);
            }
            else {
                this.log.info('Adding new accessory:', device.name);
                const accessory = new this.api.platformAccessory(device.name, uuid);
                const handler = new device.factory(this, accessory);
                this.handlers.set(uuid, handler);
                this.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [accessory]);
            }
        }
        // Remove stale cached accessories
        for (const [uuid, accessory] of this.cachedAccessories) {
            if (!activeUUIDs.has(uuid)) {
                this.log.info('Removing stale accessory:', accessory.displayName);
                this.api.unregisterPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [accessory]);
            }
        }
    }
    async pollData(config) {
        if (!this.essApi) {
            return;
        }
        try {
            const response = await this.essApi.home();
            this.updateAccessories(response.data);
        }
        catch (err) {
            this.log.warn('Poll error:', err.message);
            try {
                await this.essApi.login(config.essPassword);
                this.log.info('Re-authenticated after poll error');
                const response = await this.essApi.home();
                this.updateAccessories(response.data);
            }
            catch (retryErr) {
                this.log.error('Re-authentication failed:', retryErr.message);
            }
        }
    }
    updateAccessories(data) {
        for (const handler of this.handlers.values()) {
            try {
                handler.updateValues(data);
            }
            catch (err) {
                this.log.warn('Error updating accessory:', err.message);
            }
        }
    }
}
exports.LgEssPlatform = LgEssPlatform;
//# sourceMappingURL=platform.js.map