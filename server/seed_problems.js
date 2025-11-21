const axios = require('axios');

const API_URL = 'http://localhost:5000/problems';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjAzNDc1NjBjNDE2YWMyZWFkYzA1ZiIsImlhdCI6MTc2MzcxODI2MSwiZXhwIjoxNzY2MzEwMjYxfQ.N9af6t_eBVFLvWY9w20bd5roDI4y_1VY-cqhD0sgDR8';

const problems = [
  {
    title: "Sum of Two Numbers",
    description: "Write a program that reads two integers from standard input and prints their sum to standard output.\n\n**Input Format**\nTwo integers separated by a space.\n\n**Output Format**\nA single integer representing the sum.",
    difficulty: "Easy",
    starterCode: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    if (cin >> a >> b) {\n        cout << a + b << endl;\n    }\n    return 0;\n}",
    testCases: [
      { input: "3 5", output: "8", hidden: false },
      { input: "10 20", output: "30", hidden: true },
      { input: "-5 5", output: "0", hidden: true }
    ]
  },
  {
    title: "Reverse String",
    description: "Read a string from standard input and print its reverse.\n\n**Input Format**\nA single string.\n\n**Output Format**\nThe reversed string.",
    difficulty: "Easy",
    starterCode: "#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    reverse(s.begin(), s.end());\n    cout << s << endl;\n    return 0;\n}",
    testCases: [
      { input: "hello", output: "olleh", hidden: false },
      { input: "world", output: "dlrow", hidden: true },
      { input: "racecar", output: "racecar", hidden: true }
    ]
  },
  {
    title: "Check Odd or Even",
    description: "Read an integer and print 'Even' if it is even, or 'Odd' if it is odd.\n\n**Input Format**\nA single integer.\n\n**Output Format**\n'Even' or 'Odd'.",
    difficulty: "Easy",
    starterCode: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    if (n % 2 == 0) cout << \"Even\" << endl;\n    else cout << \"Odd\" << endl;\n    return 0;\n}",
    testCases: [
      { input: "4", output: "Even", hidden: false },
      { input: "7", output: "Odd", hidden: true },
      { input: "0", output: "Even", hidden: true }
    ]
  },
  {
    title: "Factorial",
    description: "Calculate the factorial of a non-negative integer n.\n\n**Input Format**\nA single integer n.\n\n**Output Format**\nThe factorial of n.",
    difficulty: "Medium",
    starterCode: "#include <iostream>\nusing namespace std;\n\nlong long factorial(int n) {\n    if (n == 0) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << factorial(n) << endl;\n    return 0;\n}",
    testCases: [
      { input: "5", output: "120", hidden: false },
      { input: "0", output: "1", hidden: true },
      { input: "10", output: "3628800", hidden: true }
    ]
  },
  {
    title: "Fibonacci Number",
    description: "Print the nth Fibonacci number. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).\n\n**Input Format**\nA single integer n.\n\n**Output Format**\nThe nth Fibonacci number.",
    difficulty: "Medium",
    starterCode: "#include <iostream>\nusing namespace std;\n\nint fib(int n) {\n    if (n <= 1) return n;\n    return fib(n-1) + fib(n-2);\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << fib(n) << endl;\n    return 0;\n}",
    testCases: [
      { input: "5", output: "5", hidden: false },
      { input: "10", output: "55", hidden: true },
      { input: "0", output: "0", hidden: true }
    ]
  },
  {
    title: "Prime Checker",
    description: "Check if a number is prime.\n\n**Input Format**\nA single integer n.\n\n**Output Format**\n'True' if prime, 'False' otherwise.",
    difficulty: "Medium",
    starterCode: "#include <iostream>\nusing namespace std;\n\nbool isPrime(int n) {\n    if (n <= 1) return false;\n    for (int i = 2; i * i <= n; i++) {\n        if (n % i == 0) return false;\n    }\n    return true;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    if (isPrime(n)) cout << \"True\" << endl;\n    else cout << \"False\" << endl;\n    return 0;\n}",
    testCases: [
      { input: "7", output: "True", hidden: false },
      { input: "10", output: "False", hidden: true },
      { input: "2", output: "True", hidden: true }
    ]
  },
  {
    title: "Array Sum",
    description: "Calculate the sum of an array of integers.\n\n**Input Format**\nThe first line contains an integer n, the size of the array.\nThe second line contains n space-separated integers.\n\n**Output Format**\nThe sum of the array elements.",
    difficulty: "Medium",
    starterCode: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    long long sum = 0;\n    for (int i = 0; i < n; i++) {\n        int x;\n        cin >> x;\n        sum += x;\n    }\n    cout << sum << endl;\n    return 0;\n}",
    testCases: [
      { input: "3\n1 2 3", output: "6", hidden: false },
      { input: "5\n10 20 30 40 50", output: "150", hidden: true },
      { input: "1\n5", output: "5", hidden: true }
    ]
  },
  {
    title: "Sort Array",
    description: "Sort an array of integers in ascending order.\n\n**Input Format**\nThe first line contains n.\nThe second line contains n integers.\n\n**Output Format**\nThe sorted integers separated by space.",
    difficulty: "Hard",
    starterCode: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    sort(arr.begin(), arr.end());\n    for (int i = 0; i < n; i++) {\n        cout << arr[i] << (i == n-1 ? \"\" : \" \");\n    }\n    cout << endl;\n    return 0;\n}",
    testCases: [
      { input: "5\n5 4 3 2 1", output: "1 2 3 4 5", hidden: false },
      { input: "3\n10 1 5", output: "1 5 10", hidden: true },
      { input: "4\n1 1 1 1", output: "1 1 1 1", hidden: true }
    ]
  },
  {
    title: "Longest Increasing Subsequence",
    description: "Find the length of the longest increasing subsequence.\n\n**Input Format**\nThe first line contains n.\nThe second line contains n integers.\n\n**Output Format**\nThe length of the LIS.",
    difficulty: "Hard",
    starterCode: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    if (n == 0) { cout << 0 << endl; return 0; }\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    vector<int> tails;\n    for (int x : nums) {\n        auto it = lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end()) tails.push_back(x);\n        else *it = x;\n    }\n    cout << tails.size() << endl;\n    return 0;\n}",
    testCases: [
      { input: "6\n10 9 2 5 3 7 101 18", output: "4", hidden: false },
      { input: "6\n0 1 0 3 2 3", output: "4", hidden: true },
      { input: "7\n7 7 7 7 7 7 7", output: "1", hidden: true }
    ]
  },
  {
    title: "Knapsack Problem",
    description: "0/1 Knapsack Problem. Find max value.\n\n**Input Format**\nFirst line: W (capacity) and n (number of items).\nSecond line: n values.\nThird line: n weights.\n\n**Output Format**\nMax value.",
    difficulty: "Hard",
    starterCode: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int W, n;\n    cin >> W >> n;\n    vector<int> val(n), wt(n);\n    for (int i = 0; i < n; i++) cin >> val[i];\n    for (int i = 0; i < n; i++) cin >> wt[i];\n    vector<int> dp(W + 1, 0);\n    for (int i = 0; i < n; i++) {\n        for (int w = W; w >= wt[i]; w--) {\n            dp[w] = max(dp[w], dp[w - wt[i]] + val[i]);\n        }\n    }\n    cout << dp[W] << endl;\n    return 0;\n}",
    testCases: [
      { input: "50 3\n60 100 120\n10 20 30", output: "220", hidden: false },
      { input: "10 1\n10\n5", output: "10", hidden: true },
      { input: "10 1\n10\n15", output: "0", hidden: true }
    ]
  }
];

async function seed() {
  console.log('Seeding problems...');
  for (const problem of problems) {
    try {
      await axios.post(API_URL, problem, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      console.log(`Added: ${problem.title}`);
    } catch (error) {
      console.error(`Failed to add ${problem.title}:`, error.response ? error.response.data : error.message);
    }
  }
  console.log('Done!');
}

seed();
