'use client';

import { useState } from 'react';
import { Bot, Sparkles, Download, Code } from 'lucide-react';
import { generateUiAction } from '@/app/actions';
import { CodePreview } from '@/components/app/code-preview';
import { CodeExport } from '@/components/app/code-export';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader } from '@/components/app/loader';

const examplePrompts = [
  'A login form with email and password fields, and a "Sign In" button.',
  'A user profile card with an avatar, name, username, and a short bio.',
  'A dashboard sidebar with navigation links for "Home", "Analytics", and "Settings".',
  'A simple bar chart showing sales data for the last 6 months.',
];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePromptClick = (text: string) => {
    setPrompt(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) {
      toast({
        title: 'Prompt is empty',
        description: 'Please enter a description for the UI you want to generate.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setGeneratedCode(null);
    try {
      const result = await generateUiAction(prompt);
      if (result.error) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
        setGeneratedCode(null);
      } else {
        setGeneratedCode(result.generatedCode || null);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      setGeneratedCode(null);
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full min-h-screen">
        <div className="flex flex-col p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Bot className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-2xl font-bold font-headline">UI Geni</h1>
              <p className="text-muted-foreground">Describe the UI you want, and I'll generate it.</p>
            </div>
          </div>
          
          <Card className="flex-grow flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <span>Describe your component</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow gap-4">
              <form onSubmit={handleSubmit} className="flex flex-col flex-grow gap-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A pricing page with three tiers..."
                  className="flex-grow text-base resize-none"
                  rows={6}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isLoading ? (
                    <>
                      <Loader />
                      Generating...
                    </>
                  ) : (
                    'Generate UI'
                  )}
                </Button>
              </form>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Or try an example:</p>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((p, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePromptClick(p)}
                      disabled={isLoading}
                    >
                      {p.slice(0, 20)}...
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col p-4 sm:p-6 lg:p-8">
          <Card className="flex-grow flex flex-col relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  <span>Live Preview</span>
                </CardTitle>
                <CardDescription>Your generated component will appear here.</CardDescription>
              </div>
              {generatedCode && !isLoading && <CodeExport code={generatedCode} />}
            </CardHeader>
            <CardContent className="flex-grow bg-background rounded-b-lg">
              <CodePreview code={generatedCode} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
