import { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';
import type { LgEssPlatform } from '../platform';
import type { ISettingHomeResponseData } from '../api/api';
import { BaseAccessory } from './base';
import { LOW_BATTERY_THRESHOLD } from '../settings';

export class BatteryAccessory extends BaseAccessory {
  private service: Service;
  private soc = 0;
  private isCharging = false;

  constructor(platform: LgEssPlatform, accessory: PlatformAccessory) {
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

  updateValues(data: ISettingHomeResponseData): void {
    this.soc = Math.max(0, Math.min(100, Math.round(parseFloat(data.statistics.bat_user_soc) || 0)));
    this.isCharging = data.direction.is_battery_charging_ === '1';

    this.service.updateCharacteristic(
      this.platform.Characteristic.BatteryLevel,
      this.soc,
    );

    this.service.updateCharacteristic(
      this.platform.Characteristic.ChargingState,
      this.isCharging
        ? this.platform.Characteristic.ChargingState.CHARGING
        : this.platform.Characteristic.ChargingState.NOT_CHARGING,
    );

    this.service.updateCharacteristic(
      this.platform.Characteristic.StatusLowBattery,
      this.soc < LOW_BATTERY_THRESHOLD
        ? this.platform.Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW
        : this.platform.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL,
    );
  }

  private getBatteryLevel(): CharacteristicValue {
    return this.soc;
  }

  private getChargingState(): CharacteristicValue {
    return this.isCharging
      ? this.platform.Characteristic.ChargingState.CHARGING
      : this.platform.Characteristic.ChargingState.NOT_CHARGING;
  }

  private getStatusLowBattery(): CharacteristicValue {
    return this.soc < LOW_BATTERY_THRESHOLD
      ? this.platform.Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW
      : this.platform.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
  }
}
