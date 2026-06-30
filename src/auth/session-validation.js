/**
 * Session Timeout Validation Module
 * Fixed timestamp comparison to prevent unexpected logouts
 */

class SessionValidator {
  constructor(sessionTimeout = 3600000) {
    this.sessionTimeout = sessionTimeout; // 1 hour in milliseconds
  }

  /**
   * Validate session and check if it has expired
   * Fixed: Proper timestamp comparison logic
   */
  validateSession(session) {
    if (!session || !session.createdAt) {
      return { valid: false, reason: 'Invalid session object' };
    }

    const now = Date.now();
    const sessionAgeMs = now - new Date(session.createdAt).getTime();

    // FIXED: Corrected timestamp comparison
    // Was comparing string timestamps, now properly converts to milliseconds
    if (sessionAgeMs > this.sessionTimeout) {
      return {
        valid: false,
        reason: 'Session expired',
        expiredAt: new Date(session.createdAt).getTime() + this.sessionTimeout,
      };
    }

    // Check activity timeout
    if (session.lastActivity) {
      const inactivityMs = now - new Date(session.lastActivity).getTime();
      const inactivityTimeout = 30 * 60 * 1000; // 30 minutes

      if (inactivityMs > inactivityTimeout) {
        return {
          valid: false,
          reason: 'Session inactive',
          expiredAt: new Date(session.lastActivity).getTime() + inactivityTimeout,
        };
      }
    }

    return { valid: true, expiresIn: this.sessionTimeout - sessionAgeMs };
  }

  /**
   * Refresh session validity
   */
  refreshSession(session) {
    const validation = this.validateSession(session);

    if (!validation.valid) {
      return { success: false, error: validation.reason };
    }

    return {
      success: true,
      session: {
        ...session,
        lastActivity: new Date().toISOString(),
      },
    };
  }

  /**
   * Middleware for session validation
   */
  middleware() {
    return (req, res, next) => {
      if (!req.session) {
        return res.status(401).json({ error: 'No session found' });
      }

      const validation = this.validateSession(req.session);

      if (!validation.valid) {
        req.session = null;
        return res.status(401).json({ error: validation.reason });
      }

      // Update last activity
      req.session.lastActivity = new Date().toISOString();
      next();
    };
  }
}

module.exports = SessionValidator;
