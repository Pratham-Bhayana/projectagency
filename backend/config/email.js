const nodemailer = require('nodemailer')

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  }

  async sendContactNotification(contactData) {
    const { name, email, company, projectType, budget, timeline, message } = contactData

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Project Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">New Project Inquiry</h1>
            <p style="margin: 10px 0 0 0;">Bureau Engine Contact Form</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Contact Details</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            </div>

            <h2 style="color: #1f2937; margin-bottom: 20px;">Project Information</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              ${projectType ? `<p><strong>Project Type:</strong> ${projectType}</p>` : ''}
              ${budget ? `<p><strong>Budget Range:</strong> ${budget}</p>` : ''}
              ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
            </div>

            <h2 style="color: #1f2937; margin-bottom: 20px;">Message</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; font-size: 14px;">
                This email was sent from the Bureau Engine contact form.<br>
                Reply directly to this email to respond to ${name}.
              </p>
            </div>
          </div>
        </div>
      `
    }

    return await this.transporter.sendMail(mailOptions)
  }

  async sendContactConfirmation(email, name) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Bureau Engine',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">Thank You, ${name}!</h1>
            <p style="margin: 15px 0 0 0;">We've received your message</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin-bottom: 20px;">What happens next?</h2>
              
              <div style="margin-bottom: 25px;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                  <div style="width: 8px; height: 8px; background: #9333ea; border-radius: 50%; margin-right: 15px;"></div>
                  <div>
                    <strong>We'll review your project details</strong><br>
                    <span style="color: #6b7280; font-size: 14px;">Our team will analyze your requirements and prepare initial thoughts</span>
                  </div>
                </div>
                
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                  <div style="width: 8px; height: 8px; background: #9333ea; border-radius: 50%; margin-right: 15px;"></div>
                  <div>
                    <strong>We'll respond within 24 hours</strong><br>
                    <span style="color: #6b7280; font-size: 14px;">Expect a personal response with follow-up questions and next steps</span>
                  </div>
                </div>
                
                <div style="display: flex; align-items: center;">
                  <div style="width: 8px; height: 8px; background: #9333ea; border-radius: 50%; margin-right: 15px;"></div>
                  <div>
                    <strong>Discovery call scheduling</strong><br>
                    <span style="color: #6b7280; font-size: 14px;">We'll arrange a call to dive deeper into your project needs</span>
                  </div>
                </div>
              </div>

              <div style="background: #f3f4f6; padding: 20px; border-radius: 6px; margin-top: 20px;">
                <p style="margin: 0; color: #374151; font-size: 14px;">
                  <strong>In the meantime,</strong> feel free to check out our recent work on our website 
                  or connect with us on social media for the latest updates.
                </p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px;">
                Best regards,<br>
                <strong>The Bureau Engine Team</strong><br>
                Engineering Digital Success
              </p>
            </div>
          </div>
        </div>
      `
    }

    return await this.transporter.sendMail(mailOptions)
  }
}

module.exports = new EmailService()
