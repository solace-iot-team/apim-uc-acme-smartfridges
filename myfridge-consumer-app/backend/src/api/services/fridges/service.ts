import * as mqtt from 'mqtt';
import config from '../../../common/config';
import { Constants } from '../../../common/constants';

const topicRoot = Constants.TOPIC_ROOT;

export enum FridgeEvents {
  TEMPERATURE_MEASURED,
  DOOR_OPENED,
  DOOR_CLOSED,
  TEMPERATURE_SETTING_UPDATED,
}

class FridgesService {

  #clients: Record<string, mqtt.Client> = {};

  async #getClient(clientId: string): Promise<mqtt.Client> {

    return new Promise((resolve, reject) => {

      if (this.#clients[clientId] !== undefined) {
        resolve(this.#clients[clientId]);
      } else {

        const client = mqtt.connect(config.broker.endpoint, {
          clientId: `consumer-app-${clientId}`,
          username: config.broker.username,
          password: config.broker.password,
          reconnectPeriod: 2000,
        });

        client.once('connect', () => {
          this.#clients[clientId] = client;
          resolve(this.#clients[clientId]);
          console.log(`Client ${clientId} connected`);
        });

        client.on('offline', () => {
          // avoid endless loop when a published message is rejected by the event broker
          try { client.removeOutgoingMessage(client.getLastMessageId()); } catch (all) { /* ignore */ }
          console.log(`Client ${clientId} is offline`);
        });

        client.on('reconnect', () => {
          console.log(`Client ${clientId} reconnected`);
        });

        client.once('error', (error) => {
          reject(error.message);
        });
      }
    });
  }

  async updateTemperatureSetting(clientId: string, customerId: number, fridgeId: string, setting: number): Promise<void> {

    const client = await this.#getClient(clientId);

    return new Promise((resolve, reject) => {

      const topic = `${topicRoot}/action/${customerId}/${fridgeId}/tcu/update`;
      const message = {
        customerId: customerId,
        fridgeId: fridgeId,
        temperature: setting,
        sentAt: new Date().toISOString(),
      };

      client.publish(topic, JSON.stringify(message), { qos: 1, cbStorePut: () => {}}, (error) => {
        if (error) {
          reject(error.message);
        } else {
          resolve();
        }
      });

    });
  }

  async addEventListener(clientId: string, customerId: number, fridgeId: string, callback: (event: FridgeEvents, message: any) => void): Promise<void> {

    const client = await this.#getClient(clientId);

    return new Promise((resolve, reject) => {

      const topics = [
        `${topicRoot}/event/${customerId}/${fridgeId}/temperature/measured`,
        `${topicRoot}/event/${customerId}/${fridgeId}/door/opened`,
        `${topicRoot}/event/${customerId}/${fridgeId}/door/closed`,
        `${topicRoot}/event/${customerId}/${fridgeId}/tcu/updated`,
      ];

      client.subscribe(topics, { qos: 0 }, (error) => {
        if (error) {
          reject(error.message);
        } else {
          resolve();
        }
      });

      client.on('message', (topic, message) => {

        if (topics.indexOf(topic) !== -1) {
          if (topic.endsWith('/temperature/measured')) {
            callback(FridgeEvents.TEMPERATURE_MEASURED, JSON.parse(message.toString()));
          } else if (topic.endsWith('/door/opened')) {
            callback(FridgeEvents.DOOR_OPENED, JSON.parse(message.toString()));
          } else if (topic.endsWith('/door/closed')) {
            callback(FridgeEvents.DOOR_CLOSED, JSON.parse(message.toString()));
          } else if (topic.endsWith('/tcu/updated')) {
            callback(FridgeEvents.TEMPERATURE_SETTING_UPDATED, JSON.parse(message.toString()));
          }
        }
      });

    });
  }

  disconnect(clientId: string): void {

    if (this.#clients[clientId] !== undefined) {
      this.#clients[clientId].end();
      delete this.#clients[clientId];
    }

    console.log(`Client ${clientId} disconnected`);
  }

}

export default new FridgesService();
