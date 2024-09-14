import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@modules/auth/auth.module';
import { PostModule } from '@modules/post/post.module';
import { UserModule } from '@modules/user/user.module';

import { ENV_KEY } from '@common/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow(ENV_KEY.DB_HOST),
        port: configService.getOrThrow(ENV_KEY.DB_PORT),
        username: configService.getOrThrow(ENV_KEY.DB_USERNAME),
        password: configService.getOrThrow(ENV_KEY.DB_PASSWORD),
        database: configService.getOrThrow(ENV_KEY.DB_SCHEMA),
        autoLoadEntities: true,
        entities: [],
        synchronize: configService.getOrThrow(ENV_KEY.DB_SYNCHRONIZE)?.toLowerCase() === 'true',
        logging: configService.getOrThrow(ENV_KEY.DB_LOGGING)?.toLowerCase() === 'true',
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UserModule,
    PostModule,
  ],
})
export class AppModule {}
