import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: 'http://localhost:3001/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true, // <-- req chahiye to signature change
    });
  }

  // Correct signature when passReqToCallback is true
  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    console.log('Google Profile:', profile);

    // Optional chaining & fallback
    const email = profile.emails?.[0]?.value ?? 'no-email@google.com';

    return {
      email,
      name: profile.displayName ?? 'No Name',
      provider: 'google',
      googleId: profile.id,
    };
  }
}
