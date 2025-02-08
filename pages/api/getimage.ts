import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // ตรวจสอบว่าเป็นคำขอแบบ GET หรือไม่
  if (req.method !== "GET") {
    return res.status(405).json({ status: "fail", message: "Method not allowed" });
  }

  try {
    // ดึงข้อมูลจากตาราง image ใน Supabase
    const { data, error } = await supabase.from("image").select("*");

    // ถ้ามีข้อผิดพลาดในการดึงข้อมูล
    if (error) {
      console.error("Error fetching images:", error.message);
      return res.status(500).json({ status: "fail", message: "Internal server error" });
    }

    // ส่งข้อมูลกลับไปยังผู้ใช้
    return res.status(200).json({ status: "ok", data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};

export default handler;