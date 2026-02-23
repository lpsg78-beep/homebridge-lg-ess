import { PlatformAccessory } from 'homebridge';
import type { LgEssPlatform } from '../platform';
import type { ISettingHomeResponseData } from '../api/api';
import { BaseAccessory } from './base';
export declare class GridAccessory extends BaseAccessory {
    private lightService;
    private contactService;
    private watts;
    private isImporting;
    constructor(platform: LgEssPlatform, accessory: PlatformAccessory);
    updateValues(data: ISettingHomeResponseData): void;
    private getLevel;
    private getContactState;
}
//# sourceMappingURL=grid.d.ts.map