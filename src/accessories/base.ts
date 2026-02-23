import { PlatformAccessory } from 'homebridge';
import type { LgEssPlatform } from '../platform';
import type { ISettingHomeResponseData } from '../api/api';

export abstract class BaseAccessory {
  constructor(
    protected readonly platform: LgEssPlatform,
    protected readonly accessory: PlatformAccessory,
  ) {
    this.accessory
      .getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'LG Electronics')
      .setCharacteristic(this.platform.Characteristic.Model, 'ESS Home')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, this.platform.config.essIp as string);
  }

  abstract updateValues(data: ISettingHomeResponseData): void;
}
