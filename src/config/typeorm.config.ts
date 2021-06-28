import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost', // process.env.DB_HOST
  port: 5432, // process.env.DB_PORT
  username: 'sensire', // process.env.USER_NAME
  password: 'secret', // process.env.db_PASSWORD
  database: 'grivery', // process.env.DB_NAME
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
