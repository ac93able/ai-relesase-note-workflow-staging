/**
 * OAuth2 Provider Configuration Module
 * Supports integration with external OAuth2 identity providers
 */

class OAuth2Provider {
  constructor(config) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.authorizationEndpoint = config.authorizationEndpoint;
    this.tokenEndpoint = config.tokenEndpoint;
    this.userInfoEndpoint = config.userInfoEndpoint;
    this.scopes = config.scopes || ['openid', 'profile', 'email'];
  }

  /**
   * Generate authorization URL for user redirect
   */
  getAuthorizationUrl(redirectUri, state) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: this.scopes.join(' '),
      state: state,
    });
    return `${this.authorizationEndpoint}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code, redirectUri) {
    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: redirectUri,
      }).toString(),
    });
    return response.json();
  }

  /**
   * Get user information using access token
   */
  async getUserInfo(accessToken) {
    const response = await fetch(this.userInfoEndpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.json();
  }
}

module.exports = OAuth2Provider;
