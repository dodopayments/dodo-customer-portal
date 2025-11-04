import React from "react";
import ReactMarkdown from "react-markdown";
const ProductMarkdownDescription = ({
  description,
}: {
  description: string;
}) => {
  return (
    <div className="text-text-secondary text-wrap text-xs max-w-md">
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="text-text-secondary text-xs">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-medium text-text-primary">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => (
            <ul className="list-disc list-inside my-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside my-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-text-secondary text-xs">{children}</li>
          ),
          a: ({ children, href }) => (
            <a href={href} className="text-primary hover:underline">
              {children}
            </a>
          ),
        }}
      >
        {description}
      </ReactMarkdown>
    </div>
  );
};

export default ProductMarkdownDescription;
