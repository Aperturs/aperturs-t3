import { APIRoute, sanitizeKey } from "next-s3-upload";

export { POST } from "next-s3-upload/route";

export default APIRoute.configure({
  key(req, filename) {
    return `post/${sanitizeKey(filename)}`;
  },
});
