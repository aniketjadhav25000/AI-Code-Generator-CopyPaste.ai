// import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// import ReactMarkdown from 'react-markdown';
// import TextareaAutosize from 'react-textarea-autosize';
// import {
//   FiCopy, FiCheck, FiZap, FiDownload, FiEye, FiXCircle
// } from 'react-icons/fi';

// import { motion } from 'framer-motion';
// import { apiPost } from '../services/api'; // Assuming this is correctly implemented
// import { useAppContext } from '../contexts/AppContext'; // Assuming this is correctly implemented
// import HeroSection from './Hero/Hero'; // Assuming this component exists

// const CodeGenerator = () => {
//   const promptRef = useRef(null);
//   const outputRef = useRef(null);
//   const { prompt, setPrompt, language, setLanguage, response, setResponse, loading, setLoading } = useAppContext();
//   const [previewMode, setPreviewMode] = useState('code'); // 'code' or 'markdown'
//   const [copied, setCopied] = useState(false);
//   const [charCount, setCharCount] = useState(prompt.length);
//   const [activeTab, setActiveTab] = useState('Front End'); // New state for active tab

//   // Constants for better readability
//   const MAX_PROMPT_LENGTH = 500;
//   const MIN_PROMPT_LENGTH = 10;

//   // Language categories and example prompts
//   const LANGUAGE_CATEGORIES = {
//     'Front End': {
//       languages: ['javascript', 'typescript', 'react', 'angular', 'nextjs', 'html', 'css'],
//       prompts: {
//         javascript: [
//           'Create a vanilla JavaScript component for a customizable dropdown menu',
//           'Implement a client-side form validation using JavaScript',
//           'Develop a simple JavaScript animation for a bouncing ball'
//         ],
//         typescript: [
//           'Create a TypeScript interface for a User with validation',
//           'Write a utility function in TypeScript to debounce API calls',
//           'Implement a TypeScript decorator for logging function calls'
//         ],
//         react: [
//           'Create a React functional component for a counter with increment/decrement buttons',
//           'Write a React component that fetches data from an API and displays it in a list',
//           'Implement a React Hook for managing form input states'
//         ],
//         angular: [
//           'Generate an Angular component for a user profile card',
//           'Create an Angular service to handle API requests and responses',
//           'Write an Angular directive for a custom tooltip'
//         ],
//         nextjs: [
//           'Build a Next.js page with server-side rendering (SSR) for a blog post',
//           'Create a Next.js API route for user registration',
//           'Implement a Next.js image optimization component'
//         ],
//         html: [
//           'Create an HTML5 page with semantic markup for a blog post',
//           'Write a responsive navigation bar with dropdown menus',
//           'Implement an HTML form with validation for user registration'
//         ],
//         css: [
//           'Create a CSS animation for a loading spinner',
//           'Write responsive CSS for a card grid layout',
//           'Implement a dark/light theme toggle using CSS variables'
//         ]
//       }
//     },
//     'Back End': {
//       languages: ['python', 'java', 'javascript', 'typescript', 'go', 'ruby', 'php', 'sql', 'bash', 'json', 'yaml'],
//       prompts: {
//         python: [
//           'Create a Python script to scrape news websites using BeautifulSoup',
//           'Write a Flask API endpoint that accepts JSON and returns processed data',
//           'Implement a Python class for a banking system with deposit/withdraw methods'
//         ],
//         java: [
//           'Create a Java Spring Boot REST API for a todo list',
//           'Write a Java program to read and process CSV files',
//           'Implement a multithreaded Java application for file processing'
//         ],
//         javascript: [
//           'Write a Node.js Express server with JWT authentication',
//           'Build a GraphQL API with Node.js and Apollo Server',
//           'Create a serverless function using AWS Lambda and Node.js'
//         ],
//         typescript: [
//           'Design a REST API with Node.js and TypeScript using Express',
//           'Implement a data access layer using TypeORM with TypeScript',
//           'Write a server-side validation middleware in TypeScript'
//         ],
//         go: [
//           'Create a Go microservice for user authentication',
//           'Write a Go program to process a large dataset from a CSV file',
//           'Implement a concurrent web server in Go'
//         ],
//         ruby: [
//           'Write a Ruby on Rails API for a blog application',
//           'Create a Ruby script to automate file operations',
//           'Implement a background job processor using Ruby and Sidekiq'
//         ],
//         php: [
//           'Build a Laravel API for an e-commerce platform',
//           'Write a PHP script to connect to a MySQL database and fetch data',
//           'Implement an authentication system using PHP and sessions'
//         ],
//         sql: [
//           'Write SQL queries for a library management system',
//           'Create a database schema for an online store',
//           'Implement complex joins for a reporting query'
//         ],
//         bash: [
//           'Write a bash script to backup files modified in the last 24 hours',
//           'Create a script to monitor disk usage and send email alerts',
//           'Implement a menu-driven bash script for system information'
//         ],
//         json: [
//           'Create a JSON schema for an e-commerce product',
//           'Write a sample JSON configuration for a web application',
//           'Implement a JSON structure for a social media post with comments'
//         ],
//         yaml: [
//           'Create a YAML configuration for a Docker compose file',
//           'Write a Kubernetes deployment YAML for a web app',
//           'Implement a CI/CD pipeline configuration in YAML'
//         ]
//       }
//     },
//     'DSA': {
//       languages: ['python', 'java', 'cpp', 'javascript'],
//       prompts: {
//         python: [
//           'Implement a Python function for a binary search tree (BST) insertion',
//           'Write a Python program to find the shortest path in a graph using Dijkstra\'s algorithm',
//           'Create a Python class for a linked list and add methods for insertion and deletion'
//         ],
//         java: [
//           'Implement a Java class for a `Stack` data structure using an array',
//           'Write a Java program to sort an array using Merge Sort',
//           'Create a Java function to check if a binary tree is balanced'
//         ],
//         cpp: [
//           'Write a C++ program to implement a linked list',
//           'Create a C++ function to perform a Depth-First Search (DFS) on a graph',
//           'Implement a C++ class for a hash map'
//         ],
//         javascript: [
//           'Implement a JavaScript function for a Queue data structure',
//           'Write a JavaScript function to reverse a linked list iteratively',
//           'Create a JavaScript function to find all permutations of a string'
//         ]
//       }
//     }
//   };

//   // Default prompts if language/category not found
//   const DEFAULT_PROMPTS = [
//     'Build a CLI tool to rename files in a directory',
//     'Create an API endpoint to upload files and return stats',
//     'Write a component for a customizable button with CSS'
//   ];

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     promptRef.current?.focus();
//   }, []);

//   useEffect(() => {
//     if (response && outputRef.current) {
//       outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   }, [response]);

//   // Handle tab change
//   useEffect(() => {
//     const selectedCategory = LANGUAGE_CATEGORIES[activeTab];
//     if (selectedCategory) {
//       // Set the first language of the selected category as default
//       const defaultLangForTab = selectedCategory.languages[0];
//       setLanguage(defaultLangForTab);
//       // Set an example prompt for the newly selected language
//       const prompts = selectedCategory.prompts[defaultLangForTab] || DEFAULT_PROMPTS;
//       const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
//       setPrompt(randomPrompt);
//       setCharCount(randomPrompt.length);
//     }
//   }, [activeTab]); // Rerun when activeTab changes

//   const handleSubmit = async () => {
//     if (!prompt.trim()) return toast.error('Please enter a prompt');
//     if (prompt.length < MIN_PROMPT_LENGTH) return toast.error(`Prompt should be at least ${MIN_PROMPT_LENGTH} characters`);

//     setLoading(true);
//     setResponse(''); // Clear previous response

//     try {
//       const toastId = toast.loading('Generating code...', { style: { minWidth: '250px' } });

//       // --- CRUCIAL PART: Engineering the prompt for structured output ---
//       // This instructs the AI on *how* to format its response using Markdown.
//       const engineeredPrompt = `You are an expert ${language} developer.
// Based on the following user request, please provide the code, followed by a brief explanation of how it works and any key considerations.
// Format your response using **Markdown**.
// Start with a **level 2 heading** for the code title (e.g., "## React Counter Component").
// Then, provide a **paragraph description** of the code's purpose.
// The code itself **must be in a fenced code block** with the correct language tag (e.g., \`\`\`${language}\`\`\`).
// After the code, include a "**How it Works**" section (level 3 heading, e.g., "### How it Works") with **bullet points** explaining the main parts.
// Finally, add a "**Considerations**" section (level 3 heading, e.g., "### Considerations") for any important notes or how to use the code.

// User request: "${prompt}"`;
//       // ---------------------------------------------------------------------

//       const res = await axios.post('http://localhost:8000/generate_code', {
//         prompt: engineeredPrompt, // Use the engineered prompt
//         language // Still send language for backend context if needed
//       });

//       const result = res.data.code || res.data.result || 'No output generated';
//       setResponse(result);

//       // Save to MongoDB history WITH result
//       await apiPost('/history', { query: prompt, result, language });

//       // Save code snippet (optional title)
//       const shortTitle = prompt.length > 40 ? prompt.slice(0, 40) + '...' : prompt;
//       await apiPost('/code', { title: shortTitle, code: result, language });

//       toast.success('✅ Code generated!', { id: toastId });
//     } catch (err) {
//       console.error("Code generation error:", err);
//       toast.error('❌ Failed to generate code. Please try again.');
//       setResponse('❌ Error connecting to backend service or generating code. Check your network or try a different prompt. The AI might also struggle with very complex or ambiguous requests.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExamplePrompt = () => {
//     const currentCategoryPrompts = LANGUAGE_CATEGORIES[activeTab]?.prompts[language] || DEFAULT_PROMPTS;
//     const randomPrompt = currentCategoryPrompts[Math.floor(Math.random() * currentCategoryPrompts.length)];
//     setPrompt(randomPrompt);
//     setCharCount(randomPrompt.length);
//     promptRef.current?.focus();
//   };

//   const handleClearPrompt = () => {
//     setPrompt('');
//     setCharCount(0);
//     promptRef.current?.focus();
//   };

//   const handleCopy = () => {
//     if (!response) return;
//     navigator.clipboard.writeText(response);
//     toast.success('📋 Copied to clipboard!');
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const downloadCode = () => {
//     if (!response) return;
//     // Attempt to extract the first code block if the response is markdown, otherwise use full response
//     let codeContentToDownload = response;
//     const codeBlockMatch = response.match(/```(?:\w+)?\n([\s\S]*?)\n```/);
//     if (codeBlockMatch && codeBlockMatch[1]) {
//       codeContentToDownload = codeBlockMatch[1].trim();
//     }

//     const ext = {
//       python: 'py', javascript: 'js', java: 'java', typescript: 'ts',
//       cpp: 'cpp', html: 'html', css: 'css', bash: 'sh',
//       json: 'json', yaml: 'yaml', sql: 'sql', go: 'go', ruby: 'rb', php: 'php',
//       react: 'jsx', angular: 'ts', nextjs: 'js'
//     }[language] || 'txt';
//     const blob = new Blob([codeContentToDownload], { type: 'text/plain' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = `generated-code.${ext}`;
//     link.click();
//     toast.success('🔽 Code downloaded!');
//   };

//   const availableLanguages = LANGUAGE_CATEGORIES[activeTab]?.languages || [];

//   return (
//     <>
//       {/* <HeroSection /> */}

//       <div className="max-w-4xl mx-auto p-8 my-10 rounded-3xl shadow-2xl
//                       bg-gray-800/30 backdrop-blur-sm
//                       border border-gray-700/30 text-white
//                       transform transition-all duration-300 ease-in-out
//                       hover:scale-[1.005] hover:shadow-3xl" id='code-generator'>

//         <h2 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600 drop-shadow-lg">
//           AI Code Generator
//         </h2>

//         {/* Tabs Section */}
//         <div className="flex justify-center mb-8 flex-wrap gap-2">
//           {Object.keys(LANGUAGE_CATEGORIES).map((tabName) => (
//             <button
//               key={tabName}
//               onClick={() => setActiveTab(tabName)}
//               className={`px-6 py-3 text-lg font-medium rounded-full transition-all duration-300 ease-in-out
//                           ${activeTab === tabName
//                               ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
//                               : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
//                           }`}
//             >
//               {tabName}
//             </button>
//           ))}
//         </div>
//         {/* End Tabs Section */}

//         {/* Input Prompt Section */}
//         <div className="mb-8 relative">
//           <label htmlFor="prompt-input" className="block text-lg font-medium text-gray-300 mb-3">
//             What code do you need?
//           </label>
//           <div className="relative">
//             <TextareaAutosize
//               id="prompt-input"
//               minRows={4}
//               ref={promptRef}
//               value={prompt}
//               onChange={(e) => {
//                 setPrompt(e.target.value);
//                 setCharCount(e.target.value.length);
//               }}
//               placeholder={`e.g., Create a ${language} script to...\n\nTips: Be specific! Include desired libraries, inputs, and outputs.`}
//               className="w-full p-4 pr-10 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 resize-none
//                          focus:ring-2 focus:ring-indigo-500 focus:border-transparent
//                          transition duration-200 ease-in-out font-mono text-sm shadow-inner backdrop-blur-sm"
//               maxLength={MAX_PROMPT_LENGTH}
//             />
//             {prompt.length > 0 && (
//               <button
//                 onClick={handleClearPrompt}
//                 className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-colors duration-200"
//                 title="Clear prompt"
//               >
//                 <FiXCircle size={20} />
//               </button>
//             )}
//           </div>
//           <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
//             <span>
//               {charCount}/{MAX_PROMPT_LENGTH} characters
//             </span>
//             <button
//               onClick={handleExamplePrompt}
//               className="flex items-center gap-2 text-sm bg-gray-700/50 hover:bg-gray-600/50 text-white px-4 py-2 rounded-full transition duration-200 ease-in-out shadow-md backdrop-blur-sm"
//             >
//               <FiZap className="text-yellow-300" /> Get {language} prompt Example
//             </button>
//           </div>
//         </div>

//         {/* Language Selection & Generate Button */}
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
//           <div className="flex items-center gap-4">
//             <label htmlFor="language-select" className="text-gray-300 font-medium">Target Language:</label>
//             <div className="relative">
//               <select
//                 id="language-select"
//                 value={language}
//                 onChange={(e) => setLanguage(e.target.value)}
//                 className="p-3 bg-gray-800/50 text-white border border-gray-600/50 rounded-lg appearance-none pr-10 cursor-pointer
//                            focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out
//                            hover:border-indigo-500 shadow-sm backdrop-blur-sm"
//               >
//                 {availableLanguages.map((lang) => (
//                   <option key={lang} value={lang}>
//                     {lang.charAt(0).toUpperCase() + lang.slice(1)}
//                   </option>
//                 ))}
//               </select>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
//                 <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z" /></svg>
//               </div>
//             </div>
//           </div>

//           <motion.button
//             onClick={handleSubmit}
//             disabled={loading}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600
//                        hover:from-indigo-600 hover:to-purple-700 text-white text-xl font-bold px-10 py-3 rounded-full shadow-lg
//                        transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
//                        transform active:scale-98 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
//           >
//             {loading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <FiZap className="text-white" /> Generate Code
//               </>
//             )}
//           </motion.button>
//         </div>

//         {/* Output Section */}
//         {response && (
//           <motion.div
//             ref={outputRef}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="mt-8 relative bg-gray-900/40 p-6 rounded-lg shadow-xl border border-gray-700/30 backdrop-blur-sm"
//           >
//             <div className="flex justify-between items-center mb-4 border-b border-gray-700/50 pb-3">
//               <h3 className="text-2xl font-bold text-purple-300">Generated Code/Explanation</h3>
//               <div className="flex gap-3">
//                 <button
//                   onClick={handleCopy}
//                   className="flex items-center gap-1 bg-gray-700/50 hover:bg-gray-600/50 text-white px-3 py-1 text-sm rounded-md transition duration-200 ease-in-out group shadow-sm backdrop-blur-sm"
//                   title="Copy Code/Markdown"
//                 >
//                   {copied ? <FiCheck className="text-green-400 group-hover:text-green-300" /> : <FiCopy className="group-hover:text-indigo-300" />}
//                   <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
//                 </button>
//                 <button
//                   onClick={downloadCode}
//                   className="flex items-center gap-1 bg-gray-700/50 hover:bg-gray-600/50 text-white px-3 py-1 text-sm rounded-md transition duration-200 ease-in-out group shadow-sm backdrop-blur-sm"
//                   title="Download Code"
//                 >
//                   <FiDownload className="group-hover:text-indigo-300" /> <span className="hidden sm:inline">Download</span>
//                 </button>
//                 <button
//                   onClick={() => setPreviewMode(previewMode === 'code' ? 'markdown' : 'code')}
//                   className="flex items-center gap-1 bg-gray-700/50 hover:bg-gray-600/50 text-white px-3 py-1 text-sm rounded-md transition duration-200 ease-in-out group shadow-sm backdrop-blur-sm"
//                   title={previewMode === 'code' ? 'Switch to Markdown View' : 'Switch to Code View'}
//                 >
//                   <FiEye className="group-hover:text-indigo-300" />
//                   <span className="hidden sm:inline">{previewMode === 'code' ? 'Markdown' : 'Code'}</span>
//                 </button>
//               </div>
//             </div>

//             {previewMode === 'code' ? (
//               // This attempts to show only the code block if the AI returns markdown.
//               // If not markdown, it shows the full response with basic highlighting.
//               <SyntaxHighlighter
//                 language={language}
//                 style={oneDark}
//                 showLineNumbers
//                 customStyle={{
//                   backgroundColor: '#111827',
//                   padding: '1.5rem',
//                   borderRadius: '0.5rem',
//                   fontSize: '0.9rem',
//                   overflowX: 'auto',
//                   border: '1px solid #4B5563',
//                 }}
//                 wrapLines
//               >
//                 {/* Extracts content from the first fenced code block if available, else uses raw response */}
//                 {response.match(/```(?:\w+)?\n([\s\S]*?)\n```/)?.[1] || response}
//               </SyntaxHighlighter>
//             ) : (
//               <div className="prose prose-invert max-w-none text-base bg-gray-900/50 p-5 rounded-md border border-gray-700/30 leading-relaxed shadow-inner backdrop-blur-sm">
//                 <ReactMarkdown
//                   components={{
//                     // Custom renderer for code blocks within Markdown
//                     code({ node, inline, className, children, ...props }) {
//                       const match = /language-(\w+)/.exec(className || '')
//                       return !inline && match ? (
//                         <SyntaxHighlighter
//                           style={oneDark}
//                           language={match[1]}
//                           PreTag="div"
//                           {...props}
//                           customStyle={{
//                             backgroundColor: '#1F2937',
//                             padding: '1em',
//                             borderRadius: '0.375rem',
//                             margin: '1em 0',
//                             overflowX: 'auto',
//                           }}
//                         >
//                           {String(children).replace(/\n$/, '')}
//                         </SyntaxHighlighter>
//                       ) : (
//                         // Inline code styling
//                         <code className={className + " bg-gray-700/50 text-gray-200 rounded px-1 py-0.5 text-sm"} {...props}>
//                           {children}
//                         </code>
//                       )
//                     },
//                     // Ensures links open in a new tab for security and user experience
//                     a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
//                   }}
//                 >
//                   {response}
//                 </ReactMarkdown>
//               </div>
//             )}
//           </motion.div>
//         )}
//       </div>
//     </>
//   );
// };

// export default CodeGenerator;