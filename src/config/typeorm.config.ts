import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'sensire',
  password: 'secret',
  database: 'grivery',
  // entities: [__dirname + '/../**/*.entity.js'],
  entities: [__dirname + '/../db/entities/*.entity{.ts,.js}'],
  // synchronize: true,
  // logging: true,
  migrationsTableName: 'migrations_orm',
  migrations: [__dirname + '/../db/migrations/*{.ts,.js}'],
  migrationsRun: true,
  cli: {
    entitiesDir: 'src/db/entities',
    migrationsDir: 'src/db/migrations',
  },
};

module.exports = typeOrmConfig;
