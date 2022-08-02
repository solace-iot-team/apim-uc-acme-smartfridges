export class Constants {

  static DEFAULT_SERVER_PORT = 8201;
  static DEFAULT_SERVER_REQUEST_LIMIT = '100kb';
  static DEFAULT_SERVER_CORS_ORIGIN = 'http://localhost:8200';

  static TOPIC_ROOT = 'acme/smartfridges/application/v1';

  static COOKIE_CLIENT_ID = 'client_id';

  static EVENT_TEMPERATURE_MEASURED = 'temperature-measured';
  static EVENT_DOOR_OPENED = 'door-opened';
  static EVENT_DOOR_CLOSED = 'door-closed';
  static EVENT_TEMPERATURE_SETTING_UPDATED = 'temperature-setting-updated';
}