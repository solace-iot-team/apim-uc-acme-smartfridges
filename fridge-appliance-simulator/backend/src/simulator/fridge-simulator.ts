import * as mqtt from 'mqtt';
import { Constants } from '../common/constants';
import config from '../common/config';
import FridgesService from '../api/services/fridges/service';
import { Fridge } from '../model/fridge';

const roomTemperature = Constants.ROOM_TEMPERATURE;
const topicRoot = Constants.TOPIC_ROOT;

type FridgeData = Fridge & {
  temperature: {
    value: number;
    unit: 'C' | 'F';
  };
  client: mqtt.Client;
}

class FridgeSimulator {

  #fridgeData: FridgeData[] = [];

  constructor() {
    this.#initialize();
  }

  async #initialize(): Promise<void> {

    const fridges = await FridgesService.all();

    for (let fridge of fridges) {
      const client = await this.#createMqttClient(fridge);
      this.#fridgeData.push({ ...fridge, temperature: { value: roomTemperature, unit: 'C' }, client: client });
    }

    FridgesService.on('created', async (_id: string, value: Fridge) => {
      const client = await this.#createMqttClient(value);
      this.#fridgeData.push({ ...value, temperature: { value: roomTemperature, unit: 'C' }, client: client });
    });

    FridgesService.on('deleted', (id: string) => {
      const index = this.#fridgeData.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.#fridgeData.splice(index, 1);
      }
    });

    FridgesService.on('updated', (id: string, value: Fridge) => {
      const index = this.#fridgeData.findIndex((item) => item.id === id);
      if (index !== -1) {
        const current = this.#fridgeData[index];
        if (current.doorStatus !== value.doorStatus) {
          this.#sendDoorStatusEvent(current, value.doorStatus);
        }
        if (current.temperatureSetting !== value.temperatureSetting) {
          this.#sendTemperatureSettingUpdatedEvent(current, value.temperatureSetting);
        }
        this.#fridgeData[index] = { ...current, doorStatus: value.doorStatus, temperatureSetting: value.temperatureSetting };
      }
    });

    setInterval(this.#updateTemperature.bind(this), 10000);
    setInterval(() => {
      [...this.#fridgeData].forEach(fridge => this.#sendTemperatureMeasurementEvent(fridge));
    }, 5000);
  }

  async #createMqttClient(fridge: Fridge): Promise<mqtt.Client> {

    return new Promise((resolve, reject) => {

      const client = mqtt.connect(config.broker.endpoint, {
        clientId: `fridge-appliance-${fridge.id}`,
        username: config.broker.username,
        password: config.broker.password,
        reconnectPeriod: 2000,
      });
      client.once('connect', () => {
        client.subscribe(`${topicRoot}/action/${fridge.id}/tcu/update`, { qos: 0 }, (error) => {
          if (error) reject(error.message);
          resolve(client);
        });
      });
      client.once('error', (error) => {
        reject(error.message);
      });
      client.on('offline', () => {
        // avoid an endless loop when a published message is rejected by the event broker
        client.removeOutgoingMessage(client.getLastMessageId());
      });
      client.on('message', (topic, message) => {
        const data = JSON.parse(message.toString());
        if (topic.endsWith('/tcu/update')) {
          FridgesService.update(data.fridgeId, { temperatureSetting: data.temperature });
        }
      });
    });
  }

  #updateTemperature(): void {
    this.#fridgeData.forEach((item) => {
      let targetTemperature = roomTemperature;
      if (item.doorStatus === Fridge.DoorStatus.CLOSED) {
        targetTemperature = 10 - 2 * item.temperatureSetting;
      }
      if (item.temperature.value > targetTemperature) {
        item.temperature.value = Math.max(item.temperature.value - 1, targetTemperature);
      } else {
        item.temperature.value = Math.min(item.temperature.value + 1, targetTemperature);
      }
    });
  }

  async #sendTemperatureMeasurementEvent(fridge: FridgeData): Promise<void> {

    const topic = `${topicRoot}/event/${fridge.id}/temperature/measured`;
    fridge.client.publish(topic, JSON.stringify({
      fridgeId: fridge.id,
      temperature: fridge.temperature,
      sentAt: new Date().toISOString(),
    }), {
      qos: 1,
    });
    console.log(`[${fridge.name}]: published event to ${topic}`);
  }

  async #sendDoorStatusEvent(fridge: FridgeData, status: Fridge.DoorStatus): Promise<void> {

    let topic: string;

    switch (status) {
      case Fridge.DoorStatus.OPEN:
        topic = `${topicRoot}/event/${fridge.id}/door/opened`;
        break;
      case Fridge.DoorStatus.CLOSED:
        topic = `${topicRoot}/event/${fridge.id}/door/closed`;
        break;
      default:
        return Promise.reject('invalid status');
    }

    fridge.client.publish(topic, JSON.stringify({
      fridgeId: fridge.id,
      sentAt: new Date().toISOString(),
    }), {
      qos: 1,
      retain: true,
    });
    console.log(`[${fridge.name}]: published event to ${topic}`);
  }

  async #sendTemperatureSettingUpdatedEvent(fridge: FridgeData, setting: number): Promise<void> {

    const topic = `${topicRoot}/event/${fridge.id}/tcu/updated`;

    fridge.client.publish(topic, JSON.stringify({
      fridgeId: fridge.id,
      temperature: setting,
      sentAt: new Date().toISOString(),
    }), {
      qos: 1,
      retain: true,
    });
    console.log(`[${fridge.name}]: published event to ${topic}`);
  }
}

export default new FridgeSimulator();
