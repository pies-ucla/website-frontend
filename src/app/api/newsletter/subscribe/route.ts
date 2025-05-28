import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { sheets_v4 } from "googleapis";
import { JWT } from 'google-auth-library';

// Google Sheets API configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY ? 
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : '';
const SHEET_NAME = 'Newsletter Subscribers';
const GENERAL_MEMBERS_SHEET = 'General Members'; // Use separate sheet for general members

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const RATE_LIMIT_MAX = 10; // Maximum 10 requests per IP per hour

// Simple in-memory store for rate limiting
// In production, consider using Redis or a database
const ipRequestCount = new Map<string, { count: number, resetTime: number }>();

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Name validation - basic sanitization
const NAME_REGEX = /^[a-zA-Z0-9\s.,'-]{2,50}$/;

/**
 * Sanitize input to prevent injection attacks
 */
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets to prevent HTML injection
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/"/g, '\\"'); // Escape double quotes
}

/**
 * Check rate limit for an IP address
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  
  // Clean up expired entries
  for (const [storedIp, data] of ipRequestCount.entries()) {
    if (now > data.resetTime) {
      ipRequestCount.delete(storedIp);
    }
  }
  
  // Check if IP exists in our map
  if (!ipRequestCount.has(ip)) {
    ipRequestCount.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }
  
  // Get current count for this IP
  const ipData = ipRequestCount.get(ip)!;
  
  // Reset if window has expired
  if (now > ipData.resetTime) {
    ipRequestCount.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }
  
  // Increment count and check against limit
  ipData.count += 1;
  
  return ipData.count <= RATE_LIMIT_MAX;
}

/**
 * Check if email already exists in the spreadsheet
 */
async function checkEmailExists(
  sheets: sheets_v4.Sheets,
  email: string
): Promise<boolean> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!C:C`,
    });

    const rows = response.data.values || [];
    const emailLowerCase = email.toLowerCase();

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] && rows[i][0].toLowerCase() === emailLowerCase) {
        return true;
      }
    }

    return false;
  } catch (error: unknown) {
    console.error("Error checking for duplicate email:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  // Get client IP for rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  console.log('Processing form submission...');
  
  // Check rate limit
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }
  
  try {
    // Parse and validate request body
    let name, email, major, pronouns, year;
    try {
      const body = await request.json();
      name = body.name;
      email = body.email;
      major = body.major;
      pronouns = body.pronouns;
      year = body.year;
      
      console.log('Received form data:', { name, email, major, pronouns, year });
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate required inputs
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Sanitize and validate email
    const sanitizedEmail = sanitizeInput(email);
    if (!EMAIL_REGEX.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }
    
    // Sanitize and validate name
    const sanitizedName = sanitizeInput(name);
    if (!NAME_REGEX.test(sanitizedName)) {
      return NextResponse.json(
        { error: 'Please provide a valid name (2-50 characters)' },
        { status: 400 }
      );
    }

    // Sanitize additional fields if provided
    const sanitizedMajor = major ? sanitizeInput(major) : '';
    const sanitizedPronouns = pronouns ? sanitizeInput(pronouns) : '';
    const sanitizedYear = year ? sanitizeInput(year) : '';

    // Make sure environment variables are properly set
    if (!SPREADSHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
      console.error('Missing required environment variables for Google Sheets API');
      console.error({
        hasSpreadsheetId: !!SPREADSHEET_ID,
        hasClientEmail: !!CLIENT_EMAIL,
        hasPrivateKey: !!PRIVATE_KEY,
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Set up auth
    const client = new JWT({
      email: CLIENT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    // Create client instance for auth
    const client = await auth.getClient();
    console.log('Google Auth client created successfully');

    // Instance of Google Sheets API
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Check if email already exists in the spreadsheet
    const emailExists = await checkEmailExists(sheets, sanitizedEmail);
    
    if (emailExists) {
      console.log('Email already exists in spreadsheet:', sanitizedEmail);
      return NextResponse.json(
        { 
          success: true, 
          message: 'Thank you for your interest! This email is already subscribed to our newsletter.' 
        },
        { status: 200 }
      );
    }

    // Get the current date and time in a readable format
    const timestamp = new Date().toISOString();

    console.log('Adding newsletter subscriber to main sheet...');
    
    // Add row to the newsletter spreadsheet
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:D`, // Using A2:D to start after headers
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[timestamp, sanitizedName, sanitizedEmail, ip]],
        },
      });
      console.log('Successfully added to newsletter subscribers');
    } catch (error) {
      console.error('Error adding to newsletter sheet:', error);
      throw error;
    }
    
    // If this is from the interest form (has major, pronouns, year)
    if (major || pronouns || year) {
      console.log('Adding general member information...');
      
      // Create formatted data row
      const formattedData = [
        timestamp,
        sanitizedName,
        sanitizedEmail, 
        sanitizedMajor,
        sanitizedPronouns,
        sanitizedYear
      ];
      
      // Simple approach: append all data in one row to the General Members sheet
      try {
        // First try to use a separate sheet for general members
        await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: `${GENERAL_MEMBERS_SHEET}!A2:F`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [formattedData],
          },
        });
        console.log('Successfully added to general members sheet');
      } catch (generalSheetError) {
        console.error('Error adding to general members sheet:', generalSheetError);
        console.log('Attempting to add to column F in the main sheet instead...');
        
        // Fallback approach: Try using column J in the main sheet
        try {
          await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!J3:K`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [[
                `Name: ${sanitizedName}`,
                `Email: ${sanitizedEmail}`,
                `Major(s) + Minor(s): ${sanitizedMajor}`,
                `Pronouns: ${sanitizedPronouns}`,
                `Year: ${sanitizedYear}`,
                `------------------` // Simple text separator
              ]],
            },
          });
          console.log('Successfully added to column F in the main sheet');
        } catch (fallbackError) {
          console.error('Failed to add to column F in the main sheet:', fallbackError);
          throw fallbackError;
        }
      }
    }

    console.log('Form submission completed successfully');
    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your interest in PIES! Your information has been submitted successfully.' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in form submission:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    return NextResponse.json(
      { error: 'Failed to process your submission. Please try again later.' },
      { status: 500 }
    );
  }
}