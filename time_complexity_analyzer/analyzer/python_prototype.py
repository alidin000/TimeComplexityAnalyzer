
import time

class Prototype:
    def __init__(self):
        self.line_info_total = {}
    def bubble_sort(array):
        for i in range(len(array)):
            for j in range(i + 1, len(array)):
                if array[i] > array[j]:
                    self.line_info_total[4] = 0
                    start_time_4 = time.time()
                    array[i], array[j] = array[j], array[i]
                    self.line_info_total[4] += time.time() - start_time_4

    def run(self):
        p = Prototype()
        p.bubble_sort([3, 4, 5, 6])
        for line_num, total_time in self.line_info_total.items():
            print(f"Line {line_num}: {total_time} seconds")
