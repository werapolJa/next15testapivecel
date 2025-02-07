import connectionPool from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

type User = {
  user_id: number;
  full_name: string;
  phone: string;
};

type Data = {
  data?: User[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Check if NEXT_PUBLIC_SUPABASE_URL is set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    // If the environment variable is not set, return an error response
    return res.status(500).json({ error: "Supabase URL is not set in environment variables." });
  }

  if (req.method === "GET") {
    try {
      const result = await connectionPool.query("SELECT * FROM posts");
      res.status(200).json({ data: result.rows });
    } catch  {
      res.status(500).json({ error: "An error occurred while querying the database." });
    }
  }
}
