export interface ExecutionDocument {
  id: string;
  projectId: string;
  systemId: string;
  documentType: 'title-page';
  createdAt: number;
  createdBy: string;
}

const EXECUTION_DOCS_KEY = 'execution_documents';

export function getExecutionDocuments(): ExecutionDocument[] {
  const stored = localStorage.getItem(EXECUTION_DOCS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveExecutionDocuments(docs: ExecutionDocument[]) {
  localStorage.setItem(EXECUTION_DOCS_KEY, JSON.stringify(docs));
}

export function createExecutionDocument(
  projectId: string,
  systemId: string,
  documentType: 'title-page',
  createdBy: string
): ExecutionDocument {
  const docs = getExecutionDocuments();
  const newDoc: ExecutionDocument = {
    id: 'execdoc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    projectId,
    systemId,
    documentType,
    createdAt: Date.now(),
    createdBy
  };
  docs.push(newDoc);
  saveExecutionDocuments(docs);
  return newDoc;
}

export function getExecutionDocumentsByProject(projectId: string): ExecutionDocument[] {
  return getExecutionDocuments().filter(doc => doc.projectId === projectId);
}

export function deleteExecutionDocument(docId: string): boolean {
  const docs = getExecutionDocuments();
  const filtered = docs.filter(doc => doc.id !== docId);
  
  if (filtered.length === docs.length) return false;
  
  saveExecutionDocuments(filtered);
  return true;
}
