import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role } from '../entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  // Injecting necessary services: JwtService for token verification, ConfigService for retrieving JWT secret
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const classRoles = this.reflector.get<Role[]>('roles', context.getClass());
    const methodRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );

    console.log('Class Roles:', classRoles);
    console.log('Method Roles:', methodRoles);

    // Retrieving the request object from the execution context
    const request: Request = context.switchToHttp().getRequest();

    // Extracting the authorization header which contains the JWT token
    const { authorization } = request.headers;

    // Check if authorization header exists
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authorization?.split(' ')[1]; // Extracting token from the authorization header

    try {
      // Verifying the token using the JWT secret
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      // Assigning the user payload to the 'user' property of the request object
      request['user'] = payload;
    } catch (error) {
      console.log(error.message);
      // If token verification fails throw an UnauthorizedException
      throw new UnauthorizedException();
    }

    // If token verification is successful, return true to grant access
    return true;
  }
}
