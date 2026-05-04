import React from "react";
import { Callout, Step, CodeBlock, Badge } from "./ui";

interface DocContentRendererProps {
  content: string;
}

export function DocContentRenderer({ content }: DocContentRendererProps) {
  // A simple way to render the documentation content with support for custom components
  // and basic markdown-like structures.
  
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  
  let i = 0;
  while (i < lines.length) {
    let line = lines[i].trim();
    
    // Skip empty lines at start
    if (!line && elements.length === 0) {
      i++;
      continue;
    }

    // Headers
    if (line.startsWith("## ")) {
      const text = line.replace("## ", "");
      const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
      elements.push(<h2 key={i} id={id} className="text-2xl font-bold text-white mt-12 mb-6 tracking-tight">{text}</h2>);
    } else if (line.startsWith("### ")) {
      const text = line.replace("### ", "");
      const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
      elements.push(<h3 key={i} id={id} className="text-xl font-bold text-white mt-8 mb-4 tracking-tight">{text}</h3>);
    }
    
    // Unordered Lists
    else if (line.startsWith("- ")) {
      const items = [];
      while (i < lines.length && (lines[i].trim().startsWith("- ") || !lines[i].trim())) {
        if (lines[i].trim().startsWith("- ")) {
          items.push(lines[i].trim().replace("- ", ""));
        }
        i++;
      }
      elements.push(
        <ul key={i} className="space-y-2 my-6 list-none p-0">
          {items.map((item, idx) => (
            <li key={idx} className="text-zinc-400 text-sm flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered Lists (Simplified)
    else if (/^\d+\. /.test(line)) {
        const items = [];
        while (i < lines.length && (/^\d+\. /.test(lines[i].trim()) || !lines[i].trim())) {
          if (/^\d+\. /.test(lines[i].trim())) {
            items.push(lines[i].trim().replace(/^\d+\. /, ""));
          }
          i++;
        }
        elements.push(
          <ol key={i} className="space-y-4 my-6 list-none p-0">
            {items.map((item, idx) => (
              <li key={idx} className="text-zinc-400 text-sm flex gap-4">
                <span className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">{idx + 1}</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>
        );
        continue;
      }

    // Tables
    else if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        if (!lines[i].includes("---")) { // Skip separator
          rows.push(lines[i].split("|").filter(c => c.trim() !== "").map(c => c.trim()));
        }
        i++;
      }
      if (rows.length > 0) {
        elements.push(
          <div key={i} className="my-8 rounded-xl border border-zinc-800 overflow-hidden bg-[#151518]">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-900/50 border-b border-zinc-800">
                  {rows[0].map((cell, idx) => (
                    <th key={idx} className="px-5 py-4 font-bold text-zinc-300 uppercase tracking-widest text-[10px]">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {rows.slice(1).map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/20 transition-colors">
                    {row.map((cell, cidx) => (
                      <td key={cidx} className="px-5 py-4 text-zinc-400 leading-relaxed font-medium">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Callouts
    else if (line.startsWith("> [!")) {
      const type = line.match(/> \[!(\w+)\]/)?.[1].toLowerCase() as any;
      let calloutContent = "";
      i++;
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        calloutContent += lines[i].trim().replace(/^>\s?/, "") + "\n";
        i++;
      }
      elements.push(<Callout key={i} type={type}>{calloutContent.trim()}</Callout>);
      continue;
    }

    // Code Blocks
    else if (line.startsWith("```")) {
      const lang = line.replace("```", "").trim();
      let code = "";
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code += lines[i] + "\n";
        i++;
      }
      elements.push(<CodeBlock key={i} code={code.trim()} language={lang} />);
    }

    // Paragraphs with inline support
    else if (line) {
      // Process inline elements: Badges, Bold, Code
      const processInline = (text: string) => {
        // Handle [STATUS:TYPE]
        const statusMatch = text.match(/\[STATUS:(\w+)\]/);
        if (statusMatch) {
          const status = statusMatch[1];
          const variant = (status === 'PAID' || status === 'APPROVED' || status === 'SUCCESS') ? 'success' : 
                          (status === 'PENDING' || status === 'IN_REVIEW' || status === 'IN_PROGRESS') ? 'warning' : 
                          (status === 'ERROR' || status === 'REJECTED') ? 'error' : 'default';
          
          const parts = text.split(statusMatch[0]);
          return (
            <>
              {parts[0]}
              <Badge variant={variant as any}>{status}</Badge>
              {parts[1]}
            </>
          );
        }

        // Inline code blocks
        if (text.includes("`")) {
          const parts = text.split("`").map((part, idx) => 
            idx % 2 === 1 ? <code key={idx} className="bg-zinc-800 text-indigo-400 px-1.5 py-0.5 rounded font-mono text-[13px]">{part}</code> : part
          );
          return <>{parts}</>;
        }

        return text;
      };

      elements.push(<p key={i} className="text-zinc-400 text-sm leading-relaxed my-6">{processInline(line)}</p>);
    }

    i++;
  }

  return <div className="docs-content">{elements}</div>;
}
