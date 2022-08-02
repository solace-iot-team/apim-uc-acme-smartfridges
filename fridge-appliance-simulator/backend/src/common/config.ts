import 'dotenv/config';
import { Constants } from './constants';

function getEnvVarAsString(name: string): string | undefined;
function getEnvVarAsString(name: string, defaultValue: string): string;

function getEnvVarAsString(name: string, defaultValue?: string): string | undefined {
  return process.env[name] || defaultValue;
}

function getEnvVarAsNumber(name: string): number | undefined;
function getEnvVarAsNumber(name: string, defaultValue: number): number;

function getEnvVarAsNumber(name: string, defaultValue?: number): number | undefined {
  let value: number | undefined;
  const valueAsString = process.env[name];
  if (valueAsString) {
    value = parseInt(valueAsString);
    if (Number.isNaN(value)) throw new Error(`value for environment variable '${name} is not a number`);
  }
  return value || defaultValue;
}

function getMandatoryEnvVarAsString(name: string): string {
  const value = getEnvVarAsString(name);
  if (!value) throw new Error(`environment variable '${name} is missing`);
  return value;
}

interface Server {
  port: number;
  requestLimit: string;
  corsOrigin: string[];
}

interface Broker {
  endpoint: string;
  username: string;
  password: string;
}

// EXPORTS

class Config {

  /** The server settings. */
  #server: Server;

  /** The MQTT broker settings. */
  #broker: Broker;

  constructor() {

    this.#server = {
      port: getEnvVarAsNumber('ASFSB_SERVER_PORT', Constants.DEFAULT_SERVER_PORT),
      requestLimit: getEnvVarAsString('ASFSB_SERVER_REQUEST_LIMIT', Constants.DEFAULT_SERVER_REQUEST_LIMIT),
      corsOrigin: getEnvVarAsString('ASFSB_SERVER_CORS_ORIGIN', Constants.DEFAULT_SERVER_CORS_ORIGIN).split(/\s*,\s*/),
    }

    this.#broker = {
      endpoint: getMandatoryEnvVarAsString('ASFSB_BROKER_ENDPOINT'),
      username: getMandatoryEnvVarAsString('ASFSB_BROKER_USERNAME'),
      password: getMandatoryEnvVarAsString('ASFSB_BROKER_PASSWORD'),
    }
  }

  get server(): Server {
    return this.#server;
  }

  get broker(): Broker {
    return this.#broker;
  }

} // class Config

export default new Config();
