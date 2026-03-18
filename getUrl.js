import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.local'
})

const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_URI } = process.env;

const oAuth2Client = new google.auth.OAuth2(
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/drive.file"]; // chỉ quyền upload file

// Tạo URL để mở trong trình duyệt
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline", // cần refresh_token
  scope: SCOPES,
});

console.log("Mở URL này trên trình duyệt để lấy code:\n", authUrl);
