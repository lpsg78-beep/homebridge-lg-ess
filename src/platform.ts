import {
  API,
  DynamicPlatformPlugin,
  Logging,
  PlatformAccessory,
  PlatformConfig,
  Service,
  Characteristic,
} from 'homebridge';

import { LgEssApi, ISettingHomeResponseData } from './api/api';
import { PLATFORM_NAME, PLUGIN_NAME, ACCESSORY_NAMES, DEFAULT_POLL_INTERVAL } from './settings';
import { BatteryAccessory } from './accessories/battery';
import { SolarAccessory } from './accessories/solar';
import { LoadAccessory } from './accessories/load';
import { GridAccessory } from './accessories/grid';
import { SystemAccessory } from './accessories/system';
import { BaseAccessory } from './accessories/base';

interface LgEssConfig extends PlatformConfig {
  essIp: string;
  essPassword: string;
  pollingInterval?: number;
}

export class LgEssPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service;
  public readonly Characteristic: typeof Characteristic;

  private readonly cachedAccessories = new Map<string, PlatformAccessory>();
  private readonly handlers = new Map<string, BaseAccessory>();
  private essApi?: LgEssApi;
  private pollingTimer?: ReturnType<typeof setInterval>;

  constructor(
    public readonly log: Logging,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.Service = api.hap.Service;
    this.Characteristic = api.hap.Characteristic;

    const essConfig = config as LgEssConfig;
    if (!essConfig.essIp || !essConfig.essPassword) {
      this.log.error('Missing required config: essIp and essPassword must be set');
      return;
    }

    this.api.on('didFinishLaunching', () => {
      this.bootstrap(essConfig).catch((err) => {
        this.log.error('Failed to start LG ESS plugin:', (err as Error).message);
      });
    });

    this.api.on('shutdown', () => {
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer);
      }
    });
  }

  configureAccessory(accessory: PlatformAccessory): void {
    this.log.info('Restoring cached accessory:', accessory.displayName);
    this.cachedAccessories.set(accessory.UUID, accessory);
  }

  private async bootstrap(config: LgEssConfig): Promise<void> {
    this.essApi = new LgEssApi(config.essIp);
    await this.essApi.login(config.essPassword);
    this.log.info('Authenticated with ESS at', config.essIp);

    this.discoverDevices();

    const interval = (config.pollingInterval ?? DEFAULT_POLL_INTERVAL) * 1000;
    await this.pollData(config);
    this.pollingTimer = setInterval(() => this.pollData(config), interval);
    this.log.info(`Polling every ${interval / 1000}s`);
  }

  private discoverDevices(): void {
    const devices: Array<{
      name: string;
      factory: new (platform: LgEssPlatform, accessory: PlatformAccessory) => BaseAccessory;
    }> = [
      { name: ACCESSORY_NAMES.BATTERY, factory: BatteryAccessory },
      { name: ACCESSORY_NAMES.SOLAR, factory: SolarAccessory },
      { name: ACCESSORY_NAMES.LOAD, factory: LoadAccessory },
      { name: ACCESSORY_NAMES.GRID, factory: GridAccessory },
      { name: ACCESSORY_NAMES.SYSTEM, factory: SystemAccessory },
    ];

    const activeUUIDs = new Set<string>();

    for (const device of devices) {
      const uuid = this.api.hap.uuid.generate(PLUGIN_NAME + ':' + device.name);
      activeUUIDs.add(uuid);

      const existingAccessory = this.cachedAccessories.get(uuid);
      if (existingAccessory) {
        this.log.info('Restoring accessory:', device.name);
        const handler = new device.factory(this, existingAccessory);
        this.handlers.set(uuid, handler);
      } else {
        this.log.info('Adding new accessory:', device.name);
        const accessory = new this.api.platformAccessory(device.name, uuid);
        const handler = new device.factory(this, accessory);
        this.handlers.set(uuid, handler);
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      }
    }

    // Remove stale cached accessories
    for (const [uuid, accessory] of this.cachedAccessories) {
      if (!activeUUIDs.has(uuid)) {
        this.log.info('Removing stale accessory:', accessory.displayName);
        this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      }
    }
  }

  private async pollData(config: LgEssConfig): Promise<void> {
    if (!this.essApi) {
      return;
    }
    try {
      const response = await this.essApi.home();
      this.updateAccessories(response.data);
    } catch (err) {
      this.log.warn('Poll error:', (err as Error).message);
      try {
        await this.essApi.login(config.essPassword);
        this.log.info('Re-authenticated after poll error');
        const response = await this.essApi.home();
        this.updateAccessories(response.data);
      } catch (retryErr) {
        this.log.error('Re-authentication failed:', (retryErr as Error).message);
      }
    }
  }

  private updateAccessories(data: ISettingHomeResponseData): void {
    for (const handler of this.handlers.values()) {
      try {
        handler.updateValues(data);
      } catch (err) {
        this.log.warn('Error updating accessory:', (err as Error).message);
      }
    }
  }
}
