import { useState } from 'react';
import { ProcessList } from '@/components/maestro/ProcessList';
import { InstanceList } from '@/components/maestro/InstanceList';
import { InstanceDetail } from '@/components/maestro/InstanceDetail';
import { useUiPathMaestroProcesses, useUiPathMaestroInstances, useUiPathMaestroVariables } from '@/hooks/useUiPathMaestro';
import { AlertCircle, Workflow, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import type { RawMaestroProcessGetAllResponse, RawProcessInstanceGetResponse } from 'uipath-sdk';

type ViewState =
    | { level: 'processes' }
    | { level: 'instances'; process: RawMaestroProcessGetAllResponse }
    | { level: 'detail'; process: RawMaestroProcessGetAllResponse; instance: RawProcessInstanceGetResponse };

export function HomePage() {
    const [viewState, setViewState] = useState<ViewState>({ level: 'processes' });

    const { data: processes, isLoading: loadingProcesses, error: processError, refetch: refetchProcesses } = useUiPathMaestroProcesses();
    const { data: allInstances, isLoading: loadingInstances, error: instanceError, refetch: refetchInstances } = useUiPathMaestroInstances();

    const handleProcessSelect = (process: RawMaestroProcessGetAllResponse) => {
        setViewState({ level: 'instances', process });
    };

    const handleInstanceSelect = (instance: RawProcessInstanceGetResponse) => {
        if (viewState.level === 'instances') {
            setViewState({ level: 'detail', process: viewState.process, instance });
        }
    };

    const handleBackToProcesses = () => {
        setViewState({ level: 'processes' });
    };

    const handleBackToInstances = () => {
        if (viewState.level === 'detail') {
            setViewState({ level: 'instances', process: viewState.process });
        }
    };

    // Filter instances for selected process
    const processInstances = viewState.level !== 'processes' && allInstances
        ? allInstances.filter(inst => inst.processKey === viewState.process.processKey)
        : [];

    const error = processError || instanceError;

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                <ThemeToggle />
                <div className="max-w-7xl mx-auto p-6 space-y-6">
                    {/* Header */}
                    <header className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {viewState.level !== 'processes' && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={viewState.level === 'instances' ? handleBackToProcesses : handleBackToInstances}
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                )}
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                    <Workflow className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold">
                                        {viewState.level === 'processes' && 'Maestro Process Portal'}
                                        {viewState.level === 'instances' && viewState.process.name}
                                        {viewState.level === 'detail' && viewState.instance.instanceDisplayName}
                                    </h1>
                                    <p className="text-muted-foreground">
                                        {viewState.level === 'processes' && 'Browse and monitor your Maestro process orchestrations'}
                                        {viewState.level === 'instances' && 'View all instances for this process'}
                                        {viewState.level === 'detail' && 'Detailed execution information and BPMN diagram'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                Failed to load data: {(error as Error).message}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Content */}
                    {viewState.level === 'processes' && (
                        <ProcessList
                            processes={processes || []}
                            isLoading={loadingProcesses}
                            onProcessSelect={handleProcessSelect}
                            onRefresh={refetchProcesses}
                        />
                    )}

                    {viewState.level === 'instances' && (
                        <InstanceList
                            instances={processInstances}
                            isLoading={loadingInstances}
                            onInstanceSelect={handleInstanceSelect}
                            onRefresh={refetchInstances}
                        />
                    )}

                    {viewState.level === 'detail' && (
                        <InstanceDetail
                            instance={viewState.instance}
                            processKey={viewState.process.processKey}
                            folderKey={'8645d674-92d8-4281-9aef-43f3e3608ded' || viewState.process.folderKey}
                        />
                    )}
                </div>
                <Toaster richColors closeButton />
            </div>
        </AppLayout>
    );
}