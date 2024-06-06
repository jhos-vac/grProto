import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jModule } from './neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule.forRootAsync()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
