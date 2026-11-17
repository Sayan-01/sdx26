import React from "react";
import { Callout, Step, CodeBlock, Badge } from "./ui";

interface DocContentRendererProps {
  content: string;
}

// Helper to process inline markdown: bold (**...**), inline code (`...`), links ([...](...)), and status badges ([STATUS:...])
function renderInline(text: string): React.ReactNode {
  if (!text) return null;

  const regex = /(\[STATUS:\w+\]|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;
  const parts = text.split(regex);

  if (parts.length === 1) {
    if (text.includes("\n")) {
      const subLines = text.split("\n");
      return subLines.map((sub, sIdx) => (
        <React.Fragment key={sIdx}>
          {sIdx > 0 && <br />}
          {sub}
        </React.Fragment>
      ));
    }
    return text;
  }

  return parts.map((part, index) => {
    if (!part) return null;

    // Status Badge: [STATUS:PAID]
    const statusMatch = part.match(/^\[STATUS:(\w+)\]$/);
    if (statusMatch) {
      const status = statusMatch[1];
      const variant =
        status === "PAID" || status === "APPROVED" || status === "SUCCESS"
          ? "success"
          : status === "PENDING" || status === "IN_REVIEW" || status === "IN_PROGRESS"
          ? "warning"
          : status === "ERROR" || status === "REJECTED"
          ? "error"
          : "default";
      return (
        <Badge key={index} variant={variant as any}>
          {status}
        </Badge>
      );
    }

    // Bold text: **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      const innerText = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold text-white">
          {renderInline(innerText)}
        </strong>
      );
    }

    // Inline code: `code`
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      const innerCode = part.slice(1, -1);
      return (
        <code
          key={index}
          className="bg-zinc-800 text-indigo-400 px-1.5 py-0.5 rounded font-mono text-[13px] border border-zinc-700/50"
        >
          {innerCode}
        </code>
      );
    }

    // Markdown Links: [text](href)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkHref = linkMatch[2];
      const isExternal = linkHref.startsWith("http");
      return (
        <a
          key={index}
          href={linkHref}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors font-medium"
        >
          {renderInline(linkText)}
        </a>
      );
    }

    // Plain text (with potential newlines)
    if (part.includes("\n")) {
      const subLines = part.split("\n");
      return subLines.map((sub, sIdx) => (
        <React.Fragment key={`${index}-${sIdx}`}>
          {sIdx > 0 && <br />}
          {sub}
        </React.Fragment>
      ));
    }

    return part;
  });
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
      elements.push(<h2 key={i} id={id} className="text-2xl font-bold text-white mt-12 mb-6 tracking-tight">{renderInline(text)}</h2>);
    } else if (line.startsWith("### ")) {
      const text = line.replace("### ", "");
      const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
      elements.push(<h3 key={i} id={id} className="text-xl font-bold text-white mt-8 mb-4 tracking-tight">{renderInline(text)}</h3>);
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
              <span className="leading-relaxed">{renderInline(item)}</span>
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
                <span className="leading-relaxed">{renderInline(item)}</span>
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
                      {renderInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {rows.slice(1).map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/20 transition-colors">
                    {row.map((cell, cidx) => (
                      <td key={cidx} className="px-5 py-4 text-zinc-400 leading-relaxed font-medium">
                        {renderInline(cell)}
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
      elements.push(<Callout key={i} type={type}>{renderInline(calloutContent.trim())}</Callout>);
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
      elements.push(
        <p key={i} className="text-zinc-400 text-sm leading-relaxed my-6">
          {renderInline(line)}
        </p>
      );
    }

    i++;
  }

  return <div className="docs-content">{elements}</div>;
}
