def instrument_cpp_code(call, user_code):
    cpp_prolog = """
#include <iostream>
#include <fstream>
#include <unordered_map>
#include <vector>
#include <chrono>

using namespace std;
using namespace std::chrono;

class Prototype {
public:
"""

    cpp_epilog = """
    unordered_map<int, long long> lineInfoLastStart;
    unordered_map<int, long long> lineInfoTotal;

    void run() {
        """ + call + """
        ofstream outputFile("output.txt");
        for (const auto& pair : lineInfoTotal) {
            outputFile << pair.first << ": " << pair.second << endl;
        }
        outputFile.close();
    }
};
"""

    return (cpp_prolog +
            '\n'.join(
                f"lineInfoLastStart[{i+1}] = duration_cast<nanoseconds>(steady_clock::now().time_since_epoch()).count();" +
                x +
                f"lineInfoTotal[{i+1}] += duration_cast<nanoseconds>(steady_clock::now().time_since_epoch()).count() - lineInfoLastStart[{i+1}];" for i, x in enumerate(user_code.splitlines())) +
            cpp_epilog)


# Usage example
cpp_code = instrument_cpp_code("p.bubbleSort({3, 4, 5, 6});", """
void bubbleSort(vector<int>& array) {
    for (int i = 0; i < array.size(); i++) {
        for (int j = i + 1; j < array.size(); j++) {
            if (array[i] > array[j]) {
                int temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
    }
}
""")

with open("prototype.cpp", "w") as cpp_file:
    cpp_file.write(cpp_code)

# Python script to use the generated C++ code
python_script = """
import subprocess

# Compile the C++ code
subprocess.run(["g++", "prototype.cpp", "-o", "prototype"])

# Execute the compiled program
subprocess.run(["./prototype"])
"""

with open("use_prototype.py", "w") as py_file:
    py_file.write(python_script)
