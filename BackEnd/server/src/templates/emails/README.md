# Email Templates

This directory contains Handlebars templates for all system emails sent by the Smart Student Hub application.

## Available Templates

### 1. Welcome Email (`welcome.hbs`)
Sent when a new user registers an account.

**Variables:**
- `name`: User's full name
- `email`: User's email address
- `verificationUrl`: (Optional) URL for email verification
- `hasVerification`: Boolean indicating if verification is required

---

### 2. Verify Email (`verify-email.hbs`)
Sent when a user needs to verify their email address.

**Variables:**
- `name`: User's full name
- `email`: User's email address
- `verificationUrl`: URL for email verification
- `expirationTime`: Text indicating when the link will expire

---

### 3. Password Reset (`password-reset.hbs`)
Sent when a user requests a password reset.

**Variables:**
- `name`: User's full name
- `email`: User's email address
- `resetUrl`: URL for password reset
- `expirationTime`: Text indicating when the link will expire

---

### 4. Password Reset Confirmation (`password-reset-confirm.hbs`)
Sent after a successful password reset.

**Variables:**
- `name`: User's full name
- `email`: User's email address
- `date`: Date when password was reset
- `time`: Time when password was reset
- `timezone`: User's timezone

---

### 5. Account Locked (`account-locked.hbs`)
Sent when an account is locked due to too many failed login attempts.

**Variables:**
- `name`: User's full name
- `email`: User's email address
- `unlockUrl`: URL to unlock the account

## Common Variables

All templates automatically receive these variables:

- `appName`: Application name from config
- `supportEmail`: Support email from config
- `currentYear`: Current year (via Handlebars helper)
- `loginUrl`: URL to the login page
- `supportUrl`: URL to the support page

## Styling

All templates use inline CSS for maximum compatibility with email clients. The following conventions are used:

- **Colors**:
  - Primary: `#4a6cf7` (blue)
  - Success: `#28a745` (green)
  - Warning: `#ffc107` (yellow)
  - Danger: `#dc3545` (red)
  - Text: `#333333` (dark gray)
  - Light text: `#777777` (medium gray)

- **Spacing**:
  - Padding: 20px
  - Margin between sections: 15-20px
  - Line height: 1.6

## Testing

To test email templates:

1. Run the application in development mode
2. Trigger the email you want to test
3. Check the console for a preview URL (using Ethereal Email in development)
4. Open the URL in a browser to see the rendered email

## Adding a New Template

1. Create a new `.hbs` file in this directory
2. Use the same structure and styling as existing templates
3. Document all required variables in this README
4. Add a new method to `emailService.js` to handle the template
5. Update the `EmailService` class to load the new template

## Best Practices

- Keep email width under 600px
- Use tables for layout (email client compatibility)
- Include both HTML and plain text versions
- Test in multiple email clients
- Ensure all images have alt text
- Use web-safe fonts with fallbacks
- Keep subject lines under 60 characters
- Include an unsubscribe link in marketing emails
