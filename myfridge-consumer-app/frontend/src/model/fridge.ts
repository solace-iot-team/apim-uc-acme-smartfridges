export interface Fridge {
  id: string;
  temperatureSetting: number;
  temperature: {
    value: number;
    unit: Fridge.TemperatureUnit;
  };
  doorStatus: Fridge.DoorStatus;
  lastUpdated?: Date;
}

export namespace Fridge {
  export enum TemperatureUnit {
    CELSIUS = 'C',
    FAHRENHEIT = 'F',
  }
  export enum DoorStatus {
    OPEN = 'open',
    CLOSED = 'closed',
  }
}
