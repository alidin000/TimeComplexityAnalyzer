
#include <iostream>
#include <vector>
#include <ctime>
#include <unordered_map> // Include unordered_map header

using namespace std;

    clock_t start_time_1 = clock();
    void bubble_sort(vector<int>& array) {
    cout << "Line 1: " << (clock() - start_time_1) / (double)CLOCKS_PER_SEC << " seconds" << endl;
    clock_t start_time_2 = clock();
        for (size_t i = 0; i < array.size(); ++i) {
    cout << "Line 2: " << (clock() - start_time_2) / (double)CLOCKS_PER_SEC << " seconds" << endl;
    clock_t start_time_3 = clock();
            for (size_t j = i + 1; j < array.size(); ++j) {
    cout << "Line 3: " << (clock() - start_time_3) / (double)CLOCKS_PER_SEC << " seconds" << endl;
    clock_t start_time_4 = clock();
                if (array[i] > array[j]) {
    cout << "Line 4: " << (clock() - start_time_4) / (double)CLOCKS_PER_SEC << " seconds" << endl;
    clock_t start_time_5 = clock();
                    swap(array[i], array[j]);
    cout << "Line 5: " << (clock() - start_time_5) / (double)CLOCKS_PER_SEC << " seconds" << endl;
    clock_t start_time_6 = clock();
                }
    cout << "Line 6: " << (clock() - start_time_6) / (double)CLOCKS_PER_SEC << " seconds" << endl;
    clock_t start_time_7 = clock();
            }
    cout << "Line 7: " << (clock() - start_time_7) / (double)CLOCKS_PER_SEC << " seconds" << endl;
    clock_t start_time_8 = clock();
        }
    cout << "Line 8: " << (clock() - start_time_8) / (double)CLOCKS_PER_SEC << " seconds" << endl;
    clock_t start_time_9 = clock();
    }
    cout << "Line 9: " << (clock() - start_time_9) / (double)CLOCKS_PER_SEC << " seconds" << endl;

int main() {
    bubble_sort({3, 4, 5, 6});
}
