import { google } from "googleapis";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_URI } = process.env;

const oauth2Client = new google.auth.OAuth2(
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REDIRECT_URI
);

const PROMOTIONAL_FOLDER_ID = process.env.GOOGLE_PROMOTIONAL_FOLDER_ID;

if (process.env.GOOGLE_TOKEN_JSON) {
  try {
    const tokens = JSON.parse(process.env.GOOGLE_TOKEN_JSON);
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
  console.log("UPLOAD FILE CHECK:", {
    fileName,
    mimeType,
    isBuffer: Buffer.isBuffer(fileBuffer),
    size: fileBuffer?.length,
    firstBytes: Buffer.isBuffer(fileBuffer)
      ? fileBuffer.subarray(0, 12).toString("hex")
      : null,
  });

  if (!PROMOTIONAL_FOLDER_ID) {
    throw new Error("GOOGLE_PROMOTIONAL_FOLDER_ID is missing");
  }

  if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
    throw new Error("Invalid file buffer. Multer must use memoryStorage.");
  }

  if (!fileBuffer.length) {
    throw new Error("File buffer is empty.");
  }

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [PROMOTIONAL_FOLDER_ID],
      mimeType,
    },
    media: {
      mimeType,
      body: bufferToStream(fileBuffer),
    },
    fields: "id, name, mimeType, size",
  });

  const fileId = response.data.id;

  console.log("GOOGLE DRIVE CREATED:", response.data);

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  console.log("GOOGLE DRIVE PUBLIC URL:", `https://drive.google.com/uc?id=${fileId}`);

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