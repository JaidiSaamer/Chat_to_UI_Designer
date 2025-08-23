'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CodeExportProps = {
  code: string;
};

export function CodeExport({ code }: CodeExportProps) {
  const { toast } = useToast();

  const handleExport = () => {
    try {
      const blob = new Blob([code], { type: 'text/jsx;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ui-geni-component.jsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: 'Export successful',
        description: 'Your component has been downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Could not export the component.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export Code
    </Button>
  );
}
