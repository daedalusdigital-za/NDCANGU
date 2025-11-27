export const environment = {
  production: true,
  apiBaseUrl: 'https://ngcanduapi.azurewebsites.net/api/',
  security: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90, // days
      preventReuse: 5 // last N passwords
    },
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15 // minutes
  }
};
