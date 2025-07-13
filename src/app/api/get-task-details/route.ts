import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const organization = process.env.AZURE_DEVOPS_ORG;
  const token = process.env.AZURE_DEVOPS_TOKEN;

  if (!id) {
    return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
  }

  if (!organization || !token) {
    return NextResponse.json({ error: 'Azure DevOps configuration is missing' }, { status: 500 });
  }

  try {
    // Esta URL busca work items por ID globalmente na organização (todos os projetos)
    const response = await axios.get(`https://dev.azure.com/${organization}/_apis/wit/workitems/${id}?api-version=6.0`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const item = {
      id: response.data.id,
      title: response.data.fields['System.Title'],
      description: response.data.fields['System.Description'],
      state: response.data.fields['System.State'],
      assignedTo: response.data.fields['System.AssignedTo']?.displayName || 'Não atribuído',
      createdDate: response.data.fields['System.CreatedDate'],
      changedDate: response.data.fields['System.ChangedDate'],
      priority: response.data.fields['Microsoft.VSTS.Common.Priority'],
      type: response.data.fields['System.WorkItemType'],
      createdBy: response.data.fields['System.CreatedBy']?.displayName || 'Desconhecido',
      createdById: response.data.fields['System.CreatedById'],
      changedBy: response.data.fields['System.ChangedBy']?.displayName || 'Desconhecido',
      changedById: response.data.fields['System.ChangedById'],
      tags: response.data.fields['System.Tags'],
      areaPath: response.data.fields['System.AreaPath'],
      iterationPath: response.data.fields['System.IterationPath'],
      parentId: response.data.fields['System.ParentWorkItemId'],
      parentTitle: response.data.fields['System.ParentWorkItemTitle'],
      parentType: response.data.fields['System.ParentWorkItemType'],
      // Informações adicionais do projeto
      teamProject: response.data.fields['System.TeamProject'],
      url: response.data.url,
    };

    return NextResponse.json(item);
  } catch (error: any) {
    console.error('Erro ao buscar detalhes da tarefa:', error);
    
    if (error.response?.status === 404) {
      return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
    }
    
    if (error.response?.status === 401) {
      return NextResponse.json({ error: 'Token de acesso inválido' }, { status: 401 });
    }
    
    return NextResponse.json({ error: 'Erro ao buscar detalhes da tarefa' }, { status: 500 });
  }
} 