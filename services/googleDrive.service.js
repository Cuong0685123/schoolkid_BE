import { google } from "googleapis";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_URI } = process.env;

const oauth2Client = new google.auth.OAuth2(
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REDIRECT_URI
);

const TOKEN_PATH = "./token.json";

// ⭐ Thêm ID folder Drive của bạn vào đây
const PROMOTIONAL_FOLDER_ID = process.env.GOOGLE_PROMOTIONAL_FOLDER_ID;

// Load token nếu tồn tại
if (fs.existsSync(TOKEN_PATH)) {
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oauth2Client.setCredentials(tokens);
}

// Lấy URL để lấy code
export const getAuthUrl = () => {
  const scopes = ["https://www.googleapis.com/auth/drive.file"];
  return oauth2Client.generateAuthUrl({
    access_type: "offline", // bắt buộc để có refresh_token
    prompt: "consent",       // bắt buộc để Google trả refresh_token
    scope: scopes,
  });
};

// Lưu token
export const getToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log("✅ Token saved to token.json");
};

// Upload file
export const uploadFile = async (filePath, mimeType, fileName) => {
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const response = await drive.files.create({
    requestBody: { 
      name: fileName,
      parents: [PROMOTIONAL_FOLDER_ID]  // ⭐⭐ thêm dòng này để đưa vào folder
    },
    media: {
      mimeType,
      body: fs.createReadStream(filePath),
    },
    fields: "id, webViewLink",
  });

  return response.data;
};
