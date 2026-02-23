import { PlatformAccessory } from 'homebridge';
import type { LgEssPlatform } from '../platform';
import type { ISettingHomeResponseData } from '../api/api';
import { BaseAccessory } from './base';
export declare class SystemAccessory extends BaseAccessory {
    private service;
    private hasFault;
    constructor(platform: LgEssPlatform, accessory: PlatformAccessory);
    updateValues(data: ISettingHomeResponseData): void;
    private getContactState;
}
//# sourceMappingURL=system.d.ts.map