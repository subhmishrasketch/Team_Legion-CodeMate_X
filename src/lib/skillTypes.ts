// Types for Skill Challenges and Verification System

export interface SkillChallenge {
  id: string;
  skillName: string; // "React", "Python", "Node.js", etc.
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  timeLimit: number; // in minutes
  starterCode: string;
  solution: string;
  testCases: TestCase[];
  createdAt: Date;
}

export interface TestCase {
  id: string;
  input: any;
  expectedOutput: any;
  description: string;
}

export interface ChallengeAttempt {
  id: string;
  userId: string;
  challengeId: string;
  code: string;
  passed: boolean;
  score: number; // 0-100
  testsPassed: number;
  testsTotal: number;
  timeSpent: number; // in seconds
  attemptedAt: Date;
  submittedAt?: Date;
}

export interface UserSkillVerification {
  userId: string;
  skillName: string;
  verifiedDate: Date;
  trustScore: number; // 0-100
  source: "challenge" | "github" | "project" | "endorsement";
  badge: "bronze" | "silver" | "gold" | "platinum";
}

export interface SkillTrustScore {
  userId: string;
  skillName: string;
  score: number; // 0-100
  badge: "bronze" | "silver" | "gold" | "platinum";
  challengesPassed: number;
  lastVerified: Date;
  githubScore?: number;
  projectScore?: number;
}

// Sample Challenges Database
export const SKILL_CHALLENGES: SkillChallenge[] = [
  {
    id: "react-hooks-1",
    skillName: "React",
    title: "React Hooks: useState Basics",
    description: "Create a counter component using React hooks",
    difficulty: "beginner",
    timeLimit: 20,
    starterCode: `function Counter() {
  // implement your counter here
  return (
    <div>
      <p>Count: {/* display count */}</p>
      <button onClick={() => {}}>Increment</button>
    </div>
  );
}`,
    solution: `function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}`,
    testCases: [
      {
        id: "test-1",
        input: { action: "render" },
        expectedOutput: "Count: 0",
        description: "Should render with initial count of 0"
      }
    ],
    createdAt: new Date("2026-04-01")
  },
  {
    id: "python-functions-1",
    skillName: "Python",
    title: "Python: Factorial Function",
    description: "Write a function that calculates factorial",
    difficulty: "beginner",
    timeLimit: 15,
    starterCode: `def factorial(n):
    # implement factorial calculation
    pass`,
    solution: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
    testCases: [
      { id: "test-1", input: 5, expectedOutput: 120, description: "factorial(5) should be 120" },
      { id: "test-2", input: 1, expectedOutput: 1, description: "factorial(1) should be 1" }
    ],
    createdAt: new Date("2026-04-01")
  },
  {
    id: "nodejs-api-1",
    skillName: "Node.js",
    title: "Node.js: Express API Endpoint",
    description: "Create a GET endpoint that returns user data",
    difficulty: "beginner",
    timeLimit: 25,
    starterCode: `const express = require('express');
const app = express();

// implement your endpoint here

app.listen(3000);`,
    solution: `const express = require('express');
const app = express();

app.get('/api/user', (req, res) => {
  res.json({ id: 1, name: 'John' });
});

app.listen(3000);`,
    testCases: [
      { 
        id: "test-1", 
        input: { method: "GET", path: "/api/user" }, 
        expectedOutput: { id: 1, name: 'John' }, 
        description: "GET /api/user should return user object"
      }
    ],
    createdAt: new Date("2026-04-01")
  },
  {
    id: "typescript-generics-1",
    skillName: "TypeScript",
    title: "TypeScript: Strongly-Typed Generics",
    description: "Create a reusable generic function that returns a typed result array",
    difficulty: "intermediate",
    timeLimit: 30,
    starterCode: `function wrapInArray<T>(value: T) {
  // implement generic wrapper
}

const numbers = wrapInArray(5);
const name = wrapInArray('code');`,
    solution: `function wrapInArray<T>(value: T): T[] {
  return [value];
}

const numbers = wrapInArray(5);
const name = wrapInArray('code');`,
    testCases: [
      { id: "test-1", input: 42, expectedOutput: [42], description: "wrapInArray returns an array with the original number" },
      { id: "test-2", input: "hello", expectedOutput: ["hello"], description: "wrapInArray returns a typed string array" }
    ],
    createdAt: new Date("2026-04-03")
  },
  {
    id: "data-structures-1",
    skillName: "Data Structures",
    title: "Algorithm: Binary Search",
    description: "Implement binary search for a sorted array",
    difficulty: "intermediate",
    timeLimit: 25,
    starterCode: `function binarySearch(sortedArray, target) {
  // implement binary search here
}

console.log(binarySearch([1,2,3,4,5], 3)); // 2`,
    solution: `function binarySearch(sortedArray, target) {
  let left = 0;
  let right = sortedArray.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (sortedArray[mid] === target) return mid;
    if (sortedArray[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}`,
    testCases: [
      { id: "test-1", input: { array: [1, 2, 3, 4, 5], target: 3 }, expectedOutput: 2, description: "Finds target in the middle of the array" },
      { id: "test-2", input: { array: [1, 2, 3, 4, 5], target: 6 }, expectedOutput: -1, description: "Returns -1 for missing target" }
    ],
    createdAt: new Date("2026-04-04")
  },
  {
    id: "css-animations-1",
    skillName: "CSS",
    title: "CSS Animations: Interactive Card",
    description: "Build a hover animation effect for a card component",
    difficulty: "advanced",
    timeLimit: 35,
    starterCode: `.profile-card {
  /* implement card hover styles here */
}

.profile-card:hover {
  /* add hover animation */
}`,
    solution: `.profile-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform: translateY(0);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.profile-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 30px rgba(0,0,0,0.15);
}`,
    testCases: [
      { id: "test-1", input: { state: "hover" }, expectedOutput: "transform: translateY(-8px)", description: "Card lifts on hover" },
      { id: "test-2", input: { state: "rest" }, expectedOutput: "transition: transform 0.3s ease", description: "Smooth hover transition is present" }
    ],
    createdAt: new Date("2026-04-04")
  },
  {
    id: "react-performance-1",
    skillName: "React",
    title: "React Performance: Memoize a List",
    description: "Optimize a list component to avoid unnecessary re-renders using memoization.",
    difficulty: "advanced",
    timeLimit: 40,
    starterCode: `function UserList({ items }) {
  // prevent unnecessary rerenders
  return (
    <div>
      {items.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}`,
    solution: `const UserRow = React.memo(function UserRow({ user }) {
  return <div>{user.name}</div>;
});

function UserList({ items }) {
  return (
    <div>
      {items.map((user) => (
        <UserRow key={user.id} user={user} />
      ))}
    </div>
  );
}`,
    testCases: [
      { id: "test-1", input: { items: [{ id: 1, name: 'Alice' }] }, expectedOutput: "Alice", description: "Renders each user without duplicate renders" },
      { id: "test-2", input: { items: [] }, expectedOutput: "[]", description: "Handles an empty list gracefully" }
    ],
    createdAt: new Date("2026-04-05")
  },
  {
    id: "utility-debounce-1",
    skillName: "JavaScript",
    title: "JavaScript: Debounce Utility",
    description: "Implement a reusable debounce helper for rate-limiting user input.",
    difficulty: "intermediate",
    timeLimit: 30,
    starterCode: `function debounce(fn, delay) {
  // implement debounce logic
}

const log = debounce(() => console.log('hello'), 300);`,
    solution: `function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}`,
    testCases: [
      { id: "test-1", input: { calls: 3, delay: 300 }, expectedOutput: "debounced", description: "Returns a debounced wrapper function" },
      { id: "test-2", input: { calls: 1, delay: 100 }, expectedOutput: "delayed", description: "Delays callback execution by the specified duration" }
    ],
    createdAt: new Date("2026-04-05")
  }
];
