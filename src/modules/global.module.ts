import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { ENV_KEY } from '@common/constants';

const JwtModuleProvider = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const logger = new Logger('JwtModule');
    const secret = configService.getOrThrow(ENV_KEY.JWT_SECRET);
    logger.verbose(`JWT_SECRET: ${secret}`);

    return {
      secret,
      signOptions: {
        expiresIn: configService.getOrThrow(ENV_KEY.JWT_EXPIRATION, '24h'),
      },
    };
  },
});

@Global()
@Module({
  imports: [JwtModuleProvider],
  controllers: [],
  providers: [],
  exports: [JwtModuleProvider],
})
export class GlobalModule {}
