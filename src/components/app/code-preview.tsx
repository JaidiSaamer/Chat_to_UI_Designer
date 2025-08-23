'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Loader } from './loader';
import { Bot } from 'lucide-react';

type CodePreviewProps = {
  code: string | null;
  isLoading: boolean;
};

export function CodePreview({ code, isLoading }: CodePreviewProps) {

  const iframeContent = useMemo(() => {
    if (!code) return '';

    const componentNameMatch = code.match(/(?:function|const)\s+([A-Z]\w*)/);
    let componentToRender = componentNameMatch ? componentNameMatch[1] : null;

    let processedCode = code
      .replace(/export default\s*/, '')
      .replace(/import.*from.*/g, '');

    if (!componentToRender) {
      // If no component name is found (e.g., arrow function export default),
      // we wrap it to create a component.
      processedCode = `const GeneratedComponent = () => { return (${processedCode}); };`;
      componentToRender = 'GeneratedComponent';
    }


    const html = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script src="https://unpkg.com/recharts/umd/Recharts.min.js"></script>
          <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body { 
              background-color: hsl(var(--background));
              color: hsl(var(--foreground));
              font-family: 'Inter', sans-serif;
              padding: 1rem; 
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              box-sizing: border-box;
            }
            :root {
              --background: 210 17% 95%; --foreground: 222.2 84% 4.9%;
              --card: 210 17% 100%; --card-foreground: 222.2 84% 4.9%;
              --popover: 210 17% 100%; --popover-foreground: 222.2 84% 4.9%;
              --primary: 172 69% 56%; --primary-foreground: 172 69% 16%;
              --secondary: 210 40% 96.1%; --secondary-foreground: 222.2 47.4% 11.2%;
              --muted: 210 40% 96.1%; --muted-foreground: 215.4 16.3% 46.9%;
              --accent: 199 66% 60%; --accent-foreground: 210 17% 100%;
              --destructive: 0 84.2% 60.2%; --destructive-foreground: 210 40% 98%;
              --border: 214.3 31.8% 91.4%; --input: 214.3 31.8% 91.4%;
              --ring: 199 66% 60%;
              --radius: 0.5rem;
            }
          </style>
        </head>
        <body>
          <div id="root" class="w-full"></div>
          <script type="text/babel">
            const { useState, useEffect, useCallback, useMemo, forwardRef } = React;
            
            // Mock Recharts and Lucide to be available globally
            const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } = window.Recharts || {};

            const LucideIcons = new Proxy({}, {
              get(target, name) {
                return (props) => {
                  const iconName = name.replace(/([A-Z])/g, (g) => \`-\${g[0].toLowerCase()}\`).toLowerCase();
                  useEffect(() => {
                    if (window.lucide) {
                      window.lucide.createIcons();
                    }
                  }, []);
                  const { className, ...rest } = props;
                  return React.createElement('i', { 'data-lucide': iconName, className: \`\${className || ''} inline-block\`, ...rest });
                }
              }
            });

            try {
              ${processedCode}
              ReactDOM.render(React.createElement(${componentToRender}), document.getElementById('root'));
            } catch (e) {
              console.error(e);
              const ErrorDisplay = () => <div style={{ color: 'red', padding: '1rem', border: '1px solid red', borderRadius: '0.5rem', backgroundColor: '#fff0f0' }}><h3>Preview Error</h3><p>{e.message}</p></div>;
              ReactDOM.render(<ErrorDisplay />, document.getElementById('root'));
            }
          </script>
        </body>
      </html>
    `;
    return html;
  }, [code]);

  return (
    <div className="w-full h-full bg-background rounded-lg relative">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <Loader />
          <p className="mt-4 text-muted-foreground">Generating component...</p>
        </div>
      )}
      {!code && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground p-4">
          <Bot className="w-16 h-16 mb-4 text-primary/30" />
          <h3 className="font-semibold text-lg">Your preview will appear here</h3>
          <p className="text-sm">Describe a component and click "Generate UI" to see it live.</p>
        </div>
      )}
      <iframe
        srcDoc={iframeContent}
        title="Code Preview"
        sandbox="allow-scripts"
        className="w-full h-full border-0 rounded-lg transition-opacity duration-300"
        style={{ opacity: isLoading || !code ? 0 : 1 }}
      />
    </div>
  );
}
