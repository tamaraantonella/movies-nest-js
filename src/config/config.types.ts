interface DatabaseConfig {
  url: string;
  name: string;
}

export interface ConfigProps {
  port: number;
  database: DatabaseConfig;
  swapi: string;
}