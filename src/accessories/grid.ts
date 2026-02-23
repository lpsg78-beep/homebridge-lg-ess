import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';
import type { LgEssPlatform } from '../platform';
import type { ISettingHomeResponseData } from '../api/api';
import { BaseAccessory } from './base';

export class GridAccessory extends BaseAccessory {
  private lightService: Service;
  private contactService: Service;
  private watts = 0.0001;
  private isImporting = false;

  constructor(platform: LgEssPlatform, accessory: PlatformAccessory) {
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

  updateValues(data: ISettingHomeResponseData): void {
    const raw = Math.abs(parseFloat(data.statistics.grid_power) || 0);
    this.watts = Math.max(0.0001, raw);
    this.isImporting = data.direction.is_grid_buying_ === '1';

    this.lightService.updateCharacteristic(
      this.platform.Characteristic.CurrentAmbientLightLevel,
      this.watts,
    );

    this.contactService.updateCharacteristic(
      this.platform.Characteristic.ContactSensorState,
      this.isImporting
        ? this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
        : this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED,
    );
  }

  private getLevel(): CharacteristicValue {
    return this.watts;
  }

  private getContactState(): CharacteristicValue {
    return this.isImporting
      ? this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
      : this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED;
  }
}
