import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseAdminModule } from '@tfarras/nestjs-firebase-admin'
import * as admin from 'firebase-admin'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    FirebaseAdminModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const credentials = configService.get<string>('FIREBASE_CREDENTIALS_BASE64');

        if (!credentials) {
          admin.initializeApp();
          return null;
        }
        const decodedCredentials = JSON.parse(Buffer.from(credentials, 'base64').toString('utf-8'));

        return {
          credential: admin.credential.cert(decodedCredentials)
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class ApiModule { }
