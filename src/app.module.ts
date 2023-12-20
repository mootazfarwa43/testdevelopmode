import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          process.env.NODE_ENV === 'test'
            ? configService.get<string>('MONGO_URI_TEST')
            : configService.get<string>('MONGO_URI_DEV'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {
  constructor() {
    const env = process.env.NODE_ENV || 'development';
    const mongoUri = process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TEST
      : process.env.MONGO_URI_DEV;

    console.log(`Running in ${env} mode`);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log(`MongoDB URI: ${mongoUri}`);
  }
}
