import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import * as formidable from "formidable";
import * as fs from "fs";

export async function uploadFile(path: string, file: formidable.File) {
  const newFileRef = ref(storage, path);

  const buf = fs.readFileSync(file.filepath);

  await uploadBytesResumable(newFileRef, buf);
  return await getDownloadURL(newFileRef);
}
