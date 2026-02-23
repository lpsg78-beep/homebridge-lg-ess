import { PlatformAccessory } from 'homebridge';
import type { LgEssPlatform } from '../platform';
import type { ISettingHomeResponseData } from '../api/api';
import { BaseAccessory } from './base';
export declare class BatteryAccessory extends BaseAccessory {
    private service;
    private soc;
    private isCharging;
    constructor(platform: LgEssPlatform, accessory: PlatformAccessory);
    updateValues(data: ISettingHomeResponseData): void;
    private getBatteryLevel;
    private getChargingState;
    private getStatusLowBattery;
}
//# sourceMappingURL=battery.d.ts.map