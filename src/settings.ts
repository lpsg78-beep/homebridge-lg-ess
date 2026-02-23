export const PLATFORM_NAME = 'LgEss';
export const PLUGIN_NAME = 'homebridge-lg-ess';

export const ACCESSORY_NAMES = {
  BATTERY: 'ESS Battery',
  SOLAR: 'ESS Solar',
  LOAD: 'ESS Load',
  GRID: 'ESS Grid',
  SYSTEM: 'ESS System',
} as const;

export const LOW_BATTERY_THRESHOLD = 15;
export const DEFAULT_POLL_INTERVAL = 10;
