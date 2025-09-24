const path = require('path');
const fs = require('fs').promises;
const handlebars = require('handlebars');
const { sendEmail } = require('../utils/email');
const config = require('../config/config');
const logger = require('../utils/logger');

// Register handlebars helpers
handlebars.registerHelper('currentYear', () => new Date().getFullYear());

class EmailService {
  constructor() {
    this.templatesDir = path.join(__dirname, '../templates/emails');
    this.templates = {};
  }

  /**
   * Load and compile email templates
   */
  async loadTemplates() {
    try {
      const templateFiles = await fs.readdir(this.templatesDir);
      
      for (const file of templateFiles) {
        if (file.endsWith('.hbs')) {
          const templateName = path.basename(file, '.hbs');
          const templatePath = path.join(this.templatesDir, file);
          const templateContent = await fs.readFile(templatePath, 'utf-8');
          this.templates[templateName] = handlebars.compile(templateContent);
        }
      }
      
      logger.info('Email templates loaded successfully');
    } catch (error) {
      logger.error('Failed to load email templates:', error);
      throw error;
    }
  }

  /**
   * Send an email using a template
   * @param {string} templateName - Name of the template (without .hbs extension)
   * @param {Object} data - Data to be passed to the template
   * @param {Object} options - Additional email options
   * @returns {Promise<Object>} - Send info
   */
  async sendTemplateEmail(templateName, data = {}, options = {}) {
    try {
      // Ensure templates are loaded
      if (Object.keys(this.templates).length === 0) {
        await this.loadTemplates();
      }

      // Get the template
      const template = this.templates[templateName];
      if (!template) {
        throw new Error(`Template '${templateName}' not found`);
      }

      // Add common data to all templates
      const templateData = {
        ...data,
        appName: config.appName,
        supportEmail: config.email.supportEmail,
        currentYear: new Date().getFullYear(),
        loginUrl: `${config.clientUrl}/login`,
        supportUrl: `${config.clientUrl}/support`,
      };

      // Render the template
      const html = template(templateData);

      // Send the email
      const emailOptions = {
        to: data.email || options.to,
        subject: options.subject || `${config.appName} - ${templateName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        html,
        ...options
      };

      const info = await sendEmail(emailOptions);
      
      // Log email sent in development
      if (process.env.NODE_ENV !== 'production') {
        logger.info(`Email sent to ${emailOptions.to} with template ${templateName}`);
        if (info.messageId) {
          logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
      }

      return info;
    } catch (error) {
      logger.error('Error sending template email:', error);
      throw error;
    }
  }

  /**
   * Send welcome email
   * @param {string} to - Recipient email
   * @param {string} name - Recipient name
   * @param {string} [verificationUrl] - Email verification URL (optional)
   * @returns {Promise<Object>} - Send info
   */
  async sendWelcomeEmail(to, name, verificationUrl = null) {
    return this.sendTemplateEmail('welcome', {
      name,
      email: to,
      verificationUrl,
      hasVerification: !!verificationUrl
    }, {
      to,
      subject: `Welcome to ${config.appName}!`
    });
  }

  /**
   * Send email verification
   * @param {string} to - Recipient email
   * @param {string} name - Recipient name
   * @param {string} verificationUrl - Email verification URL
   * @param {string} [expirationTime='24 hours'] - Expiration time text
   * @returns {Promise<Object>} - Send info
   */
  async sendVerificationEmail(to, name, verificationUrl, expirationTime = '24 hours') {
    return this.sendTemplateEmail('verify-email', {
      name,
      email: to,
      verificationUrl,
      expirationTime
    }, {
      to,
      subject: 'Verify Your Email Address'
    });
  }

  /**
   * Send password reset email
   * @param {string} to - Recipient email
   * @param {string} name - Recipient name
   * @param {string} resetUrl - Password reset URL
   * @param {string} [expirationTime='1 hour'] - Expiration time text
   * @returns {Promise<Object>} - Send info
   */
  async sendPasswordResetEmail(to, name, resetUrl, expirationTime = '1 hour') {
    return this.sendTemplateEmail('password-reset', {
      name,
      email: to,
      resetUrl,
      expirationTime
    }, {
      to,
      subject: 'Password Reset Request'
    });
  }

  /**
   * Send password reset confirmation email
   * @param {string} to - Recipient email
   * @param {string} name - Recipient name
   * @param {Date} resetTime - Time when password was reset
   * @returns {Promise<Object>} - Send info
   */
  async sendPasswordResetConfirmation(to, name, resetTime = new Date()) {
    return this.sendTemplateEmail('password-reset-confirm', {
      name,
      email: to,
      date: resetTime.toLocaleDateString(),
      time: resetTime.toLocaleTimeString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }, {
      to,
      subject: 'Your Password Has Been Reset'
    });
  }

  /**
   * Send account locked email
   * @param {string} to - Recipient email
   * @param {string} name - Recipient name
   * @param {string} unlockUrl - Account unlock URL
   * @returns {Promise<Object>} - Send info
   */
  async sendAccountLockedEmail(to, name, unlockUrl) {
    return this.sendTemplateEmail('account-locked', {
      name,
      email: to,
      unlockUrl
    }, {
      to,
      subject: 'Account Locked: Too Many Failed Login Attempts'
    });
  }
}

// Create and export a singleton instance
const emailService = new EmailService();

// Preload templates when the service is imported
emailService.loadTemplates().catch(error => {
  logger.error('Failed to load email templates on startup:', error);
});

module.exports = emailService;
