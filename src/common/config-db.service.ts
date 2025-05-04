import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class DbConfigService {
  // Fix the type to match process.env
  private readonly envConfig: { [key: string]: string | undefined };

  constructor() {
    console.log('ConfigService instantiated!');
    // Load environment variables once when the service is created
    const envFile = process.env.NODE_ENV
      ? `.${process.env.NODE_ENV}.env`
      : '.env';

    console.log(envFile);
    const envFileExists = fs.existsSync(envFile);

    if (envFileExists) {
      // dotenv.parse returns { [key: string]: string }
      this.envConfig = dotenv.parse(fs.readFileSync(envFile));
    } else {
      // process.env is { [key: string]: string | undefined }
      this.envConfig = process.env;
    }
  }

  get(key: string): string {
    const value = this.envConfig[key];
    // Handle the potential undefined case
    if (value === undefined) {
      throw new Error(`Config key "${key}" is not defined`);
    }
    return value;
  }

  // The rest of your code remains the same
  getDatabaseConfig() {
    return {
      host: this.get('DB_HOST'),
      port: parseInt(this.get('DB_PORT'), 10),
      username: this.get('DB_USERNAME'),
      password: this.get('DB_PASSWORD'),
      database: this.get('DB_DATABASE'),
    };
  }
}
