const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// Google sign-in page; Google sends the user back to /auth/callback with a code
export const googleLoginURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}/auth/callback&response_type=code&scope=openid email profile&access_type=offline&prompt=consent`;
