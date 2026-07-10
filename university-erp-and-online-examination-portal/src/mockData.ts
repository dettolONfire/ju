import { Exam, Announcement, StudentProfile, TeacherProfile, StudentAttendance, ExamResult } from './types';

// ==========================================
// 1. SAMPLE EXAMINATIONS (10 MCQ questions each)
// ==========================================
export const initialExams: Exam[] = [
  {
    id: 'exam-cf',
    title: 'Computer Fundamentals',
    description: 'Covers CPU architecture, computer memory hierarchy, binary system, input/output devices, and high-level logic gates.',
    durationMinutes: 10,
    questions: [
      {
        id: 'cf-q1',
        text: 'Which unit is known as the "brain" of the computer system?',
        options: [
          'Memory Unit',
          'Control Unit',
          'Arithmetic and Logic Unit (ALU)',
          'Central Processing Unit (CPU)'
        ],
        correctOptionIndex: 3
      },
      {
        id: 'cf-q2',
        text: 'What is the full form of RAM?',
        options: [
          'Read Access Memory',
          'Random Access Memory',
          'Realtime Active Memory',
          'Row Address Memory'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'cf-q3',
        text: 'Which of the following is non-volatile memory?',
        options: [
          'RAM',
          'Cache Memory',
          'ROM',
          'Registers'
        ],
        correctOptionIndex: 2
      },
      {
        id: 'cf-q4',
        text: 'What is the binary equivalent of the decimal number 13?',
        options: [
          '1100',
          '1101',
          '1011',
          '1111'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'cf-q5',
        text: 'One gigabyte (1 GB) is approximately equal to:',
        options: [
          '1024 Kilobytes',
          '1024 Megabytes',
          '1000 Megabytes',
          '1024 Gigabits'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'cf-q6',
        text: 'Which logic gate output is high ONLY when all its inputs are low?',
        options: [
          'NOR Gate',
          'AND Gate',
          'NAND Gate',
          'OR Gate'
        ],
        correctOptionIndex: 0
      },
      {
        id: 'cf-q7',
        text: 'What type of software is the operating system?',
        options: [
          'Application Software',
          'System Software',
          'Utility Software',
          'Firmware'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'cf-q8',
        text: 'Which component is used to connect the CPU to other hardware parts on the motherboard?',
        options: [
          'Expansion Slots',
          'System Bus',
          'BIOS Chip',
          'Power Supply'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'cf-q9',
        text: 'Which of the following is an input device?',
        options: [
          'Plotter',
          'Monitor',
          'Barcode Reader',
          'Projector'
        ],
        correctOptionIndex: 2
      },
      {
        id: 'cf-q10',
        text: 'What is cache memory used for in a computer?',
        options: [
          'To increase storage capacity',
          'To speed up CPU access to frequently used data',
          'To secure the system from viruses',
          'To store permanent user files'
        ],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 'exam-ds',
    title: 'Data Structures',
    description: 'Tests knowledge of linear structures (Arrays, Linked Lists, Stacks, Queues) and non-linear structures (Trees, Graphs) and algorithms.',
    durationMinutes: 12,
    questions: [
      {
        id: 'ds-q1',
        text: 'Which data structure works on the LIFO (Last In, First Out) principle?',
        options: [
          'Queue',
          'Linked List',
          'Stack',
          'Binary Search Tree'
        ],
        correctOptionIndex: 2
      },
      {
        id: 'ds-q2',
        text: 'In a singly linked list, what does the "next" pointer of the last node point to?',
        options: [
          'The first node (Head)',
          'Null / None',
          'The node itself',
          'A random memory location'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'ds-q3',
        text: 'What is the time complexity of searching an element in a sorted array of size N using Binary Search?',
        options: [
          'O(1)',
          'O(N)',
          'O(N log N)',
          'O(log N)'
        ],
        correctOptionIndex: 3
      },
      {
        id: 'ds-q4',
        text: 'Which data structure is best suited for implementing Breadth-First Search (BFS) on a graph?',
        options: [
          'Stack',
          'Queue',
          'Priority Queue',
          'Hash Table'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'ds-q5',
        text: 'What is the worst-case time complexity of Quick Sort?',
        options: [
          'O(N log N)',
          'O(N^2)',
          'O(N)',
          'O(2^N)'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'ds-q6',
        text: 'Which of the following is NOT a linear data structure?',
        options: [
          'Array',
          'Queue',
          'Binary Tree',
          'Linked List'
        ],
        correctOptionIndex: 2
      },
      {
        id: 'ds-q7',
        text: 'A binary tree in which every level, except possibly the last, is completely filled, and all nodes are as far left as possible is called:',
        options: [
          'Full Binary Tree',
          'Complete Binary Tree',
          'Perfect Binary Tree',
          'Balanced Binary Tree'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'ds-q8',
        text: 'What is the main advantage of a circular queue over a linear queue?',
        options: [
          'It is easier to implement',
          'It uses memory more efficiently by reusing empty cells',
          'It allows searching in O(1) time',
          'It takes up less disk space'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'ds-q9',
        text: 'Which of the following sorting algorithms is stable and has an O(N log N) time complexity in all cases?',
        options: [
          'Selection Sort',
          'Quick Sort',
          'Merge Sort',
          'Bubble Sort'
        ],
        correctOptionIndex: 2
      },
      {
        id: 'ds-q10',
        text: 'What is the load factor of a hash table?',
        options: [
          'Ratio of number of occupied slots to total capacity',
          'Maximum number of elements that can be inserted',
          'Number of hash collisions per second',
          'The average size of each linked bucket'
        ],
        correctOptionIndex: 0
      }
    ]
  },
  {
    id: 'exam-wd',
    title: 'Web Development',
    description: 'Covers HTML semantics, CSS layout modes, vanilla JavaScript DOM manipulation, event loops, and response codes.',
    durationMinutes: 8,
    questions: [
      {
        id: 'wd-q1',
        text: 'Which HTML5 element is used to define key navigation links on a website?',
        options: [
          '<section>',
          '<nav>',
          '<aside>',
          '<menu-list>'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'wd-q2',
        text: 'How do you select an element with ID "header" using a CSS selector?',
        options: [
          '.header',
          'header',
          '#header',
          '*header'
        ],
        correctOptionIndex: 2
      },
      {
        id: 'wd-q3',
        text: 'Which JavaScript method is used to write text directly to an HTML element dynamically?',
        options: [
          'element.textContent',
          'element.writeText()',
          'element.setContent()',
          'element.appendText()'
        ],
        correctOptionIndex: 0
      },
      {
        id: 'wd-q4',
        text: 'What is the purpose of CSS "flex-direction: column"?',
        options: [
          'Aligns flex items side by side horizontally',
          'Stacks flex items vertically on top of each other',
          'Wraps text around image boxes',
          'Creates a grid container'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'wd-q5',
        text: 'What does the HTTP 404 Status Code represent?',
        options: [
          'Internal Server Error',
          'Bad Request',
          'Forbidden Access',
          'Not Found'
        ],
        correctOptionIndex: 3
      },
      {
        id: 'wd-q6',
        text: 'Which JavaScript keyword is block-scoped and allows variable reassignment?',
        options: [
          'var',
          'const',
          'let',
          'global'
        ],
        correctOptionIndex: 2
      },
      {
        id: 'wd-q7',
        text: 'What does CSS "box-sizing: border-box" do?',
        options: [
          'Adds extra margin around elements',
          'Includes padding and borders in the element\'s total width and height',
          'Changes the color of the border to box',
          'Prevents elements from collapsing'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'wd-q8',
        text: 'Which of the following is used to store data in the browser that does not expire when the browser is closed?',
        options: [
          'Session Storage',
          'Cookies',
          'Local Storage',
          'State Variables'
        ],
        correctOptionIndex: 2
      },
      {
        id: 'wd-q9',
        text: 'How can you attach an event listener to a button with the ID "btn" in vanilla JavaScript?',
        options: [
          'document.getElementById("btn").addEventListener("click", callback);',
          'document.getElementById("btn").onClick(callback);',
          'btn.attachEvent("onclick", callback);',
          'document.addListener("btn", "click", callback);'
        ],
        correctOptionIndex: 0
      },
      {
        id: 'wd-q10',
        text: 'What does DOM stand for in web development?',
        options: [
          'Data Object Model',
          'Document Object Module',
          'Document Object Model',
          'Digital Optimal Media'
        ],
        correctOptionIndex: 2
      }
    ]
  },
  {
    id: 'exam-os',
    title: 'Operating Systems',
    description: 'Focuses on Process States, CPU Scheduling, Mutual Exclusion, Deadlocks, Paging, and File Systems.',
    durationMinutes: 10,
    questions: [
      {
        id: 'os-q1',
        text: 'What is a process in an operating system?',
        options: [
          'A program stored on hard disk',
          'A program in execution',
          'A system compiler',
          'A hardware driver'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'os-q2',
        text: 'Which process scheduling algorithm can result in starvation (indefinite postponement)?',
        options: [
          'Round Robin',
          'First-Come First-Served',
          'Shortest Job First (SJF) / Priority-based',
          'FIFO Scheduling'
        ],
        correctOptionIndex: 2
      },
      {
        id: 'os-q3',
        text: 'What are the four necessary conditions for a deadlock to occur?',
        options: [
          'Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait',
          'Paging, Segmentation, Spooling, Buffering',
          'Sharing, Mutex, Waiting, Preemption',
          'Overhead, Latency, Throughput, Starvation'
        ],
        correctOptionIndex: 0
      },
      {
        id: 'os-q4',
        text: 'What is "paging" in memory management?',
        options: [
          'Dividing memory into variable-sized partitions',
          'Dividing logical memory into blocks of the same size',
          'Moving files from SSD to external hard drive',
          'Increasing CPU cache lines'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'os-q5',
        text: 'What is a "page fault"?',
        options: [
          'An error in the HTML page source',
          'An event that occurs when a requested page is not in physical memory (RAM)',
          'A physical defect on the RAM stick',
          'A corruption in the system registry'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'os-q6',
        text: 'What is the primary function of the "Kernel"?',
        options: [
          'To design user layouts',
          'To serve as the core interface between computer hardware and processes',
          'To monitor the user\'s keyboard logs',
          'To speed up internet connection speeds'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'os-q7',
        text: 'Which of the following is a synchronization tool to solve the Critical Section problem?',
        options: [
          'Virtual Memory',
          'Page Table',
          'Semaphore',
          'TLB Cache'
        ],
        correctOptionIndex: 2
      },
      {
        id: 'os-q8',
        text: 'What is a thread in OS context?',
        options: [
          'A cable connecting CPU to RAM',
          'A lightweight process / smallest unit of execution within a process',
          'A security firewall',
          'A hardware bus'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'os-q9',
        text: 'What is "Belady\'s Anomaly" related to?',
        options: [
          'Process scheduling algorithms',
          'Page replacement algorithms (specifically FIFO)',
          'Disk head scheduling',
          'Deadlock detection algorithms'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'os-q10',
        text: 'Which system call is used to create a new child process in UNIX/Linux?',
        options: [
          'exec()',
          'join()',
          'fork()',
          'spawn()'
        ],
        correctOptionIndex: 2
      }
    ]
  },
  {
    id: 'exam-dbms',
    title: 'Database Management System',
    description: 'Tests relational database design, E-R mapping, Normalization forms (1NF, 2NF, 3NF, BCNF), and SQL query constructs.',
    durationMinutes: 10,
    questions: [
      {
        id: 'dbms-q1',
        text: 'Which of the following is a key that uniquely identifies each record in a database table?',
        options: [
          'Foreign Key',
          'Primary Key',
          'Composite Key',
          'Secondary Key'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'dbms-q2',
        text: 'What does "ACID" stand for in database transaction properties?',
        options: [
          'Access, Control, Indexing, Durability',
          'Atomicity, Consistency, Isolation, Durability',
          'Audit, Check, Isolation, Distribution',
          'Atomicity, Concurrency, Integrity, Division'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'dbms-q3',
        text: 'Which SQL command is used to retrieve data from a table?',
        options: [
          'GET',
          'EXTRACT',
          'SELECT',
          'FETCH'
        ],
        correctOptionIndex: 2
      },
      {
        id: 'dbms-q4',
        text: 'A table is in 2NF (Second Normal Form) if it is in 1NF and:',
        options: [
          'Has no transitive dependencies',
          'Has no partial key dependencies',
          'Has no multi-valued attributes',
          'Has at least one foreign key'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'dbms-q5',
        text: 'Which SQL clause is used to filter results of aggregate functions (like SUM, COUNT) after grouping?',
        options: [
          'WHERE',
          'HAVING',
          'GROUP FILTER',
          'ORDER BY'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'dbms-q6',
        text: 'What is a Foreign Key used for?',
        options: [
          'To encrypt the database records',
          'To establish and enforce a link/relationship between data in two tables',
          'To identify the admin user of the database',
          'To speed up full-text searches'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'dbms-q7',
        text: 'Which normal form is strictly stronger than 3NF and addresses anomalies caused by overlapping candidate keys?',
        options: [
          '2NF',
          '4NF',
          'Boyce-Codd Normal Form (BCNF)',
          '5NF'
        ],
        correctOptionIndex: 2
      },
      {
        id: 'dbms-q8',
        text: 'What type of database relationship is formed between "Students" and "Courses" (where a student takes many courses, and a course has many students)?',
        options: [
          'One-to-One',
          'One-to-Many',
          'Many-to-One',
          'Many-to-Many'
        ],
        correctOptionIndex: 3
      },
      {
        id: 'dbms-q9',
        text: 'Which SQL join returns all records when there is a match in either left or right table?',
        options: [
          'INNER JOIN',
          'LEFT JOIN',
          'RIGHT JOIN',
          'FULL OUTER JOIN'
        ],
        correctOptionIndex: 3
      },
      {
        id: 'dbms-q10',
        text: 'In DBMS, what is "metadata"?',
        options: [
          'Data stored in cloud backup servers',
          'Highly secure encrypted data',
          'Data about data (database catalog/schema information)',
          'Temporary log files'
        ],
        correctOptionIndex: 2
      }
    ]
  }
];

// ==========================================
// 2. SAMPLE ANNOUNCEMENTS & REMINDERS
// ==========================================
export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Final Year Project Defense Schedule Released',
    content: 'The external evaluation and project presentation for B.Tech CS Final Year will be held between July 15, 2026 and July 18, 2026. Please ensure your project reports, presentations, and source code are uploaded to the portal. Slots will be allocated by roll number tomorrow.',
    date: '2026-07-08',
    category: 'Project'
  },
  {
    id: 'ann-2',
    title: 'Assignment 3 Submission Deadline Extended',
    content: 'The submission deadline for Web Development Lab Assignment 3 (React Components & Dynamic State) has been extended to July 12, 2026. Submit your ZIP files on the ERP portal before 11:59 PM.',
    date: '2026-07-06',
    category: 'Assignment'
  },
  {
    id: 'ann-3',
    title: 'Mid-Semester Exam Notice for Backlog Students',
    content: 'Backlog exams for Data Structures and Operating Systems are scheduled for July 20, 2026. Contact the exam cell to register and collect your admit card.',
    date: '2026-07-05',
    category: 'Exam'
  },
  {
    id: 'ann-4',
    title: 'Full-Stack React Workshop on July 14',
    content: 'A hands-on workshop on "Modern Full-Stack Applications with Vite, Express, and Tailwind CSS" will be held on July 14, 2026, in Lab 4 from 10:00 AM to 4:00 PM. Highly recommended for project preparation!',
    date: '2026-07-03',
    category: 'Workshop'
  },
  {
    id: 'ann-5',
    title: 'Institutional Holiday - Muharram',
    content: 'The university will remain closed on July 17, 2026, on account of Muharram. No exams or presentation sessions will be scheduled for this day.',
    date: '2026-07-01',
    category: 'Holiday'
  }
];

// ==========================================
// 3. SAMPLE PROFILES
// ==========================================
export const defaultStudentProfile: StudentProfile = {
  name: 'Kavya Sarawagi',
  rollNumber: 'CS2026042',
  course: 'B.Tech Computer Science & Engineering',
  semester: '8th Semester',
  email: 'sarawagikavya@gmail.com',
  phone: '+91 98765 43210'
};

export const defaultTeacherProfile: TeacherProfile = {
  name: 'Dr. Ramesh Kumar',
  department: 'Computer Science & Engineering',
  employeeId: 'T-CSE-108',
  subjects: ['Data Structures', 'Database Management System', 'Web Development'],
  email: 'ramesh.kumar@university.edu'
};

// ==========================================
// 4. SAMPLE ATTENDANCE DATA (All students)
// ==========================================
export const initialAttendance: StudentAttendance[] = [
  {
    studentRoll: 'CS2026042',
    studentName: 'Kavya Sarawagi',
    course: 'B.Tech CSE',
    history: [
      { date: '2026-07-08', status: 'Present' },
      { date: '2026-07-07', status: 'Present' },
      { date: '2026-07-06', status: 'Present' },
      { date: '2026-07-03', status: 'Present' },
      { date: '2026-07-02', status: 'Absent' },
      { date: '2026-07-01', status: 'Present' },
      { date: '2026-06-30', status: 'Present' },
      { date: '2026-06-29', status: 'Present' },
      { date: '2026-06-26', status: 'Present' },
      { date: '2026-06-25', status: 'Present' }
    ]
  },
  {
    studentRoll: 'CS2026015',
    studentName: 'Rahul Sharma',
    course: 'B.Tech CSE',
    history: [
      { date: '2026-07-08', status: 'Present' },
      { date: '2026-07-07', status: 'Absent' },
      { date: '2026-07-06', status: 'Present' },
      { date: '2026-07-03', status: 'Absent' },
      { date: '2026-07-02', status: 'Present' },
      { date: '2026-07-01', status: 'Present' },
      { date: '2026-06-30', status: 'Present' },
      { date: '2026-06-29', status: 'Absent' },
      { date: '2026-06-26', status: 'Present' },
      { date: '2026-06-25', status: 'Present' }
    ]
  },
  {
    studentRoll: 'CS2026028',
    studentName: 'Sneha Patel',
    course: 'B.Tech CSE',
    history: [
      { date: '2026-07-08', status: 'Present' },
      { date: '2026-07-07', status: 'Present' },
      { date: '2026-07-06', status: 'Present' },
      { date: '2026-07-03', status: 'Present' },
      { date: '2026-07-02', status: 'Present' },
      { date: '2026-07-01', status: 'Present' },
      { date: '2026-06-30', status: 'Present' },
      { date: '2026-06-29', status: 'Present' },
      { date: '2026-06-26', status: 'Present' },
      { date: '2026-06-25', status: 'Absent' }
    ]
  },
  {
    studentRoll: 'CS2026004',
    studentName: 'Amit Verma',
    course: 'B.Tech CSE',
    history: [
      { date: '2026-07-08', status: 'Absent' },
      { date: '2026-07-07', status: 'Absent' },
      { date: '2026-07-06', status: 'Present' },
      { date: '2026-07-03', status: 'Present' },
      { date: '2026-07-02', status: 'Present' },
      { date: '2026-07-01', status: 'Present' },
      { date: '2026-06-30', status: 'Absent' },
      { date: '2026-06-29', status: 'Present' },
      { date: '2026-06-26', status: 'Present' },
      { date: '2026-06-25', status: 'Present' }
    ]
  },
  {
    studentRoll: 'CS2026053',
    studentName: 'Priya Das',
    course: 'B.Tech CSE',
    history: [
      { date: '2026-07-08', status: 'Present' },
      { date: '2026-07-07', status: 'Present' },
      { date: '2026-07-06', status: 'Present' },
      { date: '2026-07-03', status: 'Present' },
      { date: '2026-07-02', status: 'Present' },
      { date: '2026-07-01', status: 'Present' },
      { date: '2026-06-30', status: 'Present' },
      { date: '2026-06-29', status: 'Present' },
      { date: '2026-06-26', status: 'Present' },
      { date: '2026-06-25', status: 'Present' }
    ]
  }
];

// ==========================================
// 5. SAMPLE SCORES & RESULTS (Already completed by default students)
// ==========================================
export const initialExamResults: ExamResult[] = [
  {
    examId: 'exam-cf',
    examTitle: 'Computer Fundamentals',
    score: 9,
    totalQuestions: 10,
    percentage: 90,
    passed: true,
    submittedAt: '2026-07-02 11:30 AM'
  },
  {
    examId: 'exam-os',
    examTitle: 'Operating Systems',
    score: 8,
    totalQuestions: 10,
    percentage: 80,
    passed: true,
    submittedAt: '2026-07-05 02:15 PM'
  }
];

// Mock Progress for all students (used in Student Progress table)
export interface StudentProgressRow {
  roll: string;
  name: string;
  course: string;
  completedTests: number;
  marksObtained: number;
  totalMarksPossible: number;
  percentage: number;
  passed: boolean;
}

export const initialStudentProgress: StudentProgressRow[] = [
  {
    roll: 'CS2026042',
    name: 'Kavya Sarawagi',
    course: 'B.Tech CSE',
    completedTests: 2,
    marksObtained: 17,
    totalMarksPossible: 20,
    percentage: 85,
    passed: true
  },
  {
    roll: 'CS2026015',
    name: 'Rahul Sharma',
    course: 'B.Tech CSE',
    completedTests: 1,
    marksObtained: 7,
    totalMarksPossible: 10,
    percentage: 70,
    passed: true
  },
  {
    roll: 'CS2026028',
    name: 'Sneha Patel',
    course: 'B.Tech CSE',
    completedTests: 2,
    marksObtained: 19,
    totalMarksPossible: 20,
    percentage: 95,
    passed: true
  },
  {
    roll: 'CS2026004',
    name: 'Amit Verma',
    course: 'B.Tech CSE',
    completedTests: 2,
    marksObtained: 9,
    totalMarksPossible: 20,
    percentage: 45,
    passed: false
  },
  {
    roll: 'CS2026053',
    name: 'Priya Das',
    course: 'B.Tech CSE',
    completedTests: 2,
    marksObtained: 18,
    totalMarksPossible: 20,
    percentage: 90,
    passed: true
  }
];
