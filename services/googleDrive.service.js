import { google } from "googleapis";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_URI } = process.env;

console.log("GOOGLE DRIVE CONFIG:", {
  hasClientId: !!OAUTH_CLIENT_ID,
  hasClientSecret: !!OAUTH_CLIENT_SECRET,
  redirectUri: OAUTH_REDIRECT_URI,
  hasTokenJson: !!process.env.GOOGLE_TOKEN_JSON,
});

const oauth2Client = new google.auth.OAuth2(
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REDIRECT_URI
);

const PROMOTIONAL_FOLDER_ID = process.env.GOOGLE_PROMOTIONAL_FOLDER_ID;

if (process.env.GOOGLE_TOKEN_JSON) {
  try {
    const tokens = JSON.parse(process.env.GOOGLE_TOKEN_JSON);
    console.log("GOOGLE TOKEN:", {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
    });
    oauth2Client.setCredentials(tokens);
  } catch (err) {
    console.error("GOOGLE_TOKEN_JSON parse error:", err.message);
  }
} else {
  console.error("GOOGLE_TOKEN_JSON is missing");
}

export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/drive.file"],
  });
};

export const getToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  console.log("Token generated:");
  console.log(JSON.stringify(tokens));

  return tokens;
};

const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

export const uploadFile = async (fileBuffer, mimeType, fileName) => {
  if (!PROMOTIONAL_FOLDER_ID) {
    throw new Error("GOOGLE_PROMOTIONAL_FOLDER_ID is missing");
  }

  const credentials = oauth2Client.credentials || {};
  if (!credentials.access_token && !credentials.refresh_token) {
    throw new Error("Google Drive credentials missing. Check GOOGLE_TOKEN_JSON env.");
  }

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
  if (!fileId) return;

  const drive = google.drive({ version: "v3", auth: oauth2Client });
  await drive.files.delete({ fileId });
};

export const extractFileId = (url) => {
  const match = url?.match(/id=([^&]+)/);
  return match ? match[1] : null;
};