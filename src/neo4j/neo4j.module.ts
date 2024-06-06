import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Neo4jConfig } from "./neo4j-config.interface";
import { Connection } from "cypher-query-builder";
import neo4j, { auth, Driver } from "neo4j-driver";

export const NEO4J_CONFIG = 'NEO4J_CONFIG';
export const NEO4J_CONNECTION = 'NEO4J_CONNECTION';

export type ConnectionWhitDriver = Connection & {driver: Driver};

export const createDatabaseConfig = (
  configService: ConfigService,
  customConfig?: Neo4jConfig,
): Neo4jConfig =>
    customConfig || {
      host: configService.get<string>('NEO4J_HOST'),
      port: configService.get<number>('NEO4J_PORT'),
      username: configService.get<string>('NEO4J_USERNAME'),
      password: configService.get<string>('NEO4J_PASSWORD'),
      scheme: configService.get<string>('NEO4J_SCHEME'),
    };




@Module({

})
export class Neo4jModule {
  static forRootAsync( customConfig?: Neo4jConfig): DynamicModule {
    return {
      module: Neo4jModule,
      imports: [ConfigModule],
      global: true,
      providers: [
        {
          provide: NEO4J_CONFIG,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            createDatabaseConfig(configService, customConfig)
        },
        {
          provide: NEO4J_CONNECTION,
          inject: [NEO4J_CONFIG],
          useFactory: async (config:Neo4jConfig) => {
            try {
              const { host, scheme, port } = config;
              const driver: Driver = neo4j.driver(`bolt://localhost:7687`, auth.basic('neo4j','12345678' ));
              await driver.verifyConnectivity();
              return driver;
            } catch (error) {

              throw new Error(`Error connecting to database: ${error.message}`);
            }

          },
        }
      ],
    }
  }


}