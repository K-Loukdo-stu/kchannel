import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
var mongoose = require('mongoose');

@Scalar('Decimal')
export class DecimalScalar implements CustomScalar<any, any> {
  description = 'Decimal custom scalar type';

  parseValue(value: string): any {
    return mongoose.Types.Decimal128.fromString(value); // value from the client
  }

  serialize(value: any): string {
    return value.toString(); // value sent to the client
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.STRING) {
      return mongoose.Types.Decimal128.fromString(ast.value);
    }else if(ast.kind === Kind.INT){
      return mongoose.Types.Decimal128.fromString(ast.value.toString())
    }
    return '';
  }
}