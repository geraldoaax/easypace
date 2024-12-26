'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button, Typography } from 'antd';
import TimeLog from './TimeLog';

const { Title } = Typography;

export default function Home() {
  const { data: session } = useSession();

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>Bem-vindo ao Sistema de Log de Tempo</Title>
      {!session ? (
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={() => signIn('azure-ad')}>Entrar com Azure DevOps</Button>
        </div>
      ) : (
        <div>
          <p>Bem-vindo, {session.user?.name}</p>
          <Button onClick={() => signOut()}>Sair</Button>
          <TimeLog />
        </div>
      )}
    </div>
  );
} 