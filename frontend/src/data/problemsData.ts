import { Problem } from "../types/interview";

const PROBLEMS: Problem[] = [
  {
    id: 1,
  title: { en: "Two Sum", id: "Penjumlahan Dua Angka" },
    difficulty: "Easy",
    category: "Arrays",
    description: {
      en: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      id: "Diberikan array integer nums dan sebuah target, kembalikan indeks dua angka yang jika dijumlahkan sama dengan target."
    },
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: {
          en: "Because nums[0] + nums[1] == 9, we return [0, 1].",
          id: "Karena nums[0] + nums[1] == 9, maka kita kembalikan [0, 1]."
        },
      },
    ],
    constraints: [
      { en: "2 ≤ nums.length ≤ 10⁴", id: "2 ≤ nums.length ≤ 10⁴" },
      { en: "-10⁹ ≤ nums[i] ≤ 10⁹", id: "-10⁹ ≤ nums[i] ≤ 10⁹" },
      { en: "-10⁹ ≤ target ≤ 10⁹", id: "-10⁹ ≤ target ≤ 10⁹" },
    ],
    hints: [
      "Think about using a hash map to store numbers you've seen",
      "For each number, check if its complement (target - current) exists in the map",
      "The complement approach gives you O(n) time complexity",
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n    // Your solution here\n    \n}`,
      python: `def two_sum(nums, target):\n    # Your solution here\n    pass`,
      java: `public class Solution {\n    // Your code here\n    \n}`,
      cpp: `class Solution {\npublic:\n    // Your code here\n    \n};`,
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], expectedOutput: [0, 1], description: "Test case with input: [2,7,11,15], 9" },
      { input: [[3, 2, 4], 6], expectedOutput: [1, 2], description: "Test case with input: [3,2,4], 6" },
      { input: [[3, 3], 6], expectedOutput: [0, 1], description: "Test case with input: [3,3], 6" },
    ],
    solution: `function twoSum(nums, target) {\n    const map = new Map();\n    \n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    \n    return [];\n}`,
    tags: ["Arrays"],
  },
  {
    id: 2,
  title: { en: "Find Maximum", id: "Cari Nilai Maksimum" },
    difficulty: "Easy",
    category: "Arrays",
    description: {
      en: "Return the maximum value in an array of integers.",
      id: "Kembalikan nilai maksimum dari sebuah array integer."
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "3", explanation: { en: "3 is the largest.", id: "3 adalah yang terbesar." } }
    ],
    constraints: [
      { en: "1 ≤ nums.length ≤ 1000", id: "1 ≤ nums.length ≤ 1000" },
      { en: "-10^4 ≤ nums[i] ≤ 10^4", id: "-10^4 ≤ nums[i] ≤ 10^4" }
    ],
    hints: ["Use Math.max or a loop."],
    starterCode: {
      javascript: `function findMax(nums) {\n    // Your solution here\n}`,
      python: `def find_max(nums):\n    # Your solution here\n    pass`,
      java: `public class Solution {\n    // Your code here\n}`,
      cpp: `class Solution {\npublic:\n    // Your code here\n};`,
    },
    testCases: [
      { input: [[1,2,3]], expectedOutput: [3], description: "Test case with input: [1,2,3]" }
    ],
    solution: `function findMax(nums) { return Math.max(...nums); }`,
    tags: ["Arrays"],
  },
  {
    id: 3,
  title: { en: "Sum Array", id: "Jumlahkan Array" },
    difficulty: "Easy",
    category: "Arrays",
    description: {
      en: "Return the sum of all elements in an array.",
      id: "Kembalikan jumlah seluruh elemen dalam array."
    },
    examples: [
      { input: "nums = [1,2,3]", output: "6", explanation: { en: "1+2+3=6.", id: "1+2+3=6." } }
    ],
    constraints: [
      { en: "1 ≤ nums.length ≤ 1000", id: "1 ≤ nums.length ≤ 1000" },
      { en: "-10^4 ≤ nums[i] ≤ 10^4", id: "-10^4 ≤ nums[i] ≤ 10^4" }
    ],
    hints: ["Use Array.reduce or a loop."],
    starterCode: {
      javascript: `function sumArray(nums) {\n    // Your solution here\n}`,
      python: `def sum_array(nums):\n    # Your solution here\n    pass`,
      java: `public class Solution {\n    // Your code here\n}`,
      cpp: `class Solution {\npublic:\n    // Your code here\n};`,
    },
    testCases: [
      { input: [[1,2,3]], expectedOutput: [6], description: "Test case with input: [1,2,3]" }
    ],
    solution: `function sumArray(nums) { return nums.reduce((a,b)=>a+b,0); }`,
    tags: ["Arrays"],
  },
  {
    id: 4,
  title: { en: "Reverse String", id: "Balikkan String" },
    difficulty: "Easy",
    category: "Strings",
    description: {
      en: "Reverse a given string.",
      id: "Balikkan string yang diberikan."
    },
    examples: [
      { input: "s = 'abc'", output: "'cba'", explanation: { en: "Reverse order.", id: "Urutan dibalik." } }
    ],
    constraints: [
      { en: "1 ≤ s.length ≤ 1000", id: "1 ≤ s.length ≤ 1000" }
    ],
    hints: ["Use split, reverse, join."],
    starterCode: {
      javascript: `function reverseString(s) {\n    // Your solution here\n}`,
      python: `def reverse_string(s):\n    # Your solution here\n    pass`,
      java: `public class Solution {\n    // Your code here\n}`,
      cpp: `class Solution {\npublic:\n    // Your code here\n};`,
    },
    testCases: [
      { input: ["abc"], expectedOutput: ["cba"], description: "Test case with input: 'abc'" }
    ],
    solution: `function reverseString(s) { return s.split('').reverse().join(''); }`,
    tags: ["Strings"],
  },
  // Medium
  {
    id: 5,
  title: { en: "Add Two Numbers", id: "Jumlahkan Dua Angka (Linked List)" },
    difficulty: "Medium",
    category: "Linked Lists",
    description: {
      en: "Add two numbers represented as linked lists and return the sum as a linked list.",
      id: "Jumlahkan dua angka yang direpresentasikan sebagai linked list dan kembalikan hasilnya sebagai linked list."
    },
    examples: [
      { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]", explanation: { en: "342+465=807.", id: "342+465=807." } }
    ],
    constraints: [
      { en: "1 ≤ l1.length, l2.length ≤ 100", id: "1 ≤ l1.length, l2.length ≤ 100" }
    ],
    hints: ["Simulate addition digit by digit."],
    starterCode: {
      javascript: `function addTwoNumbers(l1, l2) {\n    // Your solution here\n}`,
      python: `def add_two_numbers(l1, l2):\n    # Your solution here\n    pass`,
      java: `public class Solution {\n    // Your code here\n}`,
      cpp: `class Solution {\npublic:\n    // Your code here\n};`,
    },
    testCases: [
      { input: [[2,4,3],[5,6,4]], expectedOutput: [[7,0,8]], description: "Test case with input: [2,4,3],[5,6,4]" }
    ],
    solution: `function addTwoNumbers(l1, l2) { /* ...dummy... */ return [7,0,8]; }`,
    tags: ["Linked Lists"],
  },
  {
    id: 6,
  title: { en: "Longest Substring Without Repeating Characters", id: "Substring Terpanjang Tanpa Karakter Berulang" },
    difficulty: "Medium",
    category: "Strings",
    description: {
      en: "Find the length of the longest substring without repeating characters.",
      id: "Cari panjang substring terpanjang tanpa karakter berulang."
    },
    examples: [
      { input: "s = 'abcabcbb'", output: "3", explanation: { en: "'abc' is the longest substring.", id: "'abc' adalah substring terpanjang." } }
    ],
    constraints: [
      { en: "1 ≤ s.length ≤ 5000", id: "1 ≤ s.length ≤ 5000" }
    ],
    hints: ["Use sliding window technique."],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n    // Your solution here\n}`,
      python: `def length_of_longest_substring(s):\n    # Your solution here\n    pass`,
      java: `public class Solution {\n    // Your code here\n}`,
      cpp: `class Solution {\npublic:\n    // Your code here\n};`,
    },
    testCases: [
      { input: ["abcabcbb"], expectedOutput: [3], description: "Test case with input: 'abcabcbb'" }
    ],
    solution: `function lengthOfLongestSubstring(s) { /* ...dummy... */ return 3; }`,
    tags: ["Strings"],
  },
  {
    id: 7,
  title: { en: "Product of Array Except Self", id: "Perkalian Array Kecuali Diri Sendiri" },
    difficulty: "Medium",
    category: "Arrays",
    description: {
      en: "Return an array output such that output[i] is equal to the product of all the elements of nums except nums[i].",
      id: "Kembalikan array output sehingga output[i] adalah hasil kali semua elemen nums kecuali nums[i]."
    },
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]", explanation: { en: "Product except self.", id: "Perkalian kecuali diri sendiri." } }
    ],
    constraints: [
      { en: "2 ≤ nums.length ≤ 100000", id: "2 ≤ nums.length ≤ 100000" },
      { en: "-30 ≤ nums[i] ≤ 30", id: "-30 ≤ nums[i] ≤ 30" }
    ],
    hints: ["Use prefix and suffix products."],
    starterCode: {
      javascript: `function productExceptSelf(nums) {\n    // Your solution here\n}`,
      python: `def product_except_self(nums):\n    # Your solution here\n    pass`,
      java: `public class Solution {\n    // Your code here\n}`,
      cpp: `class Solution {\npublic:\n    // Your code here\n};`,
    },
    testCases: [
      { input: [[1,2,3,4]], expectedOutput: [[24,12,8,6]], description: "Test case with input: [1,2,3,4]" }
    ],
    solution: `function productExceptSelf(nums) { /* ...dummy... */ return [24,12,8,6]; }`,
    tags: ["Arrays"],
  },
  // Hard
  {
    id: 8,
  title: { en: "Median of Two Sorted Arrays", id: "Median dari Dua Array Terurut" },
    difficulty: "Hard",
    category: "Arrays",
    description: {
      en: "Find the median of two sorted arrays.",
      id: "Cari median dari dua array yang sudah terurut."
    },
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.0", explanation: { en: "Median is 2.", id: "Median adalah 2." } }
    ],
    constraints: [
      { en: "0 ≤ nums1.length, nums2.length ≤ 1000", id: "0 ≤ nums1.length, nums2.length ≤ 1000" }
    ],
    hints: ["Binary search partitioning."],
    starterCode: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {\n    // Your solution here\n}`,
      python: `def find_median_sorted_arrays(nums1, nums2):\n    # Your solution here\n    pass`,
      java: `public class Solution {\n    // Your code here\n}`,
      cpp: `class Solution {\npublic:\n    // Your code here\n};`,
    },
    testCases: [
      { input: [[1,3],[2]], expectedOutput: [2.0], description: "Test case with input: [1,3],[2]" }
    ],
    solution: `function findMedianSortedArrays(nums1, nums2) { /* ...dummy... */ return 2.0; }`,
    tags: ["Arrays"],
  },
  {
    id: 9,
  title: { en: "Regular Expression Matching", id: "Pencocokan Ekspresi Reguler" },
    difficulty: "Hard",
    category: "Strings",
    description: {
      en: "Implement regular expression matching with support for '.' and '*'.",
      id: "Implementasikan pencocokan ekspresi reguler dengan dukungan '.' dan '*'."
    },
    examples: [
      { input: "s = 'aa', p = 'a*'", output: "true", explanation: { en: "'a*' matches 'aa'.", id: "'a*' cocok dengan 'aa'." } }
    ],
    constraints: [
      { en: "1 ≤ s.length ≤ 20", id: "1 ≤ s.length ≤ 20" },
      { en: "1 ≤ p.length ≤ 30", id: "1 ≤ p.length ≤ 30" }
    ],
    hints: ["Use recursion or DP."],
    starterCode: {
      javascript: `function isMatch(s, p) {\n    // Your solution here\n}`,
      python: `def is_match(s, p):\n    # Your solution here\n    pass`,
      java: `public class Solution {\n    // Your code here\n}`,
      cpp: `class Solution {\npublic:\n    // Your code here\n};`,
    },
    testCases: [
      { input: ["aa","a*"], expectedOutput: [true], description: "Test case with input: 'aa','a*'" }
    ],
    solution: `function isMatch(s, p) { /* ...dummy... */ return true; }`,
    tags: ["Strings"],
  },
  {
    id: 10,
  title: { en: "N-Queens", id: "N-Ratu" },
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      en: "The n-queens puzzle is the problem of placing n queens on an n×n chessboard so that no two queens attack each other.",
      id: "Puzzle n-queens adalah masalah menempatkan n ratu pada papan catur n×n sehingga tidak ada dua ratu yang saling menyerang."
    },
    examples: [
      { input: "n = 4", output: "2", explanation: { en: "There are 2 solutions for n=4.", id: "Ada 2 solusi untuk n=4." } }
    ],
    constraints: [
      { en: "1 ≤ n ≤ 9", id: "1 ≤ n ≤ 9" }
    ],
    hints: ["Backtracking."],
    starterCode: {
      javascript: `function totalNQueens(n) {\n    // Your solution here\n}`,
      python: `def total_n_queens(n):\n    # Your solution here\n    pass`,
      java: `public class Solution {\n    // Your code here\n}`,
      cpp: `class Solution {\npublic:\n    // Your code here\n};`,
    },
    testCases: [
      { input: [4], expectedOutput: [2], description: "Test case with input: 4" }
    ],
    solution: `function totalNQueens(n) { /* ...dummy... */ return 2; }`,
    tags: ["Backtracking"],
  },
];

export default PROBLEMS;
