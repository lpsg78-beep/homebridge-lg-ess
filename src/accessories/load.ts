import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';
import type { LgEssPlatform } from '../platform';
import type { ISettingHomeResponseData } from '../api/api';
import { BaseAccessory } from './base';

export class LoadAccessory extends BaseAccessory {
  private service: Service;
  private watts = 0.0001;

  constructor(platform: LgEssPlatform, accessory: PlatformAccessory) {
    super(platform, accessory);

    this.service =
      this.accessory.getService(this.platform.Service.LightSensor) ||
      this.accessory.addService(this.platform.Service.LightSensor, 'House Consumption');

    this.service.setCharacteristic(this.platform.Characteristic.Name, 'House Consumption');

    this.service
      .getCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel)
      .onGet(this.getLevel.bind(this));
  }

  updateValues(data: ISettingHomeResponseData): void {
    const raw = parseFloat(data.statistics.load_power) || 0;
    this.watts = Math.max(0.0001, raw);

    this.service.updateCharacteristic(
      this.platform.Characteristic.CurrentAmbientLightLevel,
      this.watts,
    );
  }

  private getLevel(): CharacteristicValue {
    return this.watts;
  }
}
