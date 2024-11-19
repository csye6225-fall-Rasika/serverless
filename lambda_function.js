const AWS = require('aws-sdk');
const sendgrid = require('@sendgrid/mail');
const { URLSearchParams } = require('url');

// Load environment variables
const SENDGRID_API_KEY = process.env.EMAIL_SECRET;
sendgrid.setApiKey(SENDGRID_API_KEY);


exports.lambdaHandler = async (event) => {
  try {
    // Parse the SNS message
    const snsMessage = event.Records[0].Sns.Message;
    const messageData = JSON.parse(snsMessage);
    const email = messageData.email;
    const verificationToken = messageData.token;

    // Generate the verification link using the token
    const verificationParams = new URLSearchParams({
      token: verificationToken,
    });
    const verificationLink = `http://demo.net-bound.com/verify?${verificationParams.toString()}`;

    // Email content
    const emailContent = {
      to: email,
      from: "no-reply@net-bound.com",
      subject: "Please verify your email",
      html: `<p>Go to <a href='${verificationLink}'>here</a> to verify your email. The link will expire in 2 minutes.</p>`,
    };

    // Send the email using SendGrid
    const response = await sendgrid.send(emailContent);
    console.log(`Email sent. Status code: ${response[0].statusCode}`);

    return {
      statusCode: 200,
      body: JSON.stringify('Email sent successfully!'),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify(`Error: ${error.message}`),
    };
  }
};