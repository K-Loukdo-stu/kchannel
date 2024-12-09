import { Injectable, Inject } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class MongooseService {
  constructor(@Inject('MONGOOSE_OPTIONS') private options) { }

  onApplicationBootstrap() {
    const { uri } = this.options;
    (async () => {
      try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(uri, {

        });
        console.log('KChannel connected to MongoDb');
      } catch (err) {
        console.error("KChannel mongoose err:", err);
      }
    })();
  }
}
