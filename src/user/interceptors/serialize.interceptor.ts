import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {plainToClass} from "class-transformer";


interface  ClassConstructor{
  new (...args:any):{};
}

export function Serialize(dto:ClassConstructor){
  return UseInterceptors(new SerializeInterceptor((dto)));
}

export  class SerializeInterceptor implements NestInterceptor{
  constructor(private dto:ClassConstructor) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
      // Run something before the request is handled by the request handler
      return next.handle().pipe(
          map((data:any)=>{
              // Run something before the response is sent out
                  return plainToClass(this.dto,data,{
                      excludeExtraneousValues:true,
                  })
          })
      )
  }
}
