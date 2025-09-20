export default () => ({
  database: {
    type: process.env.DATABASE_TYPE as 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    autoLoadEntities: process.env.DATABASE_AUTOLOAD_ENTITIES === 'true',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  },
  enviroment: process.env.NODE_ENV || 'development',
});
