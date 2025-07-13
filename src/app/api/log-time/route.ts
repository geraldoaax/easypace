import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const { userId, taskId, timeSpent } = await request.json();

    if (!userId || !taskId || !timeSpent) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'INSERT INTO time_logs (user_id, task_id, time_spent, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [userId, taskId, timeSpent]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Tempo registrado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao registrar tempo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 