import { PlatformAccessory } from 'homebridge';
import type { LgEssPlatform } from '../platform';
import type { ISettingHomeResponseData } from '../api/api';
export declare abstract class BaseAccessory {
    protected readonly platform: LgEssPlatform;
    protected readonly accessory: PlatformAccessory;
    constructor(platform: LgEssPlatform, accessory: PlatformAccessory);
    abstract updateValues(data: ISettingHomeResponseData): void;
}
//# sourceMappingURL=base.d.ts.map