const config = {
  API_BASE_URL:
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://www.bookmyworkers.com",

FILE_BASE_URL:
  window.location.hostname === "localhost"
    ? "https://bookmyworker.s3.eu-north-1.amazonaws.com"
    : "https://bookmyworker.s3.eu-north-1.amazonaws.com",


  PLATFORM_CHARGES: 0.0945,
  GST_CHARGES: 0.18,

  environment:
    window.location.hostname === "localhost"
      ? "development"
      : "production",
};



export const CALL_STATUS_OPTIONS = [
  "Explained",
  "Needs Follow-Up",
  "Call Back Scheduled",
  "Call Not Picked",
  "Phone Busy",
  "Call Declined",
  "Switched Off",
  "Out of Coverage Area",
  "Wrong Number",
  "Not Intrested",
  "Follow-up Tomorrow",
  "Ringing Again",
  "Explained on WhatsApp",
  "Sent WhatsApp Message",
  "Number Blocked Us",
  "Do Not Disturb (DND)",
  "Registration Link Sent",
  "Verification Pending",
  "Wants More Info",
  "Thinking About It",
  "Document Issue - Resend Needed",
  "Not the Right Person",
  "Payment Related Query",
  "Appointment Scheduled",
  "Bank Details Pending",
  "KYC Pending",
  "Verified and Approved",
  "Callback Later - Busy Now",
  "Asked Not to Call Again",
  "Already Registered",
  "No Response After Multiple Attempts",
];

export const FOLLOWUP_STATUS_COLORS = {
  Verified: "green",
  Unverified: "yellow",
  "Needs Follow-Up": "#f0ad4e",
  "Call Back Scheduled": "#f0ad4e",
  "Call Not Picked": "#d9534f",
  "Phone Busy": "#f0ad4e",
  "Call Declined": "#d9534f",
  "Switched Off": "#f0ad4e",
  "Out of Coverage Area": "#f0ad4e",
  "Wrong Number": "#d9534f",
  "Not Interested": "#d9534f",
  "Follow-up Tomorrow": "#f0ad4e",
  "Ringing Again": "#f0ad4e",
  "Explained on WhatsApp": "#5bc0de",
  "Sent WhatsApp Message": "#5bc0de",
  "Number Blocked Us": "#d9534f",
  "Do Not Disturb (DND)": "#d9534f",
  "Registration Link Sent": "#5bc0de",
  "Verification Pending": "yellow",
  "Wants More Info": "#5bc0de",
  "Thinking About It": "#f0ad4e",
  "Document Issue - Resend Needed": "#f0ad4e",
  "Not the Right Person": "#d9534f",
  "Payment Related Query": "#f0ad4e",
  "Appointment Scheduled": "#5bc0de",
  "Bank Details Pending": "yellow",
  "KYC Pending": "yellow",
  "Verified and Approved": "green",
  "Callback Later - Busy Now": "#f0ad4e",
  "Asked Not to Call Again": "#d9534f",
  "Already Registered": "#5bc0de",
  "No Response After Multiple Attempts": "#d9534f",
};



export default config;
