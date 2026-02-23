import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';
import type { LgEssPlatform } from '../platform';
import type { ISettingHomeResponseData } from '../api/api';
import { BaseAccessory } from './base';

export class SystemAccessory extends BaseAccessory {
  private service: Service;
  private hasFault = false;

  constructor(platform: LgEssPlatform, accessory: PlatformAccessory) {
    super(platform, accessory);

    this.service =
      this.accessory.getService(this.platform.Service.ContactSensor) ||
      this.accessory.addService(this.platform.Service.ContactSensor, 'System Status');

    this.service.setCharacteristic(this.platform.Characteristic.Name, 'System Status');

    this.service
      .getCharacteristic(this.platform.Characteristic.ContactSensorState)
      .onGet(this.getContactState.bind(this));
  }

  updateValues(data: ISettingHomeResponseData): void {
    const pcsFault = data.pcs_fault || {};
    this.hasFault = Object.values(pcsFault).some(
      (v) => v !== '' && v !== '0' && v !== 'pcs_ok' && v !== 'pcs_run',
    );

    this.service.updateCharacteristic(
      this.platform.Characteristic.ContactSensorState,
      this.hasFault
        ? this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
        : this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED,
    );
  }

  private getContactState(): CharacteristicValue {
    return this.hasFault
      ? this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
      : this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED;
  }
}
