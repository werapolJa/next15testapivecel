import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ status: "fail", message: "Method not allowed" });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ status: "fail", message: "Missing URL" });
  }

  try {
    // Extract the file path from the URL
    const filePath = url.split("/").pop();

    if (!filePath) {
      return res.status(400).json({ status: "fail", message: "Invalid URL" });
    }

    // ลบไฟล์จาก Supabase Storage
    const { error: storageError } = await supabase.storage.from("petimage").remove([filePath]);

    if (storageError) {
      console.error("Error deleting file from storage:", storageError.message);
      return res.status(500).json({ status: "fail", message: "Error deleting file from storage" });
    }

    // ลบข้อมูลจากตาราง image
    const { error: dbError } = await supabase.from("image").delete().eq("url", url);

    if (dbError) {
      console.error("Error deleting image from database:", dbError.message);
      return res.status(500).json({ status: "fail", message: "Error deleting image from database" });
    }

    return res.status(200).json({ status: "ok", message: "Image deleted successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};

export default handler;