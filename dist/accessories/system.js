"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemAccessory = void 0;
const base_1 = require("./base");
class SystemAccessory extends base_1.BaseAccessory {
    service;
    hasFault = false;
    constructor(platform, accessory) {
        super(platform, accessory);
        this.service =
            this.accessory.getService(this.platform.Service.ContactSensor) ||
                this.accessory.addService(this.platform.Service.ContactSensor, 'System Status');
        this.service.setCharacteristic(this.platform.Characteristic.Name, 'System Status');
        this.service
            .getCharacteristic(this.platform.Characteristic.ContactSensorState)
            .onGet(this.getContactState.bind(this));
    }
    updateValues(data) {
        const pcsFault = data.pcs_fault || {};
        this.hasFault = Object.values(pcsFault).some((v) => v !== '' && v !== '0' && v !== 'pcs_ok' && v !== 'pcs_run');
        this.service.updateCharacteristic(this.platform.Characteristic.ContactSensorState, this.hasFault
            ? this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
            : this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED);
    }
    getContactState() {
        return this.hasFault
            ? this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
            : this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED;
    }
}
exports.SystemAccessory = SystemAccessory;
//# sourceMappingURL=system.js.map