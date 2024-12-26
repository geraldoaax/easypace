'use client'

import { useState, FormEvent } from 'react';
import { Input, Button, Form, Typography, Card } from 'antd';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const { Title, Text } = Typography;

export default function TimeLog() {
  const { data: session } = useSession();
  const [taskId, setTaskId] = useState<string>('');
  const [timeSpent, setTimeSpent] = useState<number | ''>('');
  const [taskDetails, setTaskDetails] = useState<any>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/log-time', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session?.user?.email, taskId, timeSpent })
    });

    if (response.ok) {
      alert('Time logged successfully!');
    } else {
      alert('Error logging time');
    }
  };

  const fetchTaskDetails = async () => {
    if (taskId) {
      const response = await fetch(`/api/get-task-details?id=${taskId}`);
      const data = await response.json();
      setTaskDetails(data);
    }
  };

  return (
    <Card style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <Image src="/images/easymine-logo.png" alt="EasyMine Logo" width={200} height={50} />
      <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>Cadastro de Tempo</Title>
      <Form onSubmitCapture={handleSubmit} layout="vertical">
        <Form.Item label="Task ID">
          <Input
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            addonAfter={<Button onClick={fetchTaskDetails}>Buscar</Button>}
          />
        </Form.Item>
        {taskDetails && (
          <Card style={{ marginBottom: 20 }}>
            <Title level={4}>{taskDetails.title}</Title>
            <Text>{taskDetails.description}</Text>
            <p><strong>State:</strong> {taskDetails.state}</p>
            <p><strong>Assigned To:</strong> {taskDetails.assignedTo}</p>
            <p><strong>Created Date:</strong> {new Date(taskDetails.createdDate).toLocaleDateString()}</p>
            <p><strong>Changed Date:</strong> {new Date(taskDetails.changedDate).toLocaleDateString()}</p>
            <p><strong>Priority:</strong> {taskDetails.priority}</p>
          </Card>
        )}
        <Form.Item label="Time Spent (hours)">
          <Input type="number" value={timeSpent} onChange={(e) => setTimeSpent(Number(e.target.value))} />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>Log Time</Button>
      </Form>
    </Card>
  );
} 