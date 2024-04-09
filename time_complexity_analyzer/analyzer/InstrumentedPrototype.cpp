
#include <iostream>
#include <fstream>
#include <chrono>
#include <map>
#include <vector>

class InstrumentedPrototype {
public:
    std::map<int, std::chrono::high_resolution_clock::time_point> lineInfoLastStart;
    std::map<int, long long> lineInfoTotal;

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
    
void mySortFunction(std::vector<int>& array) {

            lineInfoLastStart[1] = std::chrono::high_resolution_clock::now();
                for (size_t i = 0; i < array.size(); ++i) {
            lineInfoTotal[1] += std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::high_resolution_clock::now() - getLastLineInfo(1)).count();

            lineInfoLastStart[2] = std::chrono::high_resolution_clock::now();
                    for (size_t j = i + 1; j < array.size(); ++j) {
            lineInfoTotal[2] += std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::high_resolution_clock::now() - getLastLineInfo(2)).count();

            lineInfoLastStart[3] = std::chrono::high_resolution_clock::now();
                        if (array[i] > array[j]) {
            lineInfoTotal[3] += std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::high_resolution_clock::now() - getLastLineInfo(3)).count();

            lineInfoLastStart[4] = std::chrono::high_resolution_clock::now();
                            int temp = array[i];
            lineInfoTotal[4] += std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::high_resolution_clock::now() - getLastLineInfo(4)).count();

            lineInfoLastStart[5] = std::chrono::high_resolution_clock::now();
                            array[i] = array[j];
            lineInfoTotal[5] += std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::high_resolution_clock::now() - getLastLineInfo(5)).count();

            lineInfoLastStart[6] = std::chrono::high_resolution_clock::now();
                            array[j] = temp;
            lineInfoTotal[6] += std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::high_resolution_clock::now() - getLastLineInfo(6)).count();
            }
        }
    }
    }

    void execute() {
        std::vector<int> array = {3, 4, 5, 6, 0};
        mySortFunction(array);
    }

    void saveResults() {
        std::ofstream outFile("time_complexity_analyzer/analyzer/output_cpp.txt");
        for (auto& pair : lineInfoTotal) {
            outFile << "Line " << pair.first << ": " << pair.second << "ns\n";
        }
        outFile.close();
    }
};

int main() {
    InstrumentedPrototype p;
    p.execute();
    p.saveResults();
    return 0;
}
