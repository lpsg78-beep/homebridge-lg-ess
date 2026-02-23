"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatteryAccessory = void 0;
const base_1 = require("./base");
const settings_1 = require("../settings");
class BatteryAccessory extends base_1.BaseAccessory {
    service;
    soc = 0;
    isCharging = false;
    constructor(platform, accessory) {
        super(platform, accessory);
        this.service =
            this.accessory.getService(this.platform.Service.Battery) ||
                this.accessory.addService(this.platform.Service.Battery, 'ESS Battery');
        this.service
            .getCharacteristic(this.platform.Characteristic.BatteryLevel)
            .onGet(this.getBatteryLevel.bind(this));
        this.service
            .getCharacteristic(this.platform.Characteristic.ChargingState)
            .onGet(this.getChargingState.bind(this));
        this.service
            .getCharacteristic(this.platform.Characteristic.StatusLowBattery)
            .onGet(this.getStatusLowBattery.bind(this));
    }
    updateValues(data) {
        this.soc = Math.max(0, Math.min(100, Math.round(parseFloat(data.statistics.bat_user_soc) || 0)));
        this.isCharging = data.direction.is_battery_charging_ === '1';
        this.service.updateCharacteristic(this.platform.Characteristic.BatteryLevel, this.soc);
        this.service.updateCharacteristic(this.platform.Characteristic.ChargingState, this.isCharging
            ? this.platform.Characteristic.ChargingState.CHARGING
            : this.platform.Characteristic.ChargingState.NOT_CHARGING);
        this.service.updateCharacteristic(this.platform.Characteristic.StatusLowBattery, this.soc < settings_1.LOW_BATTERY_THRESHOLD
            ? this.platform.Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW
            : this.platform.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
    }
    getBatteryLevel() {
        return this.soc;
    }
    getChargingState() {
        return this.isCharging
            ? this.platform.Characteristic.ChargingState.CHARGING
            : this.platform.Characteristic.ChargingState.NOT_CHARGING;
    }
    getStatusLowBattery() {
        return this.soc < settings_1.LOW_BATTERY_THRESHOLD
            ? this.platform.Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW
            : this.platform.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
    }
}
exports.BatteryAccessory = BatteryAccessory;
//# sourceMappingURL=battery.js.map