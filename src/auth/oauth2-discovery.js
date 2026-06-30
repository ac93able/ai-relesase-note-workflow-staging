/**
 * OAuth2 Discovery Endpoints Module
 * Implements OpenID Connect Discovery for automatic endpoint configuration
 */

const fetch = require('node-fetch');

class OAuth2Discovery {
  /**
   * Discover OAuth2 endpoints from provider's well-known configuration
   * @param {string} issuerUrl - The OAuth2 provider's issuer URL
   * @returns {Promise<object>} Discovered endpoints configuration
   */
  static async discoverEndpoints(issuerUrl) {
    const discoveryUrl = `${issuerUrl.replace(/\/$/, '')}/.well-known/openid-configuration`;

    try {
      const response = await fetch(discoveryUrl);
      if (!response.ok) {
        throw new Error(`Discovery endpoint returned ${response.status}`);
      }

      const config = await response.json();

      return {
        authorizationEndpoint: config.authorization_endpoint,
        tokenEndpoint: config.token_endpoint,
        userInfoEndpoint: config.userinfo_endpoint,
        revokeEndpoint: config.revocation_endpoint,
        jwksUri: config.jwks_uri,
        issuer: config.issuer,
        supportedScopes: config.scopes_supported,
        supportedResponseTypes: config.response_types_supported,
      };
    } catch (error) {
      throw new Error(`OAuth2 Discovery failed for ${issuerUrl}: ${error.message}`);
    }
  }

  /**
   * Validate discovered configuration
   */
  static validateConfig(config) {
    const required = ['authorizationEndpoint', 'tokenEndpoint', 'userInfoEndpoint'];
    const missing = required.filter(key => !config[key]);

    if (missing.length > 0) {
      throw new Error(`Missing required endpoints: ${missing.join(', ')}`);
    }

    return true;
  }
}

module.exports = OAuth2Discovery;
