/**
 * AI Study Assistant Service
 * 
 * Provides mock implementations for AI capabilities:
 * - askAI: Interactive academic problem solver and concept explainer
 * - generateNotes: Structured notes with 7 core academic sections
 * - generateQuiz: Adaptive quizzes and diagnostic questions
 * - generateStudyPlan: Exam-aligned daily task schedule builder
 * 
 * Ready to connect to a real AI API endpoint (Gemini / OpenAI) via backend or direct API calls.
 */

// Get API key dynamically from environment
const getApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.VITE_GEMINI_API_KEY) return import.meta.env.VITE_GEMINI_API_KEY;
    if (import.meta.env.GEMINI_API_KEY) return import.meta.env.GEMINI_API_KEY;
  }
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.VITE_GEMINI_API_KEY) return process.env.VITE_GEMINI_API_KEY;
    if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  }
  return '';
};

// Simulated realistic response latency
const simulateDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Intelligent Mock Response Database for common academic student questions
 */
const knowledgeBase = {
  binarySearch: {
    keywords: ["binary search", "binarysearch", "divide and conquer search"],
    response: `### 🔍 Binary Search Explained Simply

**Binary Search** is an ultra-fast algorithm used to find an element in a **sorted array**. Instead of checking items one by one (like looking through a dictionary from page 1), it divides the search space in half at each step.

---

#### 💡 The Real-Life Analogy
Imagine guessing a number between **1 and 100**:
1. You guess **50**. The host says *"Too high!"*.
2. You now know the number is in \`[1, 49]\`. You guess **25**.
3. The host says *"Too low!"*.
4. You now search in \`[26, 49]\`. You cut the possibilities in half every single turn!

---

#### 💻 JavaScript / Python Implementation

\`\`\`javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid; // Element found at index mid!
    } else if (arr[mid] < target) {
      left = mid + 1; // Search in the right half
    } else {
      right = mid - 1; // Search in the left half
    }
  }

  return -1; // Element not found
}
\`\`\`

---

#### ⏱️ Time & Space Complexity
* **Time Complexity**: $\\mathcal{O}(\\log N)$ (searching 1,000,000 elements takes only $\\approx 20$ comparisons!)
* **Space Complexity**: $\\mathcal{O}(1)$ iterative, $\\mathcal{O}(\\log N)$ recursive.
* **Prerequisite**: The array **MUST be sorted** first.`,
  },

  recursion: {
    keywords: ["recursion", "recursive", "base case", "factorial"],
    response: `### 🔁 Recursion Explained with Clear Examples

**Recursion** in computer science is a technique where a function **calls itself** to solve a smaller subproblem of the same type, until it reaches a stopping point known as the **Base Case**.

---

#### 🧱 The Two Fundamental Rules of Recursion
1. **Base Case**: The condition that terminates recursion (prevents an infinite stack overflow).
2. **Recursive Step**: The logic where the function breaks down the problem and calls itself with a smaller input.

---

#### 🧮 Classic Example: Factorial of $N$ ($N!$)
Mathematically:
* $5! = 5 \\times 4!$
* $4! = 4 \\times 3!$
* $1! = 1$ (Base Case)

\`\`\`javascript
function factorial(n) {
  // 1. Base Case
  if (n <= 1) {
    return 1;
  }
  
  // 2. Recursive Step
  return n * factorial(n - 1);
}

console.log(factorial(5)); // Output: 120
\`\`\`

---

#### 🌲 How the Call Stack Operates
\`\`\`text
factorial(4)
  ↳ 4 * factorial(3)
        ↳ 3 * factorial(2)
              ↳ 2 * factorial(1)
                    ↳ returns 1 (Base case reached!)
\`\`\`
* **Pros**: Clean, elegant code for tree traversals, graph algorithms (DFS), and divide-and-conquer.
* **Cons**: Consumes memory on the call stack ($\\mathcal{O}(N)$ space).`,
  },

  dbmsQuestions: {
    keywords: ["dbms interview", "dbms questions", "database interview", "sql interview"],
    response: `### 🗄️ Top 10 Core DBMS & SQL Technical Interview Questions

Here are the most frequently asked DBMS questions with concise, interview-ready answers:

---

#### 1. What are ACID properties in DBMS?
* **Atomicity**: Either all operations succeed or none do (*All-or-Nothing*).
* **Consistency**: The database moves from one valid state to another valid state.
* **Isolation**: Concurrent transactions run without interfering with each other.
* **Durability**: Once a transaction is committed, changes survive system crashes.

---

#### 2. What is the difference between Primary Key and Unique Key?
* **Primary Key**: Identifies each row uniquely. **Cannot contain NULL values**. Only 1 primary key per table.
* **Unique Key**: Ensures all values in a column are distinct. **Can accept one NULL value**. A table can have multiple unique constraints.

---

#### 3. Explain Normalization (1NF, 2NF, 3NF, BCNF)
* **1NF**: Atomic values in columns, no repeating groups.
* **2NF**: In 1NF + No Partial Dependency (all non-key attributes fully dependent on candidate key).
* **3NF**: In 2NF + No Transitive Dependency ($A \\to B, B \\to C$).
* **BCNF**: Stricter 3NF; for every functional dependency $X \\to Y$, $X$ must be a super key.

---

#### 4. What are Clustered vs Non-Clustered Indexes?
* **Clustered Index**: Physically alters the table storage order (e.g. Dictionary). Only **1** per table.
* **Non-Clustered Index**: Creates a separate lookup structure with pointers to actual rows (e.g. Index at back of book). Multiple allowed.

---

#### 5. What is a Deadlock and how is it prevented?
A state where two or more transactions hold locks on resources the other needs, creating a circular wait. Prevented using **Wait-Die**, **Wound-Wait**, or deadlock detection with wait-for graphs.

---

#### 6. Difference between \`WHERE\` and \`HAVING\` clause?
* \`WHERE\` filters individual rows **before** aggregation.
* \`HAVING\` filters aggregated groups **after** \`GROUP BY\`.

---

#### 7. What are SQL Joins and their types?
* **INNER JOIN**: Returns matching records in both tables.
* **LEFT JOIN**: All records from left table + matching from right.
* **RIGHT JOIN**: All records from right table + matching from left.
* **FULL OUTER JOIN**: All records when there is a match in either table.

---

#### 8. What is a View vs Materialized View?
* **View**: A virtual query saved as a definition, executed every time it's queried.
* **Materialized View**: Stores the physical result set on disk and refreshes periodically.

---

#### 9. What is Two-Phase Locking (2PL)?
A concurrency control protocol ensuring serializability:
1. **Growing Phase**: Locks are acquired, none released.
2. **Shrinking Phase**: Locks are released, none acquired.

---

#### 10. What is the difference between \`DELETE\`, \`TRUNCATE\`, and \`DROP\`?
| Command | Operation Type | Can Rollback? | Speed |
| :--- | :--- | :--- | :--- |
| \`DELETE\` | DML (row-by-row) | Yes | Slower |
| \`TRUNCATE\` | DDL (deallocates pages) | Fast / Minimal log | Very Fast |
| \`DROP\` | DDL (removes table + schema) | No | Instant |`,
  },

  revisionPlan: {
    keywords: ["revision plan", "study plan", "exam plan", "revision schedule", "midterm plan"],
    response: `### 📅 High-Yield 4-Day Revision Plan for Midterms

Here is a structured, high-retention revision schedule tailored for **Aditya Sharma (Semester 5 CS)**:

---

#### 🎯 Day 1: High-Weightage Core Theory & Conceptual Mastery
* **09:00 AM – 11:30 AM**: **Algorithms (CS301)** — Master Divide & Conquer, Dynamic Programming memoization, and Greedy vs DP trade-offs.
* **02:00 PM – 04:00 PM**: **Operating Systems (CS304)** — Process States, CPU Scheduling algorithms (Round Robin, SRTF), and Semaphores.
* **07:00 PM – 08:30 PM**: **AI Quick Quiz** — Complete 15 flashcards on OS Deadlocks & Memory Management.

---

#### 💻 Day 2: Problem Solving & Numerical Practice
* **09:00 AM – 11:30 AM**: **DBMS (CS307)** — SQL Queries (Nested Subqueries, Window Functions), Normalization up to BCNF.
* **02:00 PM – 04:30 PM**: **Algorithms (CS301)** — Graph Algorithms (Dijkstra, Bellman-Ford, Prim/Kruskal MST) & Time Complexity analysis.
* **07:30 PM – 09:00 PM**: **Formula & Complexity Sheet** — Write down recurrence relations and Master Theorem formulas from memory.

---

#### 🧪 Day 3: Full-Length Practice Exams & Diagnostic Review
* **10:00 AM – 12:00 PM**: **Timed Mock Exam 1 (CS301 Algorithms)** — 20 MCQs + 3 Coding Proofs.
* **02:30 PM – 04:30 PM**: **Timed Mock Exam 2 (CS304 OS & CS307 DBMS)** — Focus on weak areas identified in Mock 1.
* **07:00 PM – 08:30 PM**: **Error Log Review** — Analyze missed questions and generate target notes using AI Assistant.

---

#### ⚡ Day 4: Light Active Recall & Final Polish
* **09:00 AM – 11:00 AM**: Flashcard Blitz — 50 active recall cards across all 4 subjects.
* **02:00 PM – 03:30 PM**: High-priority diagram review (B+ Trees, OS Page Tables, Neural Network architectures).
* **08:00 PM onwards**: Rest, hydration, and mental reset. Ensure 8 hours of sleep for peak cognitive recall!`,
  },
};

/**
 * Fallback Academic Answer Generator for Any Custom Prompt
 */
function generateContextualAnswer(prompt) {
  const cleanPrompt = prompt.toLowerCase();

  for (const key of Object.keys(knowledgeBase)) {
    const item = knowledgeBase[key];
    if (item.keywords.some((kw) => cleanPrompt.includes(kw))) {
      return item.response;
    }
  }

  return `### 💡 Academic Answer: ${prompt}

Here is a structured explanation prepared for your Computer Science & Engineering curriculum:

---

#### 1. Core Concept Overview
When studying **"${prompt}"**, the key foundation revolves around breaking the concept into its primary algorithmic and structural components:

* **Primary Objective**: Optimizing computational efficiency, data correctness, and logical modularity.
* **Key Mechanism**: Standard theoretical models dictate that input is processed through well-defined state transitions.

---

#### 2. Key Technical Principles & Rules
1. **State Invariance**: Ensure prerequisite conditions are maintained across all execution stages.
2. **Computational Bound**: Evaluate worst-case and average-case performance metrics ($\\mathcal{O}(N)$ or $\\mathcal{O}(\\log N)$).
3. **Edge Case Handling**: Always account for empty inputs, boundary constraints, and overflow conditions.

---

#### 3. Practical Example & Best Practice
\`\`\`text
Input Scenario -> Transform Step 1 -> Verification -> Final Output State
\`\`\`

> 💡 **Study Tip for Aditya**:
> Try connecting this topic with your upcoming **Algorithms (CS301)** or **Operating Systems (CS304)** modules. Would you like me to generate a 5-question practice quiz or create a set of summary flashcards on this topic?`;
}

/**
 * 1. Ask AI Assistant (Interactive Chat)
 */
export async function askAI(prompt, history = []) {
  const apiKey = getApiKey();
  // If a valid Gemini API key is configured, query Google Gemini API
  if (apiKey && typeof fetch !== 'undefined' && !apiKey.startsWith('your_')) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are an expert AI Study Assistant for Computer Science & Engineering students. Answer the following question clearly with structured markdown, key concepts, code snippets, and study tips:\n\n${prompt}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return {
            text: candidateText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: 'Gemini Live API',
          };
        }
      }
    } catch (e) {
      console.warn('Gemini API query fallback to Academic Engine:', e);
    }
  }

  await simulateDelay(600 + Math.random() * 400);
  const responseText = generateContextualAnswer(prompt);
  return {
    text: responseText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    source: 'Academic Engine',
  };
}

/**
 * 2. Generate Structured Notes (7 Core Academic Sections)
 */
export async function generateNotes(arg1, arg2 = "Computer Science", arg3 = "Intermediate", arg4 = "Standard") {
  await simulateDelay(900 + Math.random() * 400);

  let topic = "General Computer Science";
  let subject = "Computer Science";
  let difficulty = "Intermediate";
  let length = "Standard";

  if (typeof arg1 === 'object' && arg1 !== null) {
    topic = arg1.topic || topic;
    subject = arg1.subject || subject;
    difficulty = arg1.difficulty || difficulty;
    length = arg1.length || length;
  } else {
    topic = arg1 || topic;
    subject = arg2;
    difficulty = arg3;
    length = arg4;
  }

  const cleanTopic = String(topic).trim();
  const lowerTopic = cleanTopic.toLowerCase();

  let overview = "";
  let keyConcepts = [];
  let definitions = [];
  let examples = [];
  let keyPoints = [];
  let summary = "";
  let questions = [];

  if (lowerTopic.includes("dynamic programming") || lowerTopic.includes("dp")) {
    overview = `Dynamic Programming (DP) is a powerful algorithmic paradigm used to solve complex optimization problems by breaking them down into simpler, overlapping subproblems. It guarantees optimal substructure by storing the solutions to subproblems to avoid redundant recalculations.`;
    keyConcepts = [
      { name: "Optimal Substructure", desc: "An optimal solution to the problem contains within it optimal solutions to subproblems." },
      { name: "Overlapping Subproblems", desc: "The problem can be broken down into subproblems which are reused multiple times rather than generating new subproblems." },
      { name: "Memoization (Top-Down)", desc: "Recursively solve subproblems and cache results in an array or hash map." },
      { name: "Tabulation (Bottom-Up)", desc: "Iteratively build up solutions starting from the smallest base cases in a DP table." }
    ];
    definitions = [
      { term: "Memoization", definition: "An optimization technique that speeds up programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again." },
      { term: "State Transition Relation", definition: "The mathematical recurrence formula expressing the solution to a state in terms of previously computed states (e.g., dp[i] = dp[i-1] + dp[i-2])." },
      { term: "DAG (Directed Acyclic Graph)", definition: "The dependency structure formed by DP subproblems where topological order dictates execution order." }
    ];
    examples = [
      {
        title: "0/1 Knapsack Problem Recurrence",
        code: `// Recurrence Relation:
// dp[i][w] = max value using first i items with weight capacity w
if (weights[i-1] <= w) {
  dp[i][w] = Math.max(values[i-1] + dp[i-1][w - weights[i-1]], dp[i-1][w]);
} else {
  dp[i][w] = dp[i-1][w];
}`
      },
      {
        title: "Fibonacci Sequence with Space-Optimized DP",
        code: `function fib(n) {
  if (n <= 1) return n;
  let prev2 = 0, prev1 = 1;
  for (let i = 2; i <= n; i++) {
    let curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1; // Time: O(N), Space: O(1)
}`
      }
    ];
    keyPoints = [
      "Always identify the state variables and their bounds before writing code.",
      "Check if space optimization is possible (e.g., from O(N^2) to O(N) when only the previous row is needed).",
      "Distinguish between 0/1 Knapsack (item can be picked at most once) and Unbounded Knapsack (item can be picked infinitely).",
      "Dynamic programming is applicable only when subproblems are dependent (unlike Divide and Conquer where subproblems are independent)."
    ];
    summary = `Dynamic Programming transforms exponential-time recursive solutions (O(2^N)) into polynomial-time solutions (O(N^2) or O(N)) by caching subproblem states. Always establish the base cases, define the transition formula, and determine if top-down memoization or bottom-up tabulation is more appropriate for your memory budget.`;
    questions = [
      { q: "What is the difference between Divide & Conquer and Dynamic Programming?", a: "Divide & Conquer divides into disjoint, independent subproblems (e.g., MergeSort), whereas Dynamic Programming handles overlapping subproblems where solutions are reused (e.g., Floyd-Warshall, Matrix Chain Multiplication)." },
      { q: "How do you detect if a problem can be solved with Dynamic Programming?", a: "Look for two key properties: (1) Optimization problem asking for min/max/count/possibility, and (2) Overlapping subproblems with optimal substructure." },
      { q: "What is the time and space complexity of the standard 0/1 Knapsack algorithm?", a: "Time Complexity is O(N * W) where N is the number of items and W is the capacity. Space Complexity is O(N * W), which can be optimized to O(W) using a 1D array." }
    ];
  } else if (lowerTopic.includes("virtual memory") || lowerTopic.includes("paging") || lowerTopic.includes("os")) {
    overview = `Virtual Memory is a core Operating Systems memory management capability that provides an idealized abstraction of the storage resources actually available. It allows execution of processes that may not be completely in physical RAM, mapping contiguous virtual addresses to fragmented physical page frames.`;
    keyConcepts = [
      { name: "Paging Mechanism", desc: "Divides physical memory into fixed-sized blocks (frames) and virtual memory into same-sized blocks (pages)." },
      { name: "Page Table & Translation", desc: "A data structure mapping Virtual Page Numbers (VPN) to Physical Frame Numbers (PFN) using the Memory Management Unit (MMU)." },
      { name: "TLB (Translation Lookaside Buffer)", desc: "A high-speed hardware associative cache that stores recent virtual-to-physical address translations to minimize memory access latency." },
      { name: "Demand Paging & Page Faults", desc: "Pages are loaded into RAM only when referenced during program execution. If the page is not in RAM, a Page Fault Trap is triggered." }
    ];
    definitions = [
      { term: "Page Fault", definition: "A hardware interrupt raised when a program tries to access a page that is mapped in address space but not currently loaded in physical RAM." },
      { term: "Thrashing", definition: "A catastrophic performance degradation state where the OS spends significantly more time swapping pages in and out of disk than executing actual user processes." },
      { term: "Working Set Model", definition: "The set of pages actively referenced by a process during a specific time window delta." }
    ];
    examples = [
      {
        title: "Virtual Address Translation Formula",
        code: `// Given 32-bit Virtual Address with 4KB Page Size (2^12 bytes):
// - Offset (d): Lower 12 bits
// - Virtual Page Number (p): Upper 20 bits
Physical Address = (Frame Number << 12) | Offset;`
      },
      {
        title: "LRU (Least Recently Used) Page Replacement",
        code: `// Page Reference String: 7, 0, 1, 2, 0, 3, 0, 4 (3 Frames)
// Frame State over time:
// [7] -> [7,0] -> [7,0,1] -> [2,0,1] -> [2,0,1] (Hit) -> [2,0,3] -> ...
// Total Page Faults: 6`
      }
    ];
    keyPoints = [
      "Page size is always a power of 2 (typically 4 KB) to enable fast bitwise address manipulation.",
      "Effective Memory Access Time (EMAT) = (1 - p) * MemoryAccessTime + p * PageFaultServiceTime.",
      "Multi-level page tables and inverted page tables solve the problem of huge memory overhead for large 64-bit address spaces.",
      "Belady's Anomaly occurs in FIFO replacement where adding more page frames leads to more page faults."
    ];
    summary = `Virtual Memory uncouples logical program memory from physical RAM constraints using demand paging and MMU translation. High hit-rates in the TLB (typically >95%) ensure translation speed remains near hardware register levels.`;
    questions = [
      { q: "What exact steps occur when a Page Fault is serviced by the OS?", a: "1. Hardware trap to OS kernel. 2. Save process state. 3. Verify access permissions. 4. Find a free frame on disk. 5. Issue disk I/O read. 6. Update Page Table valid bit. 7. Restart the faulting instruction." },
      { q: "Why does FIFO suffer from Belady's Anomaly while LRU does not?", a: "LRU belongs to the class of 'Stack Algorithms' where the set of pages in memory for n frames is always a subset of pages for n+1 frames. FIFO does not satisfy this inclusion property." },
      { q: "Calculate EMAT if memory access time is 100ns, page fault service time is 10ms, and page fault rate is 1 out of 10,000.", a: "EMAT = (1 - 0.0001)*100ns + 0.0001*(10,000,000ns) = 99.99ns + 1000ns = 1099.99 ns." }
    ];
  } else {
    overview = `${cleanTopic} is an essential academic subject in ${subject}. It establishes fundamental theoretical principles, algorithmic models, and practical design patterns required for modern engineering and software systems.`;
    keyConcepts = [
      { name: "Foundational Architecture", desc: `Core structural hierarchy and modular boundaries that define ${cleanTopic}.` },
      { name: "Algorithmic Invariants", desc: "Guaranteed conditions that remain valid across all computational transformations." },
      { name: "Optimization & Trade-offs", desc: "Balancing time complexity, space overhead, scalability, and code maintainability." },
      { name: "Error & Edge Case Boundaries", desc: "Handling corner conditions, null states, resource exhaustion, and concurrency." }
    ];
    definitions = [
      { term: `${cleanTopic} Invariant`, definition: `A mathematical or logical condition that must hold true before and after each execution cycle in ${cleanTopic}.` },
      { term: "Computational Bound", definition: "The asymptotic upper and lower boundaries (Big-O, Big-Omega, Big-Theta) governing execution." },
      { term: "State Transition Protocol", definition: "The verified steps through which system data transforms from input to optimal output." }
    ];
    examples = [
      {
        title: `Practical Implementation & Workflow in ${cleanTopic}`,
        code: `// Step 1: Input Validation & Initialization
function execute_${cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, '_')}(inputData) {
  if (!inputData) throw new Error("Invalid Input");
  
  // Step 2: Core Processing Logic
  const result = processTransform(inputData);
  
  // Step 3: Return verified output state
  return result;
}`
      }
    ];
    keyPoints = [
      `Always analyze both best-case and worst-case performance when analyzing ${cleanTopic}.`,
      "Decompose larger problems into isolated, testable modules with clear boundaries.",
      "Verify prerequisite conditions before executing main processing cycles.",
      "Connect theoretical definitions directly with university exam scoring rubrics."
    ];
    summary = `Mastering ${cleanTopic} requires understanding its core mathematical definitions, standard algorithmic implementations, and common edge cases. Focus on connecting foundational concepts with practical problem-solving strategies.`;
    questions = [
      { q: `What is the primary motivation for studying ${cleanTopic}?`, a: `It provides standardized, mathematically-sound techniques to solve high-complexity engineering challenges with optimal resource efficiency.` },
      { q: `What are common pitfalls students make when implementing ${cleanTopic}?`, a: `Failing to handle boundary conditions, ignoring time/space complexity trade-offs, and not verifying intermediate state invariants.` },
      { q: `How does ${cleanTopic} connect with overall ${subject} curriculum?`, a: `It serves as a prerequisite building block for advanced semester modules and real-world technical interview assessments.` }
    ];
  }

  const wordCount = length === "Concise" ? 450 : length === "Deep Dive" ? 1200 : 750;
  const readTimeMinutes = Math.max(2, Math.round(wordCount / 200));

  return {
    id: `note-${Date.now()}`,
    title: cleanTopic,
    subject: subject,
    difficulty: difficulty,
    length: length,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: `${readTimeMinutes} min read`,
    overview,
    keyConcepts,
    definitions,
    examples,
    keyPoints,
    summary,
    questions,
    sections: {
      overview,
      keyConcepts,
      importantDefinitions: definitions,
      examples,
      keyPoints,
      summary,
      importantQuestions: questions,
    },
    rawMarkdown: `# ${cleanTopic} - Study Notes\n**Subject:** ${subject} | **Difficulty:** ${difficulty} | **Date:** ${new Date().toLocaleDateString()}\n\n## 1. Topic Overview\n${overview}\n\n## 2. Key Concepts\n${keyConcepts.map(c => `- **${c.name}:** ${c.desc}`).join('\n')}\n\n## 3. Important Definitions\n${definitions.map(d => `- **${d.term}:** ${d.definition}`).join('\n')}\n\n## 4. Examples\n${examples.map(e => `### ${e.title}\n\`\`\`\n${e.code}\n\`\`\``).join('\n\n')}\n\n## 5. Key Points\n${keyPoints.map(p => `- ${p}`).join('\n')}\n\n## 6. Summary\n${summary}\n\n## 7. Important Questions\n${questions.map((q, i) => `${i+1}. **Q:** ${q.q}\n   **A:** ${q.a}`).join('\n\n')}`
  };
}

/**
 * 3. Generate Multiple-Choice Quiz with Explanations & Weak Topic Diagnostics
 */
export async function generateQuiz(arg1, arg2, arg3 = 5, arg4 = "Intermediate") {
  await simulateDelay(800 + Math.random() * 400);

  let subject = "CS301: Design & Analysis of Algorithms";
  let topic = "Dynamic Programming";
  let count = 5;
  let difficulty = "Intermediate";

  if (typeof arg1 === 'object' && arg1 !== null) {
    subject = arg1.subject || subject;
    topic = arg1.topic || topic;
    count = arg1.questionCount || arg1.count || count;
    difficulty = arg1.difficulty || difficulty;
  } else {
    subject = arg1 || subject;
    topic = arg2 || topic;
    count = arg3;
    difficulty = arg4;
  }

  const cleanTopic = String(topic || "General CS").trim();

  const questionBank = [
    {
      id: "q-algo-1",
      topic: "Space & Time Complexity",
      question: "What is the time complexity of searching for an element in a balanced Binary Search Tree (AVL / Red-Black Tree) containing N nodes?",
      options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
      correctIndex: 1,
      explanation: "In a balanced BST, tree height is strictly bounded to O(log N). Since each comparison moves down one level, search takes logarithmic time O(log N)."
    },
    {
      id: "q-algo-2",
      topic: "Dynamic Programming",
      question: "Which of the following problems does NOT exhibit optimal substructure and therefore cannot be solved via Dynamic Programming?",
      options: [
        "Shortest Path in a weighted Directed Acyclic Graph",
        "Longest Simple Path in an arbitrary unweighted graph",
        "0/1 Knapsack Problem",
        "Matrix Chain Multiplication"
      ],
      correctIndex: 1,
      explanation: "Longest simple path in a general graph lacks optimal substructure because subproblems are not independent (a subpath could reuse vertices, making it non-simple). It is NP-hard."
    },
    {
      id: "q-algo-3",
      topic: "Recurrence & Master Theorem",
      question: "According to the Master Theorem, what is the asymptotic solution to the recurrence relation: T(n) = 2T(n/2) + O(n)?",
      options: ["O(n)", "O(n log n)", "O(n^2)", "O(2^n)"],
      correctIndex: 1,
      explanation: "Here a = 2, b = 2, f(n) = n. Since n^(log_b a) = n^1 = n, we are in Case 2 of the Master Theorem where f(n) = Theta(n^(log_b a)), yielding T(n) = Theta(n log n)."
    },
    {
      id: "q-os-1",
      topic: "Memory Management & Paging",
      question: "What is the phenomenon where adding more page frames to physical memory results in an increased number of page faults for the FIFO replacement algorithm?",
      options: ["Thrashing", "Belady's Anomaly", "Priority Inversion", "Convoy Effect"],
      correctIndex: 1,
      explanation: "Belady's Anomaly is a counter-intuitive behavior in FIFO page replacement where increasing allocation of physical page frames results in more page faults."
    },
    {
      id: "q-os-2",
      topic: "Process Synchronization",
      question: "Which of the following conditions is NOT one of the 4 Coffman conditions required for a Deadlock to occur?",
      options: ["Mutual Exclusion", "Hold and Wait", "Preemption Allowed", "Circular Wait"],
      correctIndex: 2,
      explanation: "The condition required for deadlock is 'No Preemption' (resources cannot be forcibly taken). If preemption is allowed, deadlocks cannot occur."
    },
    {
      id: "q-db-1",
      topic: "Database Normalization",
      question: "A relation table is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X -> Y:",
      options: [
        "Y is a prime attribute",
        "X is a Super Key",
        "X is a Foreign Key",
        "X is in 1st Normal Form"
      ],
      correctIndex: 1,
      explanation: "BCNF is a stricter version of 3NF. It requires that for every functional dependency X -> Y, the determinant X must be a super key for the relation."
    },
    {
      id: "q-db-2",
      topic: "Transaction Management & ACID",
      question: "Which property of ACID ensures that concurrent transactions execute as if they were running serially without intermediate state interference?",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      correctIndex: 2,
      explanation: "Isolation ensures that multiple concurrent transactions do not impact each other's execution and intermediate uncommitted states remain invisible."
    },
    {
      id: "q-ai-1",
      topic: "Neural Networks & Machine Learning",
      question: "Which activation function is most commonly used in hidden layers of deep neural networks to prevent the Vanishing Gradient problem?",
      options: ["Sigmoid", "Softmax", "ReLU (Rectified Linear Unit)", "Tanh"],
      correctIndex: 2,
      explanation: "ReLU: f(x) = max(0, x) has a constant derivative of 1 for positive inputs, avoiding gradient saturation and vanishing gradient issues common in Sigmoid and Tanh."
    },
    {
      id: "q-net-1",
      topic: "Computer Networks & Protocols",
      question: "How many packets are exchanged in the standard TCP connection establishment handshake protocol?",
      options: ["2 packets (SYN, ACK)", "3 packets (SYN, SYN-ACK, ACK)", "4 packets (FIN, ACK, FIN, ACK)", "1 packet (SYN)"],
      correctIndex: 1,
      explanation: "TCP uses a 3-way handshake: 1. Client sends SYN, 2. Server responds with SYN-ACK, 3. Client confirms with ACK."
    },
    {
      id: "q-gen-1",
      topic: "Algorithmic Paradigms",
      question: "Which algorithmic strategy is used in Dijkstra's Single Source Shortest Path algorithm on non-negative weighted graphs?",
      options: ["Greedy Method", "Dynamic Programming", "Backtracking", "Branch and Bound"],
      correctIndex: 0,
      explanation: "Dijkstra algorithm employs a Greedy strategy by always selecting the unvisited vertex with the currently known minimum tentative distance."
    }
  ];

  const requestedCount = Math.min(count, 10);
  const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, requestedCount).map((q, idx) => ({
    ...q,
    id: `q-${idx + 1}`,
    questionNumber: idx + 1,
    correctAnswer: q.options[q.correctIndex],
  }));

  return {
    id: `quiz-${Date.now()}`,
    subject,
    topic: cleanTopic,
    difficulty,
    totalQuestions: selectedQuestions.length,
    timeLimitMinutes: Math.max(3, selectedQuestions.length * 2),
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    questions: selectedQuestions
  };
}

/**
 * 4. Generate Comprehensive Day-by-Day Study Plan & Actionable Tasks
 */
export async function generateStudyPlan(arg1, arg2, arg3 = 4, arg4 = 4, arg5 = "Intermediate") {
  await simulateDelay(900 + Math.random() * 400);

  let subject = "CS301: Design & Analysis of Algorithms";
  let topics = "Dynamic Programming, Graph Algorithms";
  let examDateOrDays = 4;
  let hoursPerDay = 4;
  let difficulty = "Intermediate";

  if (typeof arg1 === 'object' && arg1 !== null) {
    subject = arg1.subject || subject;
    topics = arg1.topics || topics;
    examDateOrDays = arg1.examDate || arg1.days || examDateOrDays;
    hoursPerDay = arg1.hoursPerDay || arg1.hours || hoursPerDay;
    difficulty = arg1.difficulty || difficulty;
  } else {
    subject = arg1 || subject;
    topics = arg2 || topics;
    examDateOrDays = arg3;
    hoursPerDay = arg4;
    difficulty = arg5;
  }

  // Determine total days (default 4 days if date is nearby)
  let daysCount = 4;
  if (typeof examDateOrDays === 'number') {
    daysCount = Math.max(2, Math.min(14, examDateOrDays));
  } else if (typeof examDateOrDays === 'string' && examDateOrDays) {
    const parsedDays = Math.ceil((new Date(examDateOrDays).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (!isNaN(parsedDays) && parsedDays > 0) {
      daysCount = Math.min(14, parsedDays);
    }
  }

  const topicList = String(topics)
    .split(/[,;\n]/)
    .map((t) => t.trim())
    .filter(Boolean);

  const primaryTopics = topicList.length > 0
    ? topicList
    : ["Core Foundation & Theory", "Problem Solving & Analysis", "High-Yield Practice", "Mock Examination"];

  const taskTypes = ["Deep Theory Review", "Algorithm Problem Solving", "AI Quiz & Active Recall", "Formula & Diagram Blitz", "Timed Mock Exam"];
  const priorities = ["High", "High", "Medium", "Normal"];

  const generatedTasks = [];
  const baseDate = new Date();

  for (let day = 0; day < daysCount; day++) {
    const targetDate = new Date();
    targetDate.setDate(baseDate.getDate() + day);

    const dateFormatted = targetDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const dayLabel = day === 0 ? "Today" : day === 1 ? "Tomorrow" : `Day ${day + 1}`;
    const dayTopic = primaryTopics[day % primaryTopics.length] || `Module ${day + 1} Revision`;

    // Morning Session Task
    generatedTasks.push({
      id: `task-gen-${Date.now()}-${day}-1`,
      title: `${subject.split(':')[0]} — Deep Theory: ${dayTopic}`,
      subject: subject.split(':')[0].trim(),
      topic: dayTopic,
      date: dateFormatted,
      dayLabel,
      dayNumber: day + 1,
      priority: day <= 1 ? "High" : "Medium",
      estimatedTime: `${Math.round(hoursPerDay * 0.6 * 60)} mins`,
      timeRange: "09:00 AM - 11:30 AM",
      type: day === 0 ? "Deep Theory Review" : "Problem Solving",
      completed: false,
    });

    // Afternoon / Evening Practice Task
    generatedTasks.push({
      id: `task-gen-${Date.now()}-${day}-2`,
      title: `Practice 10 Quiz Questions & Active Recall: ${dayTopic}`,
      subject: subject.split(':')[0].trim(),
      topic: dayTopic,
      date: dateFormatted,
      dayLabel,
      dayNumber: day + 1,
      priority: day === daysCount - 1 ? "High" : "Normal",
      estimatedTime: `${Math.round(hoursPerDay * 0.4 * 60)} mins`,
      timeRange: "03:00 PM - 04:30 PM",
      type: day === daysCount - 1 ? "Timed Mock Exam" : "AI Quiz & Active Recall",
      completed: false,
    });
  }

  return {
    id: `plan-${Date.now()}`,
    subject,
    topics: primaryTopics,
    daysCount,
    hoursPerDay,
    totalTargetHours: daysCount * hoursPerDay,
    difficulty,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    tasks: generatedTasks,
    summary: `Personalized ${daysCount}-day revision plan allocating ${daysCount * hoursPerDay} total study hours with balanced theory, coding proofs, and timed practice.`
  };
}
