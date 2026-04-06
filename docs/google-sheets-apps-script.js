/**
 * Google Apps Script for Schedule Pickup form → Google Sheet + email notification
 *
 * Setup:
 * 1. Create a Google Sheet with headers in row 1:
 *    Name | Phone | Address | Preferred Date | Notes | Timestamp
 *
 * 2. Extensions → Apps Script
 * 3. Replace the default code with this script
 * 4. Authorize MailApp (IMPORTANT):
 *    - You cannot use Run on doPost() — it needs a real HTTP POST.
 *    - In the toolbar, open the function dropdown (next to Run) and choose:
 *      testAuthorizeMailAppForPickup
 *    - Click Run. A banner may appear: "Authorization required" → Review permissions.
 *    - Pick your Google account → Continue → Advanced → Go to … (unsafe) → Allow.
 *    - If nothing happens, check View → Executions for errors, or try again logged
 *      into the same account that owns the Sheet.
 * 5. Deploy → Manage deployments → Edit (pencil) → New version → Deploy
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the web app URL into GOOGLE_SHEETS_WEB_APP_URL in SchedulePickupFormPage.tsx
 *
 * Migrating an existing sheet (removed "Preferred Time" column):
 * - In the Sheet: delete the Preferred Time column (or leave it empty; new rows won't fill it).
 * - In Apps Script: replace doPost/sendPickupRequestEmail_ with this file's version, then Deploy → New version.
 * - Timestamp column stays last; it records when the form was submitted (ISO time), not a customer "preferred time".
 */

var PICKUP_NOTIFY_TO = 'shubham.j@smrtsystems.com';
var PICKUP_NOTIFY_CC = [
  'ross@smrtsystems.com',
  'brayan.c@smrtsystems.com',
  'ruchira.b@smrtsystems.com',
].join(',');

/**
 * Run once from the Apps Script editor to trigger MailApp authorization and send a test email.
 * Select this function in the dropdown above Run, then click Run.
 */
function testAuthorizeMailAppForPickup() {
  sendPickupRequestEmail_({
    name: 'Authorization test (ignore)',
    phone: '555-555-5555',
    address: '123 Test St',
    preferredDate: '(test)',
    notes: 'Sent from Apps Script editor to authorize MailApp.',
  });
}

function sendPickupRequestEmail_(data) {
  var subject = 'New schedule pickup request — ' + (data.name || 'Unknown');
  var body =
    'A new home pickup request was submitted from the Maytag website.\n\n' +
    'Name: ' + (data.name || '') + '\n' +
    'Phone: ' + (data.phone || '') + '\n' +
    'Address: ' + (data.address || '') + '\n' +
    'Preferred date: ' + (data.preferredDate || '') + '\n' +
    'Notes: ' + (data.notes || '') + '\n';

  MailApp.sendEmail({
    to: PICKUP_NOTIFY_TO,
    cc: PICKUP_NOTIFY_CC,
    subject: subject,
    body: body,
  });
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Supports form-urlencoded (e.parameter) - avoids CORS preflight from the website
    const data = e.parameter || {};

    sheet.appendRow([
      data.name || '',
      data.phone || '',
      data.address || '',
      data.preferredDate || '',
      data.notes || '',
      new Date().toISOString(),
    ]);

    try {
      sendPickupRequestEmail_(data);
    } catch (mailErr) {
      // Row is saved; log email failure (View → Executions in Apps Script)
      Logger.log('MailApp error: ' + mailErr);
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
