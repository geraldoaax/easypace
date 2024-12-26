export default function handler(req, res) {
  console.log("Log received:", req.body);
  res.status(200).json({ success: true });
}
