const nodemailer = require('nodemailer')

class EmailService {
  constructor() {
    this.transporter = null
    this.initializeTransporter()
  }

  initializeTransporter() {
    try {
      // Create transporter with Gmail or SMTP settings
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      })

      // Verify transporter configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.log('Email service configuration error:', error)
        } else {
          console.log('Email service is ready to send messages')
        }
      })
    } catch (error) {
      console.log('Failed to initialize email transporter:', error)
    }
  }

  async sendContactEmail(contactData) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized')
      }

      const { name, email, subject, message } = contactData

      // Email to admin
      const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">Contact Details</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
              <h3 style="color: #333; margin-top: 0;">Message</h3>
              <p style="line-height: 1.6; color: #555;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
              <p style="margin: 0; font-size: 12px; color: #666;">
                This email was sent from the Bureau Engine contact form.
                <br>Please reply directly to: ${email}
              </p>
            </div>
          </div>
        `
      }

      // Auto-reply to user
      const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting Bureau Engine',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              Thank You for Your Message
            </h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Dear ${name},
            </p>
            
            <p style="line-height: 1.6; color: #555;">
              Thank you for reaching out to Bureau Engine. We have received your message and will get back to you within 24 hours.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">Your Message Summary</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong> ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}</p>
            </div>
            
            <p style="line-height: 1.6; color: #555;">
              If you have any urgent inquiries, please don't hesitate to call us directly.
            </p>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #007bff; color: white; border-radius: 5px;">
              <h3 style="margin-top: 0; color: white;">Bureau Engine</h3>
              <p style="margin: 5px 0;">Digital Innovation Agency</p>
              <p style="margin: 5px 0;">Building the Future, One Project at a Time</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
              <p style="margin: 0; font-size: 12px; color: #666;">
                This is an automated response. Please do not reply to this email.
                <br>For support, please contact us through our website or call our office.
              </p>
            </div>
          </div>
        `
      }

      // Send both emails
      const adminResult = await this.transporter.sendMail(adminMailOptions)
      const userResult = await this.transporter.sendMail(userMailOptions)

      return {
        success: true,
        adminMessageId: adminResult.messageId,
        userMessageId: userResult.messageId,
        message: 'Emails sent successfully'
      }

    } catch (error) {
      console.error('Email sending error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  async sendProjectNotification(projectData) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized')
      }

      const { title, client, category } = projectData

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Project Added: ${title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
              New Project Added
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #28a745; margin-top: 0;">Project Details</h3>
              <p><strong>Title:</strong> ${title}</p>
              <p><strong>Client:</strong> ${client}</p>
              <p><strong>Category:</strong> ${category}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
              <p style="margin: 0; font-size: 12px; color: #666;">
                This notification was sent from the Bureau Engine admin panel.
              </p>
            </div>
          </div>
        `
      }

      const result = await this.transporter.sendMail(mailOptions)

      return {
        success: true,
        messageId: result.messageId,
        message: 'Project notification sent successfully'
      }

    } catch (error) {
      console.error('Project notification error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  async testConnection() {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized')
      }

      await this.transporter.verify()
      return { success: true, message: 'Email service connection successful' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

module.exports = new EmailService()
