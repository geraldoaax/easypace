import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const organization = process.env.AZURE_DEVOPS_ORG;
  const token = process.env.AZURE_DEVOPS_TOKEN;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID parameter is required' });
  }

  try {
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
      assignedTo: response.data.fields['System.AssignedTo']?.displayName || 'Unassigned',
      createdDate: response.data.fields['System.CreatedDate'],
      changedDate: response.data.fields['System.ChangedDate'],
      priority: response.data.fields['Microsoft.VSTS.Common.Priority'],
      type: response.data.fields['System.WorkItemType'],
      createdBy: response.data.fields['System.CreatedBy']?.displayName || 'Unknown',
      createdById: response.data.fields['System.CreatedById'],
      changedBy: response.data.fields['System.ChangedBy']?.displayName || 'Unknown',
      changedById: response.data.fields['System.ChangedById'],
      tags: response.data.fields['System.Tags'],
      areaPath: response.data.fields['System.AreaPath'],
      iterationPath: response.data.fields['System.IterationPath'],
      parentId: response.data.fields['System.ParentWorkItemId'],
      parentTitle: response.data.fields['System.ParentWorkItemTitle'],
      parentType: response.data.fields['System.ParentWorkItemType'],
    };

    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching task details' });
  }
} 