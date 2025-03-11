import { z } from 'zod';

// Define common contract parameter schemas
export const ContractAddressSchema = z.string()
  .regex(/^[0-9a-fA-F]{64}$/, "Invalid address format: must be a 64-character hex string");

export const ContractFunctionSchema = z.object({
  name: z.string().min(1),
  args: z.array(z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.record(z.string(), z.any())
  ])).optional(),
  description: z.string().optional(),
});

// Base contract section
export interface ContractSection {
  type: string;
  content: string;
}

// Contract section for conditions
export interface ContractCondition extends ContractSection {
  type: 'condition';
  function: {
    name: string;
    params: string[];
  };
}

// Contract section for actions
export interface ContractAction extends ContractSection {
  type: 'action';
  function: {
    name: string;
    params: string[];
  };
}

// Contract section for helper functions
export interface ContractHelper extends ContractSection {
  type: 'helper';
  function: {
    name: string;
    params: string[];
    returnType?: string;
  };
}

// Contract section for exports
export interface ContractExport extends ContractSection {
  type: 'export';
  function: {
    name: string;
    params: string[];
    returnType?: string;
  };
}

// Contract metadata
export interface ContractMetadata {
  version: string;
  description?: string;
  author?: string;
}

// Complete contract definition
export interface ContractDefinition {
  metadata: ContractMetadata;
  sections: ContractSection[];
}

// Function to compile a contract from a definition
export function compileContract(definition: ContractDefinition): string {
  let contractCode = `@version ${definition.metadata.version}\n\n`;
  
  // Add description if available
  if (definition.metadata.description) {
    contractCode += `# ${definition.metadata.description}\n`;
  }
  
  // Add author if available
  if (definition.metadata.author) {
    contractCode += `# Author: ${definition.metadata.author}\n`;
  }
  
  contractCode += '\n';
  
  // Add each section
  for (const section of definition.sections) {
    contractCode += `${renderSection(section)}\n\n`;
  }
  
  return contractCode;
}

// Helper function to render a section
function renderSection(section: ContractSection): string {
  switch (section.type) {
    case 'condition':
      return renderCondition(section as ContractCondition);
    case 'action':
      return renderAction(section as ContractAction);
    case 'helper':
      return renderHelper(section as ContractHelper);
    case 'export':
      return renderExport(section as ContractExport);
    default:
      return section.content;
  }
}

// Render a condition section
function renderCondition(condition: ContractCondition): string {
  const { function: func, content } = condition;
  const params = func.params.join(', ');
  
  return `# ${func.name} condition
condition triggered_by: transaction, on: ${func.name}(${params}), as: [
  content: (
${indent(content, 4)}
  )
]`;
}

// Render an action section
function renderAction(action: ContractAction): string {
  const { function: func, content } = action;
  const params = func.params.join(', ');
  
  return `# ${func.name} action
actions triggered_by: transaction, on: ${func.name}(${params}) do
${indent(content, 2)}
end`;
}

// Render a helper function
function renderHelper(helper: ContractHelper): string {
  const { function: func, content } = helper;
  const params = func.params.join(', ');
  
  return `# Helper function
fun ${func.name}(${params}) do
${indent(content, 2)}
end`;
}

// Render an export function
function renderExport(exportFunc: ContractExport): string {
  const { function: func, content } = exportFunc;
  const params = func.params.join(', ');
  
  return `# Export function
export fun ${func.name}(${params}) do
${indent(content, 2)}
end`;
}

// Helper function to indent text
function indent(text: string, spaces: number): string {
  const indent = ' '.repeat(spaces);
  return text.split('\n').map(line => `${indent}${line}`).join('\n');
}

// Apply variable substitution to a contract
export function applyTemplateVariables(contract: string, variables: Record<string, string>): string {
  let result = contract;
  
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
  }
  
  return result;
}