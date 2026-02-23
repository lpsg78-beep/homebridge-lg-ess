"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridAccessory = void 0;
const base_1 = require("./base");
class GridAccessory extends base_1.BaseAccessory {
    lightService;
    contactService;
    watts = 0.0001;
    isImporting = false;
    constructor(platform, accessory) {
        super(platform, accessory);
        // Light sensor for grid power magnitude
        this.lightService =
            this.accessory.getService('Grid Power') ||
                this.accessory.addService(this.platform.Service.LightSensor, 'Grid Power', 'grid-power');
        this.lightService.setCharacteristic(this.platform.Characteristic.Name, 'Grid Power');
        this.lightService
            .getCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel)
            .onGet(this.getLevel.bind(this));
        // Contact sensor for import/export direction
        this.contactService =
            this.accessory.getService('Grid Import') ||
                this.accessory.addService(this.platform.Service.ContactSensor, 'Grid Import', 'grid-direction');
        this.contactService.setCharacteristic(this.platform.Characteristic.Name, 'Grid Import');
        this.contactService
            .getCharacteristic(this.platform.Characteristic.ContactSensorState)
            .onGet(this.getContactState.bind(this));
    }
    updateValues(data) {
        const raw = Math.abs(parseFloat(data.statistics.grid_power) || 0);
        this.watts = Math.max(0.0001, raw);
        this.isImporting = data.direction.is_grid_buying_ === '1';
        this.lightService.updateCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel, this.watts);
        this.contactService.updateCharacteristic(this.platform.Characteristic.ContactSensorState, this.isImporting
            ? this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
            : this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED);
    }
    getLevel() {
        return this.watts;
    }
    getContactState() {
        return this.isImporting
            ? this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
            : this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED;
    }
}
exports.GridAccessory = GridAccessory;
//# sourceMappingURL=grid.js.map