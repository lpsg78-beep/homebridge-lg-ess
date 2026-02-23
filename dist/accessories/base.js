"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAccessory = void 0;
class BaseAccessory {
    platform;
    accessory;
    constructor(platform, accessory) {
        this.platform = platform;
        this.accessory = accessory;
        this.accessory
            .getService(this.platform.Service.AccessoryInformation)
            .setCharacteristic(this.platform.Characteristic.Manufacturer, 'LG Electronics')
            .setCharacteristic(this.platform.Characteristic.Model, 'ESS Home')
            .setCharacteristic(this.platform.Characteristic.SerialNumber, this.platform.config.essIp);
    }
}
exports.BaseAccessory = BaseAccessory;
//# sourceMappingURL=base.js.map