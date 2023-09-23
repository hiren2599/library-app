export const oktaConfig = {
    clientId: '0oabhht0lyMH8QAN25d7',
    issuer: 'https://dev-90208863.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid','profile','email'],
    pkce: true,
    disableHttpsCheck: true
}