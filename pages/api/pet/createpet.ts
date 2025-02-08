import connectionPool from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // ตรวจสอบว่าเป็นคำขอแบบ GET หรือไม่
  const { name, url } = req.body;
  //   console.log(req.body);
  const client = await connectionPool.connect();
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "fail", message: "Method not allowed" });
  }

  try {
    const petInsertQuery = `
    insert into image (name, url)
    values ($1, $2);
  `;

    const petResult = await client.query(petInsertQuery, [name, url]);

    // ถ้าไม่สามารถเพิ่มข้อมูลได้ (ไม่มีผลลัพธ์)
    if (petResult.rowCount === 0) {
      return res.status(400).json({ message: "Failed to add pet data" });
    }

    // ส่งข้อมูลกลับไปหลังจากเพิ่มสำเร็จ
    return res.status(201).json({
      message: "Pet added successfully!",
    });

    // ดึงข้อมูลจากตาราง image ใน Supabase
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({ status: "fail", message: "Internal server error" });
  }
};

export default handler;
