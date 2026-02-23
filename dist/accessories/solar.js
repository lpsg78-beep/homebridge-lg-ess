"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolarAccessory = void 0;
const base_1 = require("./base");
class SolarAccessory extends base_1.BaseAccessory {
    service;
    watts = 0.0001;
    constructor(platform, accessory) {
        super(platform, accessory);
        this.service =
            this.accessory.getService(this.platform.Service.LightSensor) ||
                this.accessory.addService(this.platform.Service.LightSensor, 'Solar Power');
        this.service.setCharacteristic(this.platform.Characteristic.Name, 'Solar Power');
        this.service
            .getCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel)
            .onGet(this.getLevel.bind(this));
    }
    updateValues(data) {
        const raw = parseFloat(data.statistics.pcs_pv_total_power) || 0;
        this.watts = Math.max(0.0001, raw);
        this.service.updateCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel, this.watts);
    }
    getLevel() {
        return this.watts;
    }
}
exports.SolarAccessory = SolarAccessory;
//# sourceMappingURL=solar.js.map