import platform
import subprocess
import os

def ensure_directory_exists(path):
    if not os.path.exists(path):
        os.makedirs(path)

def instrument_cpp_function(call, user_function, num_inputs=10):
    cpp_prolog = """
#include <iostream>
#include <fstream>
#include <chrono>
#include <map>
#include <vector>

class InstrumentedPrototype {
public:
    std::map<int, std::chrono::high_resolution_clock::time_point> lineInfoLastStart;
    std::map<int, long long> lineInfoTotal;
    std::chrono::high_resolution_clock::time_point functionStartTime;

    InstrumentedPrototype() {
        // Constructor
    }

    std::chrono::high_resolution_clock::time_point getLastLineInfo(int lineNumber) {
        auto it = lineInfoLastStart.find(lineNumber);
        if (it != lineInfoLastStart.end()) {
            return it->second;
        } else if (lineNumber > 1) {
            return getLastLineInfo(lineNumber - 1);
        }
        return std::chrono::high_resolution_clock::now();
    }
    """

    cpp_epilog = f"""
    std::vector<int> generateRandomArray(int size) {{
        std::vector<int> array(size);
        srand(time(0)); 

        for (int i = 0; i < size; ++i) {{
            array[i] = rand() % 100;
        }}

        return array;
    }}
        
    void execute(std::vector<int>& _array) {{
        std::vector<int> array = _array;
        functionStartTime = std::chrono::high_resolution_clock::now();
        {call}
        lineInfoTotal[0] = std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::high_resolution_clock::now() - functionStartTime).count(); // Total function execution time
    }}
}};

int main() {{
    std::ofstream outFile("output_cpp.txt");
    if (!outFile) {{
        std::cerr << "Error: Could not open the file for writing." << std::endl;
        return 1; // Return an error code
    }}

    for(int i = 0; i < {num_inputs}; i++) {{
        InstrumentedPrototype p;
        std::vector<int> array = p.generateRandomArray(i + 1);
        p.execute(array);

        outFile << "size = " << i+1 << "\\n";
        outFile << "Function execution time: " << p.lineInfoTotal[0] << " ns\\n";
        outFile << "{{";
        bool isFirst = true;
        for (auto it = ++p.lineInfoTotal.begin(); it != p.lineInfoTotal.end(); ++it) {{
            if (!isFirst) outFile << ", ";
            isFirst = false;
            outFile << it->first << "=" << it->second;
        }}
        outFile << "}}\\n";
    }}
    outFile.close();
    return 0;
}}
"""

    instrumented_lines = [cpp_prolog]
    lines = user_function.strip().split('\n')
    closing_brace_index = len(lines) - lines[::-1].index('}') - 1

    instrumented_lines.append(lines[0])

    for i, line in enumerate(lines[1:closing_brace_index], start=1):
        if line.strip() and line.strip() != "}":  
            instrumented_line = f"""
            lineInfoLastStart[{i}] = std::chrono::high_resolution_clock::now();
            {line}
            lineInfoTotal[{i}] += std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::high_resolution_clock::now() - getLastLineInfo({i})).count();"""
            instrumented_lines.append(instrumented_line)
        else:
            instrumented_lines.append(line)  

    instrumented_lines.append('    ' + lines[closing_brace_index])

    instrumented_lines.append(cpp_epilog)

    instrumented_function = "\n".join(instrumented_lines)

    return instrumented_function

def write_and_compile_cpp(instrumented_code, cpp_file_path, executable_path):
    with open(cpp_file_path, "w") as cpp_file:
        cpp_file.write(instrumented_code)

    compile_command = f"g++ -std=c++14 {cpp_file_path} -o {executable_path}"
    result = subprocess.run(compile_command, shell=True)
    if result.returncode != 0:
        raise RuntimeError(f"Compilation failed with return code {result.returncode}")

def run_cpp_program(executable_path):
    if platform.system() == "Windows":
        run_command = f"{executable_path}.exe"
    else:
        run_command = f"./{executable_path}"

    result = subprocess.run(run_command, shell=True)
    if result.returncode != 0:
        raise RuntimeError(f"Execution failed with return code {result.returncode}")

def run_cpp_analysis(call, user_function, num_inputs=10):
    script_dir = os.path.dirname(os.path.realpath(__file__))
    ensure_directory_exists(script_dir)

    cpp_file_name = "InstrumentedPrototype"
    cpp_file_path = os.path.join(script_dir, f"{cpp_file_name}.cpp")
    executable_path = os.path.join(script_dir, cpp_file_name)

    instrumented_code = instrument_cpp_function(call, user_function, num_inputs)

    write_and_compile_cpp(instrumented_code, cpp_file_path, executable_path)

    run_cpp_program(executable_path)

# Example usage
# call = "squareArray(array);"
# user_function = """
# void squareArray(std::vector<int>& arr) {
#     for (int i = 0; i < arr.size(); ++i) {
#         arr[i] = arr[i] * arr[i];
#     }
# }
# """
# num_inputs = 50

# run_cpp_analysis(call, user_function, num_inputs)
