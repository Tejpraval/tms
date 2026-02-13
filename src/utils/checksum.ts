import crypto from "crypto";

export const generateChecksum = (data: any) => {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
};
