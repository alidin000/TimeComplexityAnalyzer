import React, { useState } from "react";

// Data for algorithms
const algorithmsData = [
  {
    name: "Insertion Sort",
    description: "Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.",
    code: {
      python: `def insertionSort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i-1\n        while j >=0 and key < arr[j] :\n                arr[j+1] = arr[j]\n                j -= 1\n        arr[j+1] = key\n    return arr`,
      javascript: `function insertionSort(arr) {\n    for (let i = 1; i < arr.length; i++) {\n        let key = arr[i];\n        let j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j = j - 1;\n        }\n        arr[j + 1] = key;\n    }\n    return arr;\n}`,
      java: `public void insertionSort(int arr[]) {\n    for (int i=1; i<arr.length; ++i) {\n        int key = arr[i];\n        int j = i-1;\n        while (j>=0 && arr[j] > key) {\n            arr[j+1] = arr[j];\n            j = j-1;\n        }\n        arr[j+1] = key;\n    }\n}`
    },
    video: "https://www.example.com/insertionsort-video",
    quiz: [
      { question: "What type of sorting algorithm is Insertion Sort?", answer: "Insertion Sort is a comparison-based sorting algorithm." },
      { question: "What is the best case time complexity of Insertion Sort?", answer: "The best case time complexity is O(n) when the array is already sorted." },
      { question: "How does Insertion Sort work?", answer: "It builds the final sorted array one item at a time by inserting each item into its proper place among the previously sorted items." },
      { question: "Is Insertion Sort stable?", answer: "Yes, Insertion Sort is stable as it does not change the relative order of elements with equal keys." },
      { question: "Can Insertion Sort be used for linked lists?", answer: "Yes, Insertion Sort can be efficiently implemented for linked lists because of their ability to insert items efficiently." },
      { question: "What is the space complexity of Insertion Sort?", answer: "The space complexity is O(1) as it is an in-place sorting algorithm." },
      { question: "Why might Insertion Sort be preferred over more efficient algorithms in some cases?", answer: "Due to its simplicity and efficiency when dealing with small data sets or nearly sorted arrays." },
      { question: "How does Insertion Sort perform on a reverse sorted array?", answer: "It performs poorly, with a time complexity of O(n^2), since each element needs to be moved to the beginning of the array." },
      { question: "What is a practical real-world use case for Insertion Sort?", answer: "It is used in algorithms where the data is coming in live and the array needs to be sorted as data arrives." },
      { question: "What happens during each iteration of Insertion Sort?", answer: "Each iteration removes one element from the input data, finds the location it belongs within the sorted list, and inserts it there." }
    ]
  },
  {
    name: "Selection Sort",
    description: "Selection Sort is an in-place comparison-based algorithm in which the list is divided into two parts, the sorted part at the left end and the unsorted part at the right end. Initially, the sorted part is empty and the unsorted part is the entire list.",
    code: {
      python: `def selectionSort(arr):\n    for i in range(len(arr)):\n        min_idx = i\n        for j in range(i+1, len(arr)):\n            if arr[min_idx] > arr[j]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr`,
      javascript: `function selectionSort(arr) {\n    for (let i = 0; i < arr.length; i++) {\n        let minIdx = i;\n        for (let j = i+1; j < arr.length; j++) {\n            if (arr[minIdx] > arr[j]) {\n                minIdx = j;\n            }\n        }\n        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];\n    }\n    return arr;\n}`,
      java: `public void selectionSort(int arr[]) {\n    for (int i = 0; i < arr.length-1; i++) {\n        int min_idx = i;\n        for (int j = i+1; j < arr.length; j++)\n            if (arr[min_idx] > arr[j])\n                min_idx = j;\n        int temp = arr[min_idx];\n        arr[min_idx] = arr[i];\n        arr[i] = temp;\n    }\n}`
    },
    video: "https://www.example.com/selectionsort-video",
    quiz: [
      { question: "What type of algorithm is Selection Sort?", answer: "Selection Sort is a comparison-based sorting algorithm." },
      { question: "What is the time complexity of Selection Sort in all cases?", answer: "The time complexity of Selection Sort is O(n^2) in all cases, making it inefficient on large lists." },
      { question: "How does Selection Sort work?", answer: "It repeatedly selects the minimum element from the unsorted segment of the array and moves it to the end of the sorted segment." },
      { question: "Is Selection Sort stable?", answer: "No, Selection Sort is not stable as it can change the relative order of elements with equal keys." },
      { question: "What is the space complexity of Selection Sort?", answer: "The space complexity is O(1) as it is an in-place sorting algorithm." },
      { question: "Why is Selection Sort not suitable for large data sets?", answer: "Due to its quadratic time complexity, which makes it slow compared to more advanced sorting algorithms like quicksort or mergesort." },
      { question: "How does the sorted and unsorted parts of the array change during Selection Sort?", answer: "The sorted part grows from the left end and the unsorted part shrinks in size as elements are selected and moved to the sorted part." },
      { question: "Can Selection Sort be optimized for better performance?", answer: "While the basic logic of Selection Sort leads to a quadratic time complexity, minor optimizations like reducing the number of swaps might slightly improve performance but not the overall complexity." },
      { question: "What is a real-world analogy for Selection Sort?", answer: "A real-world analogy for Selection Sort is selecting the smallest book by thickness from a row of books on a shelf and placing it in its correct position on another shelf." },
      { question: "What happens in each iteration of Selection Sort?", answer: "In each iteration, the smallest element from the unsorted section is selected and swapped with the element at the beginning of the unsorted section." }
    ]
  },
  {
    name: "Heap Sort",
    description: "Heap Sort is a comparison based sorting technique based on Binary Heap data structure. It is similar to selection sort where we first find the maximum element and place the maximum element at the end. We repeat the same process for the remaining elements.",
    code: {
      python: `def heapSort(arr):\n    def heapify(arr, n, i):\n        largest = i\n        l = 2 * i + 1\n        r = 2 * i + 2\n\n        if l < n and arr[l] > arr[largest]:\n            largest = l\n\n        if r < n and arr[r] > arr[largest]:\n            largest = r\n\n        if largest != i:\n            arr[i], arr[largest] = arr[largest], arr[i]\n            heapify(arr, n, largest)\n\n    n = len(arr)\n    for i in range(n // 2 - 1, -1, -1):\n        heapify(arr, n, i)\n\n    for i in range(n-1, 0, -1):\n        arr[0], arr[i] = arr[i], arr[0]\n        heapify(arr, n-i, 0)\n    return arr`,
      javascript: `function heapSort(arr) {\n    function heapify(arr, n, i) {\n        let largest = i;\n        let left = 2 * i + 1;\n        let right = 2 * i + 2;\n\n        if (left < n && arr[left] > arr[largest]) largest = left;\n        if (right < n && arr[right] > arr[largest]) largest = right;\n\n        if (largest != i) {\n            [arr[i], arr[largest]] = [arr[largest], arr[i]];\n            heapify(arr, n, largest);\n        }\n    }\n    let n = arr.length;\n    for (let i = n / 2 - 1; i >= 0; i--) {\n        heapify(arr, n, i);\n    }\n    for (let i = n - 1; i > 0; i--) {\n        [arr[0], arr[i]] = [arr[i], arr[0]];\n        heapify(arr, i, 0);\n    }\n    return arr;\n}`,
      java: `public void heapSort(int arr[]) {
        void heapify(int arr[], int n, int i) {
            int largest = i;
            int l = 2 * i + 1;
            int r = 2 * i + 2;

            if (l < n && arr[l] > arr[largest])
                largest = l;
            if (r < n && arr[r] > arr[largest])
                largest = r;

            if (largest != i) {
                int swap = arr[i];
                arr[i] = arr[largest];
                arr[largest] = swap;
                heapify(arr, n, largest);
            }
        }
        int n = arr.length;
        for (int i = n / 2 - 1; i >= 0; i--)
            heapify(arr, n, i);
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            heapify(arr, i, 0);
        }
    }`
  },
  video: "https://www.example.com/heapsort-video",
  quiz: [
    { question: "What type of sorting algorithm is Heap Sort?", answer: "Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure." },
    { question: "What is the time complexity of Heap Sort?", answer: "The time complexity of Heap Sort is O(n log n) for all cases." },
    { question: "How does Heap Sort differ from Selection Sort?", answer: "While both are comparison-based and selection-driven, Heap Sort uses a binary heap structure to optimize the selection process, making it faster." },
    { question: "Is Heap Sort stable?", answer: "No, Heap Sort is not stable as it can change the relative order of equal elements." },
    { question: "What is the space complexity of Heap Sort?", answer: "The space complexity is O(1) as it sorts in place without needing additional space for another array." },
    { question: "Why is Heap Sort considered an efficient algorithm?", answer: "Its efficiency comes from its ability to maintain the max heap property and sort the array in O(n log n) time complexity without additional memory usage." },
    { question: "What is the heapify function's role in Heap Sort?", answer: "Heapify maintains the heap structure after each extraction of the maximum element, ensuring the heap properties are preserved throughout sorting." },
    { question: "Can Heap Sort be used for priority queue implementations?", answer: "Yes, Heap Sort is well-suited for priority queues where elements are continuously inserted and the maximum needs to be efficiently extracted." },
    { question: "How does Heap Sort perform on a sorted array?", answer: "Heap Sort still performs at O(n log n) on a sorted array, unlike algorithms like Bubble Sort which may have better performance in this scenario." },
    { question: "What real-world applications use Heap Sort?", answer: "Heap Sort is used in applications that require efficient and reliable sorting with minimal memory usage, such as embedded systems or real-time processing systems." }
  ]
}
];


const LearningPage = () => {
  const [selectedTab, setSelectedTab] = useState('Algorithms');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithmsData[0].name);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="learning-page" style={{ display: 'flex', flexDirection: 'row' }}>
      <div className="left-panel" style={{ width: '200px', marginRight: '20px' }}>
        <h2 className="subtopics-heading">Algorithm Topics</h2>
        <div className="card">
          <AlgorithmTopicsList onSelect={setSelectedAlgorithm} />
        </div>
      </div>
      <div className="right-panel" style={{ flex: 1 }}>
        <div className="tab-switcher">
          <TabButton onClick={() => handleTabChange('Algorithms')} active={selectedTab === 'Algorithms'}>Algorithms</TabButton>
          <TabButton onClick={() => handleTabChange('Quizzes')} active={selectedTab === 'Quizzes'}>Quizzes</TabButton>
        </div>
        <div className="topics-section">
          {selectedTab === 'Algorithms' ? <AlgorithmsContent algorithmName={selectedAlgorithm} /> : <QuizzesContent algorithm={algorithmsData.find(algo => algo.name === selectedAlgorithm)} />}
        </div>
      </div>
    </div>
  );
};

const AlgorithmTopicsList = ({ onSelect }) => {
  return (
    <div className="algorithm-topics-list" style={{ display: 'flex', flexDirection: 'column' }}>
      {algorithmsData.map((algo, index) => (
        <button key={index} onClick={() => onSelect(algo.name)} style={{ padding: '10px', margin: '5px 0', textAlign: 'left', width: '100%' }}>{algo.name}</button>
      ))}
    </div>
  );
};

const AlgorithmsContent = ({ algorithmName }) => {
  const [selectedSwitcher, setSelectedSwitcher] = useState('Description');
  const [language, setLanguage] = useState('python');
  const algorithm = algorithmsData.find(algo => algo.name === algorithmName);

  const renderContent = () => {
    switch (selectedSwitcher) {
      case 'Description':
        return <p>{algorithm.description}</p>;
      case 'Code':
        return (
          <div>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
            </select>
            <pre>{algorithm.code[language]}</pre>
          </div>
        );
      case 'Visualization':
        return <iframe src={algorithm.video} title="Algorithm Visualization" width="560" height="315" allowFullScreen></iframe>;
      default:
        return null;
    }
  };

  return (
    <div className="algorithms-content">
      <div className="switchers">
        <SwitcherButton onClick={() => setSelectedSwitcher('Description')} active={selectedSwitcher === 'Description'}>Description</SwitcherButton>
        <SwitcherButton onClick={() => setSelectedSwitcher('Code')} active={selectedSwitcher === 'Code'}>Code</SwitcherButton>
        <SwitcherButton onClick={() => setSelectedSwitcher('Visualization')} active={selectedSwitcher === 'Visualization'}>Visualization</SwitcherButton>
      </div>
      <div className="output">
        {renderContent()}
      </div>
    </div>
  );
};

const QuizzesContent = ({ algorithm }) => {
  // Only render QuizComponent if there are quiz questions
  if (algorithm && algorithm.quiz && algorithm.quiz.length > 0) {
    return <QuizComponent quizData={algorithm.quiz} />;
  } else {
    return <p>No quiz available for this algorithm.</p>;
  }
};

const QuizComponent = ({ quizData }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const handleAnswer = () => {
    if (selectedOption === quizData[currentQuestionIndex].answer) {
      setCorrectAnswers(correctAnswers + 1);
    }
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < quizData.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setSelectedOption(null); // Clear previous selection
    } else {
      alert(`Quiz completed. You scored ${correctAnswers} out of ${quizData.length}`);
      setCurrentQuestionIndex(0); // Reset quiz
      setCorrectAnswers(0); // Reset score
      setSelectedOption(null); // Clear selection
    }
  };

  if (!quizData || quizData.length === 0 || !quizData[currentQuestionIndex].options) {
    return <p>No quiz or quiz options available.</p>;
  }

  return (
    <div>
      <h3>{quizData[currentQuestionIndex].question}</h3>
      {quizData[currentQuestionIndex].options.map((option, index) => (
        <button key={index} onClick={() => setSelectedOption(option)} className={selectedOption === option ? 'selected' : ''}>{option}</button>
      ))}
      <button onClick={handleAnswer} disabled={!selectedOption}>Submit</button>
    </div>
  );
};


const TabButton = ({ onClick, active, children }) => {
  return (
    <button className={`tab-button ${active ? 'active' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
};

const SwitcherButton = ({ onClick, active, children }) => {
  return (
    <button className={`switcher-button ${active ? 'active' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default LearningPage;