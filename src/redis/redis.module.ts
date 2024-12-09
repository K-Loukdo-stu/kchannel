import { DynamicModule, Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({

})
export class RedisModule {
    static register(options?): DynamicModule {
        return {
            module: RedisModule,
            providers: [
                {
                    provide: 'REDIS_OPTIONS',
                    useValue: { 
                        host: process.env.REDIS_HOST,
                        port: process.env.REDIS_PORT,
                        password: process.env.REDIS_PWD,
                        ...options
                    },
                },
                RedisService],
            exports: [RedisService]
        }
    }
}
