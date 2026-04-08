/**
 * Google Apps Script — Subscription sign-up → Google Sheet + email notification
 *
 * Sheet (row 1 headers) — column order must match appendRow in doPost:
 *   Name | Email | Phone | Plan | First pickup date | Timestamp
 *
 * Migrating an existing sheet: insert a "First pickup date" column (e.g. column E) before Timestamp,
 * and set row 1 headers to match the order above.
 *
 * Setup:
 * 1. Open your spreadsheet (or create one with the headers above).
 * 2. Extensions → Apps Script → paste this file’s code.
 * 3. Authorize MailApp (same as pickup script):
 *    - In the toolbar, choose testAuthorizeMailAppForSubscriptions → Run.
 *    - Complete Google OAuth (Advanced → allow the project).
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web app URL (ends with /exec) into SubscriptionsPage.tsx as GOOGLE_SHEETS_WEB_APP_URL
 *    (same pattern as SchedulePickupFormPage.tsx).
 * 6. After code changes: Deploy → Manage deployments → Edit → New version → Deploy.
 *
 * Testing (manual):
 * - Run testAuthorizeMailAppForSubscriptions in the editor (OAuth if needed).
 * - Submit the subscription form on the site with addresses you control; verify Sheet row, team TO/CC
 *   email, and customer-only confirmation email.
 *
 * Uses openById() so the script works whether the Apps Script project is bound to the sheet or standalone.
 */

/** Spreadsheet ID from the URL (between /d/ and /edit) */
var SUBSCRIPTION_SPREADSHEET_ID = '1OOqpqOH8e7UlWv5T2-bXuzj7yDNpeK_nqhD_ALSxNVY';

var SUBSCRIPTION_NOTIFY_TO = 'shubham.j@smrtsystems.com';
var SUBSCRIPTION_NOTIFY_CC = [
  'ross@smrtsystems.com',
  'brayan.c@smrtsystems.com',
  'ruchira.b@smrtsystems.com',
].join(',');

/**
 * Run once from the Apps Script editor to authorize MailApp.
 * Sends a sample internal notification to SUBSCRIPTION_NOTIFY_TO / CC (same as real submissions).
 * To preview the customer confirmation template, temporarily call sendSubscriptionConfirmationToCustomer_
 * with your own email in the `email` field from the editor.
 */
function testAuthorizeMailAppForSubscriptions() {
  sendSubscriptionRequestEmail_({
    name: 'Authorization test (ignore)',
    email: 'test@example.com',
    phone: '555-555-5555',
    plan: 'Couples Plan (test)',
    firstPickupDate: 'Wed, Jan 1, 2026',
  });
}

function sendSubscriptionRequestEmail_(data) {
  var subject = 'New subscription sign-up — ' + (data.name || 'Unknown');
  var body =
    'A new subscription request was submitted from the Maytag website.\n\n' +
    'Name: ' +
    (data.name || '') +
    '\n' +
    'Email: ' +
    (data.email || '') +
    '\n' +
    'Phone: ' +
    (data.phone || '') +
    '\n' +
    'Plan: ' +
    (data.plan || '') +
    '\n' +
    'First pickup date: ' +
    (data.firstPickupDate || '') +
    '\n';

  MailApp.sendEmail({
    to: SUBSCRIPTION_NOTIFY_TO,
    cc: SUBSCRIPTION_NOTIFY_CC,
    subject: subject,
    body: body,
  });
}

/** Confirmation to the customer only (no CC to team). */
function sendSubscriptionConfirmationToCustomer_(data) {
  var email = (data.email || '').trim();
  if (!email) return;

  var firstName = (data.name || 'there').split(/\s+/)[0];
  var subject = 'We received your subscription request';
  var body =
    'Hi ' +
    firstName +
    ',\n\n' +
    'Thank you for your interest in Maytag Laundry subscription service.\n\n' +
    'We have recorded your preferences and will reach out to you shortly with next steps.\n\n' +
    'If you have questions in the meantime, just reply to this email.\n\n' +
    '— Maytag Laundry';

  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body,
  });
}

function getSubscriptionSheet_() {
  var ss = SpreadsheetApp.openById(SUBSCRIPTION_SPREADSHEET_ID);
  return ss.getSheets()[0];
}

/** Open the deployed Web app URL in a browser to verify deployment (GET). Submissions use POST only. */
function doGet() {
  return ContentService.createTextOutput(
    'Subscriptions webhook is deployed. Form submissions must use POST.'
  );
}

function doPost(e) {
  try {
    const sheet = getSubscriptionSheet_();
    const data = e.parameter || {};

    var plan = data.plan || '';
    var firstPickupDate = data.firstPickupDate || '';
    var ts = new Date().toISOString();

    sheet.appendRow([
      data.name || '',
      data.email || '',
      data.phone || '',
      plan,
      firstPickupDate,
      ts,
    ]);

    try {
      sendSubscriptionRequestEmail_({
        name: data.name,
        email: data.email,
        phone: data.phone,
        plan: plan,
        firstPickupDate: firstPickupDate,
      });
    } catch (mailErr) {
      Logger.log('MailApp error (internal): ' + mailErr);
    }

    try {
      sendSubscriptionConfirmationToCustomer_({
        name: data.name,
        email: data.email,
        plan: plan,
        firstPickupDate: firstPickupDate,
      });
    } catch (custErr) {
      Logger.log('MailApp error (customer): ' + custErr);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
