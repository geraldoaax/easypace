'use client'

import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FormEvent, useState } from 'react';

const { Title, Text } = Typography;

export default function TimeLog() {
  const { data: session } = useSession();
  const [taskId, setTaskId] = useState<string>('');
  const [timeSpent, setTimeSpent] = useState<number | ''>('');
  const [taskDetails, setTaskDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    try {
      const response = await fetch('/api/log-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user?.email, taskId, timeSpent })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Tempo registrado com sucesso!');
        setTaskId('');
        setTimeSpent('');
        setTaskDetails(null);
        setError('');
      } else {
        alert(data.error || 'Erro ao registrar tempo');
      }
    } catch (err) {
      alert('Erro de conexão ao registrar tempo');
    }
  };

  const fetchTaskDetails = async () => {
    if (!taskId.trim()) {
      setError('Por favor, informe o ID da tarefa');
      return;
    }

    setLoading(true);
    setError('');
    setTaskDetails(null);

    try {
      const response = await fetch(`/api/get-task-details?id=${taskId}`);
      
      if (response.ok) {
        const data = await response.json();
        setTaskDetails(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao buscar detalhes da tarefa');
      }
    } catch (err) {
      setError('Erro de conexão ao buscar detalhes da tarefa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <Image src="/images/easymine-logo.png" alt="EasyMine Logo" width={200} height={50} />
      <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>Cadastro de Tempo</Title>
      
      <Form onSubmitCapture={handleSubmit} layout="vertical">
        <Form.Item 
          label="ID da Tarefa"
          help="Informe o ID da tarefa de qualquer projeto da organização"
        >
          <Input
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            placeholder="Ex: 12345"
            addonAfter={
              <Button 
                onClick={fetchTaskDetails} 
                loading={loading}
                disabled={!taskId.trim()}
              >
                Buscar
              </Button>
            }
          />
        </Form.Item>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

        {taskDetails && (
          <Card style={{ marginBottom: 20 }}>
            <Title level={4}>{taskDetails.title}</Title>
            <Text>{taskDetails.description}</Text>
            <div style={{ marginTop: 10 }}>
              <p><strong>Estado:</strong> {taskDetails.state}</p>
              <p><strong>Tipo:</strong> {taskDetails.type}</p>
              <p><strong>Projeto:</strong> {taskDetails.teamProject}</p>
              <p><strong>Área:</strong> {taskDetails.areaPath}</p>
              <p><strong>Atribuído a:</strong> {taskDetails.assignedTo}</p>
              <p><strong>Data de Criação:</strong> {new Date(taskDetails.createdDate).toLocaleDateString('pt-BR')}</p>
              <p><strong>Última Modificação:</strong> {new Date(taskDetails.changedDate).toLocaleDateString('pt-BR')}</p>
              <p><strong>Prioridade:</strong> {taskDetails.priority}</p>
              {taskDetails.tags && <p><strong>Tags:</strong> {taskDetails.tags}</p>}
              {taskDetails.parentTitle && (
                <p><strong>Item Pai:</strong> {taskDetails.parentTitle} (ID: {taskDetails.parentId})</p>
              )}
            </div>
          </Card>
        )}

        <Form.Item label="Tempo Gasto (horas)">
          <Input 
            type="number" 
            value={timeSpent} 
            onChange={(e) => setTimeSpent(Number(e.target.value))}
            placeholder="Ex: 2.5"
            min="0"
            step="0.1"
          />
        </Form.Item>

        <Button 
          type="primary" 
          htmlType="submit" 
          block
          disabled={!taskDetails || !timeSpent}
        >
          Registrar Tempo
        </Button>
      </Form>
    </Card>
  );
} 