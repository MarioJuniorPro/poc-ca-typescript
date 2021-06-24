import * as Joi from 'joi';

export interface AppConfigProperties {
  name: string;
  host: string;
  port: number;
  database: {
    user: string;
    password: string;
    name: string;
    host: string;
    port: number;
  };
  isProduction: boolean;
  corsOrigin: string | '*';
}

export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  APP_NAME: string;
  APP_DOMAIN?: string;
  HOST: string;
  PORT: number;

  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  CORS_ORIGINS?: string;
}

/**
 * Base schema validator.
 */
const envValidationSchema = Joi.object<EnvironmentVariables>({
  APP_NAME: Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required(),
  APP_DOMAIN: Joi.string().domain().default('localhost'),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  HOST: Joi.string().required(),
  PORT: Joi.number().default(3000),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  CORS_ORIGINS: Joi.extend((joi) => ({
    type: 'corsArray',
    base: joi.array(),
    coerce: (value: string) => ({ value: value.split(',').map((host) => host.trim()) }),
  }))
    .corsArray()
    .items(Joi.string().uri()),
});

export class AppConfig {
  readonly #config: AppConfigProperties;

  private constructor(appConfig: AppConfigProperties) {
    this.#config = appConfig;
  }

  /**
   * Build the Application Configuration validation the env variables.
   */
  public static build(
    env: EnvironmentVariables,
    validator: Joi.ObjectSchema<EnvironmentVariables> = envValidationSchema,
  ): AppConfig {
    // Validate the env vars.
    const validation = validator.validate(env, { abortEarly: true, stripUnknown: true });
    if (validation.error) {
      throw validation.error;
    }

    const { value: config } = validation;

    return new AppConfig(
      Object.freeze({
        name: config.APP_NAME,
        host: config.HOST,
        port: config.PORT,
        database: {
          user: config.DATABASE_USER,
          password: config.DATABASE_PASSWORD,
          name: config.DATABASE_NAME,
          host: config.DATABASE_HOST,
          port: config.DATABASE_PORT,
        },
        corsOrigin: config.CORS_ORIGINS || '*',
        isProduction: config.NODE_ENV === 'production',
      }),
    );
  }

  /**
   * Get config properties.
   */
  public get config(): AppConfigProperties {
    return this.#config;
  }
}
