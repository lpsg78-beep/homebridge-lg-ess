import { API, DynamicPlatformPlugin, Logging, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';
export declare class LgEssPlatform implements DynamicPlatformPlugin {
    readonly log: Logging;
    readonly config: PlatformConfig;
    readonly api: API;
    readonly Service: typeof Service;
    readonly Characteristic: typeof Characteristic;
    private readonly cachedAccessories;
    private readonly handlers;
    private essApi?;
    private pollingTimer?;
    constructor(log: Logging, config: PlatformConfig, api: API);
    configureAccessory(accessory: PlatformAccessory): void;
    private bootstrap;
    private discoverDevices;
    private pollData;
    private updateAccessories;
}
//# sourceMappingURL=platform.d.ts.map