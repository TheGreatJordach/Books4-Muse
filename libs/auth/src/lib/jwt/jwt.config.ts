import { registerAs } from '@nestjs/config';
import * as process from 'node:process';
import { HttpException, HttpStatus } from '@nestjs/common';


export default registerAs("jwt", () => {
  const secret = process.env["JWT_SECRET"]
  const audience = process.env["JWT_TOKEN_AUDIENCE"]
  const issuer = process.env["JWT_TOKEN_ISSUER"]
  const ttl = parseInt(process.env["JWT_TOKEN_TTL"] ?? "3600", 10)

  // Ensure required JWT environment variables are present
  if(!secret || !issuer || !audience || isNaN(ttl) || ttl < 10) {
    const errorDetail =`
    JWT Configuration Error: Missing or invalid environment variables.
      - JWT_SECRET: ${secret ? 'OK' : 'undefined'}
      - JWT_AUDIENCE: ${audience ? 'OK' : 'undefined'}
      - JWT_ISSUER: ${issuer ? 'OK' : 'undefined'}
      - JWT_TTL: ${ttl ? 'OK' : 'undefined'}\n`;

    throw new HttpException({
      error: "ConfigErrs",
      where: "jwtConfig",
      success: false,
      data: null,
      message: errorDetail.trim()
    },HttpStatus.INTERNAL_SERVER_ERROR)
  }

  return {
    secret,
    audience,
    issuer,
    accessTokenTtl:ttl
  }
})
