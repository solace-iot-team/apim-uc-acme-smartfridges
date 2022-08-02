
function getEnvVarAsString(name: string): string | undefined;
function getEnvVarAsString(name: string, defaultValue: string): string;

function getEnvVarAsString(name: string, defaultValue?: string): string | undefined {
  return process.env[name] || defaultValue;
}

function getMandatoryEnvVarAsString(name: string): string {
  const value = getEnvVarAsString(name);
  if (!value) throw new Error(`environment variable '${name} is missing`);
  return value;
}

// EXPORTS

class Config {

  #apiServerHost: string;

  constructor() {
    this.#apiServerHost = getMandatoryEnvVarAsString('REACT_APP_API_SERVER_HOST');
  }

  get apiServerHost(): string {
    return this.#apiServerHost;
  }

} // class Config

export default new Config();
