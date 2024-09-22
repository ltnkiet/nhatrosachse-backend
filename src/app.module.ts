import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@modules/auth/auth.module';
import { PostModule } from '@modules/post/post.module';
import { UserModule } from '@modules/user/user.module';

import { ENV_KEY } from '@common/constants';
import { AuditModule } from "@common/audit/audit.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow(ENV_KEY.DB_HOST),
        port: +configService.getOrThrow(ENV_KEY.DB_PORT),
        username: configService.getOrThrow(ENV_KEY.DB_USERNAME),
        password: configService.getOrThrow(ENV_KEY.DB_PASSWORD),
        database: configService.getOrThrow(ENV_KEY.DB_SCHEMA),
        autoLoadEntities: true,
        entities: [],
        synchronize: configService.getOrThrow(ENV_KEY.DB_SYNCHRONIZE) === 'true',
        logging: configService.getOrThrow(ENV_KEY.DB_LOGGING) === 'true',
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
    AuditModule,
    AuthModule,
    UserModule,
    PostModule,
  ],
})
export class AppModule {}
