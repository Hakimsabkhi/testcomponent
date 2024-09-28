// src/app/api/sendEmail/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use another service like SendGrid, Outlook, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// This is the API route handler for sending the email
export async function POST(request: NextRequest) {
  try {
    const { to, subject, text } = await request.json();

    // Setup email data with unicode symbols
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to, // List of receivers
      subject, // Subject line
      text, // Plain text body
    };

    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, info });
  } catch (error) {
    // Cast error to Error if it's an instance of Error, or handle as a string/unknown
    if (error instanceof Error) {
      console.error('Error sending email:', error.message);
      return NextResponse.json({ success: false, error: error.message });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ success: false, error: 'An unknown error occurred' });
    }
  }
}
