import { PlatformAccessory } from 'homebridge';
import type { LgEssPlatform } from '../platform';
import type { ISettingHomeResponseData } from '../api/api';
import { BaseAccessory } from './base';
export declare class LoadAccessory extends BaseAccessory {
    private service;
    private watts;
    constructor(platform: LgEssPlatform, accessory: PlatformAccessory);
    updateValues(data: ISettingHomeResponseData): void;
    private getLevel;
}
//# sourceMappingURL=load.d.ts.map