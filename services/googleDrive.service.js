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
const PROMOTIONAL_FOLDER_ID = process.env.GOOGLE_PROMOTIONAL_FOLDER_ID;

// Load token
if (fs.existsSync(TOKEN_PATH)) {
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oauth2Client.setCredentials(tokens);
}

// OAuth URL
export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/drive.file"],
  });
};

// Save token
export const getToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log("✅ Token saved");
};

// ✅ Upload file (FIXED)
export const uploadFile = async (filePath, mimeType, fileName) => {
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [PROMOTIONAL_FOLDER_ID],
    },
    media: {
      mimeType,
      body: fs.createReadStream(filePath),
    },
    fields: "id",
  });

  const fileId = response.data.id;

  // ⭐ set public
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return {
    id: fileId,
    url: `https://drive.google.com/uc?id=${fileId}`,
  };
};

// ✅ delete file
export const deleteFile = async (fileId) => {
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  await drive.files.delete({ fileId });
};

// ✅ extract id từ url
export const extractFileId = (url) => {
  const match = url?.match(/id=([^&]+)/);
  return match ? match[1] : null;
};