import { google } from "googleapis";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

const {
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REDIRECT_URI,
} = process.env;

console.log("OAUTH_CLIENT_ID:", OAUTH_CLIENT_ID);
console.log("OAUTH_REDIRECT_URI:", OAUTH_REDIRECT_URI);

const oauth2Client = new google.auth.OAuth2(
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REDIRECT_URI
);

const PROMOTIONAL_FOLDER_ID = process.env.GOOGLE_PROMOTIONAL_FOLDER_ID;

// Nếu có token trong ENV thì dùng token đó
if (process.env.GOOGLE_TOKEN_JSON) {
  const tokens = JSON.parse(process.env.GOOGLE_TOKEN_JSON);
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

// Lấy token
export const getToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  console.log("✅ Token generated:");
  console.log(JSON.stringify(tokens, null, 2));

  return tokens;
};

const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

// Upload file bằng buffer, hợp với Vercel
export const uploadFile = async (fileBuffer, mimeType, fileName) => {
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [PROMOTIONAL_FOLDER_ID],
    },
    media: {
      mimeType,
      body: bufferToStream(fileBuffer),
    },
    fields: "id",
  });

  const fileId = response.data.id;

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

export const deleteFile = async (fileId) => {
  const drive = google.drive({ version: "v3", auth: oauth2Client });
  await drive.files.delete({ fileId });
};

export const extractFileId = (url) => {
  const match = url?.match(/id=([^&]+)/);
  return match ? match[1] : null;
};