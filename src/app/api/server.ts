import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import axios from 'axios';

const app = express();
app.use(express.json());

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'mydatabase',
  password: 'password',
  port: 5432,
});

app.post('/log-time', async (req: Request, res: Response) => {
  const { userId, taskId, timeSpent } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO time_logs (user_id, task_id, time_spent) VALUES ($1, $2, $3) RETURNING *',
      [userId, taskId, timeSpent]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging time');
  }
});

app.get('/tasks', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`https://dev.azure.com/${process.env.AZURE_DEVOPS_ORG}/${process.env.AZURE_DEVOPS_PROJECT}/_apis/wit/workitems?api-version=6.0`, {
      headers: { 'Authorization': `Bearer ${process.env.AZURE_DEVOPS_TOKEN}` }
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching tasks');
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
}); 