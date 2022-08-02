export interface Fridge {
  id: string;
  name: string;
  description?: string;
  doorStatus: Fridge.DoorStatus;
  temperatureSetting: number;
}

export namespace Fridge {
  export enum DoorStatus {
    OPEN = 'open',
    CLOSED = 'closed',
  }
}