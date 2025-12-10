import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const requiredEnv = [
          'DB_NAME',
          'DB_HOST',
          'DB_USER',
          'DB_PASSWORD',
          'DB_PORT',
        ];

        for (const env of requiredEnv) {
          if (!configService.get(env)) {
            throw new Error(`Environment variable ${env} is not set`);
          }
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: parseInt(configService.get<string>('DB_PORT')!),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [User],
          synchronize: true,
        };
      },
    }),

    UserModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
