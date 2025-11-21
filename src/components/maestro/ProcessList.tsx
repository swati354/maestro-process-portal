import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ChevronRight, Workflow, Package } from 'lucide-react';
import type { RawMaestroProcessGetAllResponse } from 'uipath-sdk';

interface ProcessListProps {
    processes: RawMaestroProcessGetAllResponse[];
    isLoading: boolean;
    onProcessSelect: (process: RawMaestroProcessGetAllResponse) => void;
    onRefresh: () => void;
}

export function ProcessList({ processes, isLoading, onProcessSelect, onRefresh }: ProcessListProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    {processes.length} {processes.length === 1 ? 'process' : 'processes'} found
                </p>
                <Button onClick={onRefresh} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {processes.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Workflow className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-semibold mb-2">No Maestro processes found</p>
                        <p className="text-sm text-muted-foreground">
                            Create Maestro processes in UiPath Studio to see them here.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {processes.map((process) => (
                        <Card
                            key={process.processKey}
                            className="hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => onProcessSelect(process)}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                            <Workflow className="h-4 w-4" />
                                            {process.name}
                                        </CardTitle>
                                        <CardDescription className="mt-2 flex items-center gap-2">
                                            <Package className="h-3 w-3" />
                                            <span className="font-mono text-xs">{process.packageId}</span>
                                        </CardDescription>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Folder:</span>
                                        <span className="font-medium">{process.folderName}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Versions:</span>
                                        <Badge variant="secondary">{process.versionCount}</Badge>
                                    </div>

                                    <div className="pt-3 border-t">
                                        <p className="text-xs text-muted-foreground mb-2">Instance Status</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            {process.runningCount > 0 && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-muted-foreground">Running:</span>
                                                    <Badge variant="default" className="bg-blue-500">
                                                        {process.runningCount}
                                                    </Badge>
                                                </div>
                                            )}
                                            {process.completedCount > 0 && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-muted-foreground">Completed:</span>
                                                    <Badge variant="default" className="bg-green-500">
                                                        {process.completedCount}
                                                    </Badge>
                                                </div>
                                            )}
                                            {process.faultedCount > 0 && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-muted-foreground">Faulted:</span>
                                                    <Badge variant="destructive">
                                                        {process.faultedCount}
                                                    </Badge>
                                                </div>
                                            )}
                                            {process.pendingCount > 0 && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-muted-foreground">Pending:</span>
                                                    <Badge variant="secondary">
                                                        {process.pendingCount}
                                                    </Badge>
                                                </div>
                                            )}
                                            {process.pausedCount > 0 && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-muted-foreground">Paused:</span>
                                                    <Badge variant="outline">
                                                        {process.pausedCount}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}