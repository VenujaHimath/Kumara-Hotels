/**
 * Kumara Hotels Notification & Messaging Module
 * Provides helper functions and structured templates for future Email and WhatsApp integrations.
 */

export interface BookingNotificationPayload {
  reservationId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
}

/**
 * Sends a booking confirmation WhatsApp message (simulated)
 */
export async function sendWhatsAppConfirmation(payload: BookingNotificationPayload): Promise<boolean> {
  const message = `*KUMARA HOTELS CONCIERGE*\n\n` +
    `Dear ${payload.customerName},\n` +
    `Your reservation at *${payload.hotelName}* is confirmed! ✅\n\n` +
    `*Reservation Details:*\n` +
    `- Reservation ID: ${payload.reservationId}\n` +
    `- Suite: ${payload.roomName}\n` +
    `- Dates: ${payload.checkIn} to ${payload.checkOut}\n` +
    `- Amount Paid: $${payload.totalAmount}\n\n` +
    `Thank you for choosing Kumara Hotels. We look forward to welcoming you soon!`;

  console.log(`[WhatsApp Notification sent to ${payload.customerPhone}]:\n`, message);
  
  // Future implementation: Send request to Twilio/WhatsApp Business API
  return true;
}

/**
 * Sends a booking confirmation Email message (simulated)
 */
export async function sendEmailConfirmation(payload: BookingNotificationPayload): Promise<boolean> {
  const htmlBody = `
    <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #C5A880; background-color: #09090b; color: #f4f4f5;">
      <h2 style="color: #C5A880; border-bottom: 1px solid #C5A880; padding-bottom: 10px;">KUMARA HOTELS RECEIPT</h2>
      <p>Dear ${payload.customerName},</p>
      <p>Thank you for choosing Kumara Hotels. Your booking is confirmed. Below are your booking details:</p>
      
      <table style="width: 100%; font-size: 14px; margin: 20px 0; color: #e4e4e7;">
        <tr><td><strong>Reservation ID:</strong></td><td>${payload.reservationId}</td></tr>
        <tr><td><strong>Hotel:</strong></td><td>${payload.hotelName}</td></tr>
        <tr><td><strong>Accommodation:</strong></td><td>${payload.roomName}</td></tr>
        <tr><td><strong>Stay Dates:</strong></td><td>${payload.checkIn} to ${payload.checkOut}</td></tr>
        <tr><td><strong>Paid Investment:</strong></td><td style="color: #C5A880; font-weight: bold;">$${payload.totalAmount}</td></tr>
      </table>
      
      <p style="font-size: 12px; color: #a1a1aa; border-top: 1px solid #27272a; padding-top: 10px; margin-top: 20px;">
        Need to adjust your stay? Contact our 24/7 concierge desk at ${process.env.CONCIERGE_EMAIL || 'concierge@kumarahotels.com'} or WhatsApp ${process.env.WHATSAPP_NUMBER || '+94 72 719 1184'}.
      </p>
    </div>
  `;

  console.log(`[Email Notification sent to ${payload.customerEmail}]: Subject: Kumara Hotels Booking Confirmation - ${payload.reservationId}`);
  
  // Future implementation: Send email using Resend/Nodemailer/SendGrid
  return true;
}

/**
 * Sends a payment received/pending-review notification (simulated)
 */
export async function sendPaymentReceivedNotification(payload: BookingNotificationPayload, isReviewNeeded: boolean): Promise<boolean> {
  const subject = isReviewNeeded 
    ? `Kumara Hotels: Payment Receipt Received (Under Review)` 
    : `Kumara Hotels: Payment Confirmed`;
    
  const body = isReviewNeeded
    ? `We have received your bank slip for Reservation ${payload.reservationId}. Our admin team is verifying it, and we will notify you once confirmed.`
    : `Your payment of $${payload.totalAmount} for Reservation ${payload.reservationId} has been successfully processed. Your booking is now CONFIRMED.`;

  console.log(`[Email Notification sent to ${payload.customerEmail}]: Subject: ${subject}\nBody: ${body}`);
  return true;
}
