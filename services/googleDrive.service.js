import { google } from "googleapis";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

const {
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REDIRECT_URI,
} = process.env;

console.log("=================================");
console.log("OAUTH_CLIENT_ID:", !!OAUTH_CLIENT_ID);
console.log("OAUTH_CLIENT_SECRET:", !!OAUTH_CLIENT_SECRET);
console.log("OAUTH_REDIRECT_URI:", OAUTH_REDIRECT_URI);
console.log("HAS GOOGLE_TOKEN_JSON:", !!process.env.GOOGLE_TOKEN_JSON);
console.log("=================================");

const oauth2Client = new google.auth.OAuth2(
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REDIRECT_URI
);

const PROMOTIONAL_FOLDER_ID =
  process.env.GOOGLE_PROMOTIONAL_FOLDER_ID;

// Nếu có token trong ENV thì dùng token đó
if (process.env.GOOGLE_TOKEN_JSON) {
  try {
    const tokens = JSON.parse(process.env.GOOGLE_TOKEN_JSON);

    console.log("✅ GOOGLE_TOKEN_JSON loaded");
    console.log("HAS ACCESS TOKEN:", !!tokens.access_token);
    console.log("HAS REFRESH TOKEN:", !!tokens.refresh_token);

    oauth2Client.setCredentials(tokens);
  } catch (err) {
    console.error("❌ GOOGLE_TOKEN_JSON parse error");
    console.error(err);
  }
} else {
  console.error("❌ GOOGLE_TOKEN_JSON is missing");
}