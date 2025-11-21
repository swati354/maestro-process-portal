/**
 * React Query hook for UiPath Maestro
 *
 * Provides methods to:
 * - Fetch Maestro processes
 * - Fetch process instances (all or by ID)
 * - Fetch BPMN diagrams
 * - Fetch execution history
 * - Control instances (pause, resume, cancel)
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { uipath } from '../lib/uipath';
import { toast } from 'sonner';
import type { RawMaestroProcessGetAllResponse, RawProcessInstanceGetResponse, ProcessInstanceOperationResponse, ProcessInstanceExecutionHistoryResponse, ProcessInstanceGetVariablesResponse, ProcessInstanceGetVariablesOptions } from 'uipath-sdk';

/**
 * Fetch all Maestro processes
 */
export function useUiPathMaestroProcesses(): UseQueryResult<RawMaestroProcessGetAllResponse[], Error> {
	return useQuery({
		queryKey: ['uipath', 'maestro', 'processes'],
		queryFn: async (): Promise<RawMaestroProcessGetAllResponse[]> => {
			try {
				const result = await uipath.maestro.processes.getAll();
				if (Array.isArray(result)) {
					return result;
				}
				return (result as any).items || [];
			} catch (error) {
				console.error('Failed to fetch Maestro processes:', error);
				throw error;
			}
		},
		refetchInterval: 30000,
	});
}

/**
 * Fetch all Maestro process instances
 */
export function useUiPathMaestroInstances(): UseQueryResult<RawProcessInstanceGetResponse[], Error> {
	return useQuery({
		queryKey: ['uipath', 'maestro', 'instances'],
		queryFn: async (): Promise<RawProcessInstanceGetResponse[]> => {
			try {
				const result = await uipath.maestro.processes.instances.getAll();
				if (Array.isArray(result)) {
					return result;
				}
				return (result as any).items || [];
			} catch (error) {
				console.error('Failed to fetch Maestro instances:', error);
				throw error;
			}
		},
		refetchInterval: 10000, // More frequent for active monitoring
	});
}

/**
 * Mutation to pause a Maestro process instance
 */
export function usePauseMaestroInstance(): UseMutationResult<ProcessInstanceOperationResponse, Error, { instanceId: string; folderKey: string; comment?: string }> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			instanceId,
			folderKey,
			comment,
		}: {
			instanceId: string;
			folderKey: string;
			comment?: string;
		}): Promise<ProcessInstanceOperationResponse> => {
			const result = await uipath.maestro.processes.instances.pause(
				instanceId,
				folderKey,
				comment ? { comment } : undefined
			);
			return result.data;
		},
		onSuccess: () => {
			toast.success('Maestro instance paused');
			queryClient.invalidateQueries({ queryKey: ['uipath', 'maestro', 'instances'] });
		},
		onError: (error: Error) => {
			toast.error(`Failed to pause instance: ${error.message}`);
		},
	});
}

/**
 * Mutation to resume a Maestro process instance
 */
export function useResumeMaestroInstance(): UseMutationResult<ProcessInstanceOperationResponse, Error, { instanceId: string; folderKey: string; comment?: string }> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			instanceId,
			folderKey,
			comment,
		}: {
			instanceId: string;
			folderKey: string;
			comment?: string;
		}): Promise<ProcessInstanceOperationResponse> => {
			const result = await uipath.maestro.processes.instances.resume(
				instanceId,
				folderKey,
				comment ? { comment } : undefined
			);
			return result.data;
		},
		onSuccess: () => {
			toast.success('Maestro instance resumed');
			queryClient.invalidateQueries({ queryKey: ['uipath', 'maestro', 'instances'] });
		},
		onError: (error: Error) => {
			toast.error(`Failed to resume instance: ${error.message}`);
		},
	});
}

/**
 * Mutation to cancel a Maestro process instance
 */
export function useCancelMaestroInstance(): UseMutationResult<ProcessInstanceOperationResponse, Error, { instanceId: string; folderKey: string; comment?: string }> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			instanceId,
			folderKey,
			comment,
		}: {
			instanceId: string;
			folderKey: string;
			comment?: string;
		}): Promise<ProcessInstanceOperationResponse> => {
			const result = await uipath.maestro.processes.instances.cancel(
				instanceId,
				folderKey,
				comment ? { comment } : undefined
			);
			return result.data;
		},
		onSuccess: () => {
			toast.success('Maestro instance cancelled');
			queryClient.invalidateQueries({ queryKey: ['uipath', 'maestro', 'instances'] });
		},
		onError: (error: Error) => {
			toast.error(`Failed to cancel instance: ${error.message}`);
		},
	});
}

/**
 * Fetch a single Maestro process instance by ID
 *
 * @param instanceId - The unique identifier of the process instance
 * @param folderKey - The folder key where the instance resides
 * @param options - Optional query options
 */
export function useUiPathMaestroInstanceById(
	instanceId: string | undefined,
	folderKey: string | undefined,
	options?: { enabled?: boolean }
): UseQueryResult<RawProcessInstanceGetResponse, Error> {
	return useQuery({
		queryKey: ['uipath', 'maestro', 'instances', instanceId, folderKey],
		queryFn: async (): Promise<RawProcessInstanceGetResponse> => {
			if (!instanceId || !folderKey) {
				throw new Error('Instance ID and folder key are required');
			}

			try {
				const result = await uipath.maestro.processes.instances.getById(instanceId, folderKey);
				return result.data;
			} catch (error) {
				console.error(`Failed to fetch Maestro instance ${instanceId}:`, error);
				throw error;
			}
		},
		enabled: options?.enabled !== false && !!instanceId && !!folderKey,
		refetchInterval: 5000, // Frequent for real-time instance monitoring
	});
}

/**
 * Fetch BPMN diagram for a Maestro process instance
 *
 * Returns the BPMN XML diagram data for visualization.
 * The diagram shows the process flow with current execution status.
 *
 * @param instanceId - The unique identifier of the process instance
 * @param folderKey - The folder key where the instance resides
 * @param options - Optional query options
 */
export function useUiPathMaestroBpmnDiagram(
	instanceId: string | undefined,
	folderKey: string | undefined,
	options?: { enabled?: boolean }
): UseQueryResult<string, Error> {
	return useQuery({
		queryKey: ['uipath', 'maestro', 'bpmn', instanceId, folderKey],
		queryFn: async (): Promise<string> => {
			if (!instanceId || !folderKey) {
				throw new Error('Instance ID and folder key are required');
			}

			try {
				const result = await uipath.maestro.processes.instances.getBpmn(instanceId, folderKey);
				return result;
			} catch (error) {
				console.error(`Failed to fetch BPMN diagram for instance ${instanceId}:`, error);
				throw error;
			}
		},
		enabled: options?.enabled !== false && !!instanceId && !!folderKey,
		staleTime: 30000, // BPMN diagram structure doesn't change frequently
		refetchInterval: 10000, // Moderate refresh to update execution status in diagram
	});
}

/**
 * Fetch execution history for a Maestro process instance
 *
 * Returns detailed execution history including all runs, activities, and status changes.
 * This is a separate API call from getting the instance itself.
 *
 * @param instanceId - The unique identifier of the process instance
 * @param options - Optional query options
 */
export function useUiPathMaestroExecutionHistory(
	instanceId: string | undefined,
	options?: { enabled?: boolean }
): UseQueryResult<ProcessInstanceExecutionHistoryResponse[], Error> {
	return useQuery({
		queryKey: ['uipath', 'maestro', 'execution-history', instanceId],
		queryFn: async (): Promise<ProcessInstanceExecutionHistoryResponse[]> => {
			if (!instanceId) {
				throw new Error('Instance ID is required');
			}

			try {
				const result = await uipath.maestro.processes.instances.getExecutionHistory(instanceId);
				return result;
			} catch (error) {
				console.error(`Failed to fetch execution history for instance ${instanceId}:`, error);
				throw error;
			}
		},
		enabled: options?.enabled !== false && !!instanceId,
		refetchInterval: 5000, // Frequent updates for real-time execution tracking
	});
}

/**
 * Fetch global variables for a Maestro process instance
 *
 * Returns all global variables associated with the process instance.
 * Variables can be filtered by parent element ID if needed.
 *
 * // Result structure:
 * // - result.globalVariables: Array of GlobalVariableMetaData (id, name, type, elementId, source, value)
 * // - result.elements: Array of ElementMetaData (metadata about BPMN elements)
 * // - result.instanceId: The process instance ID
 * // - result.parentElementId: Optional parent element ID if filtered
 * @param instanceId - The unique identifier of the process instance
 * @param folderKey - The folder key where the instance resides
 * @param variableOptions - Optional parameters for filtering variables (e.g., parentElementId)
 * @param queryOptions - Optional React Query options
 */
export function useUiPathMaestroVariables(
	instanceId: string | undefined,
	folderKey: string | undefined,
	variableOptions?: ProcessInstanceGetVariablesOptions,
	queryOptions?: { enabled?: boolean }
): UseQueryResult<ProcessInstanceGetVariablesResponse, Error> {
	return useQuery({
		queryKey: ['uipath', 'maestro', 'variables', instanceId, folderKey, variableOptions],
		queryFn: async (): Promise<ProcessInstanceGetVariablesResponse> => {
			if (!instanceId || !folderKey) {
				throw new Error('Instance ID and folder key are required');
			}

			try {
				const result: ProcessInstanceGetVariablesResponse = await uipath.maestro.processes.instances.getVariables(
					instanceId,
					folderKey,
					variableOptions
				);
				
				return result;

			} catch (error) {
				console.error(`Failed to fetch variables for instance ${instanceId}:`, error);
				throw error;
			}
		},
		enabled: queryOptions?.enabled !== false && !!instanceId && !!folderKey,
		refetchInterval: 10000, // Moderate refresh for variable monitoring
	});
}

