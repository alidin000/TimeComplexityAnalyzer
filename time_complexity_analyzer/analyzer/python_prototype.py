
import time

class Prototype:
    def __init__(self):
        self.line_info_total = {}
        self.line_info_total[1] = 0
        start_time_1 = time.time()
        def bubble_sort(array):
                    self.line_info_total[1] += time.time() - start_time_1
        self.line_info_total[2] = 0
        start_time_2 = time.time()
            for i in range(len(array)):
                    self.line_info_total[2] += time.time() - start_time_2
        self.line_info_total[3] = 0
        start_time_3 = time.time()
                for j in range(i + 1, len(array)):
                    self.line_info_total[3] += time.time() - start_time_3
        self.line_info_total[4] = 0
        start_time_4 = time.time()
                    if array[i] > array[j]:
                    self.line_info_total[4] += time.time() - start_time_4
        self.line_info_total[5] = 0
        start_time_5 = time.time()
                        array[i], array[j] = array[j], array[i]
        self.line_info_total[5] += time.time() - start_time_5

    def run(self):
        p = Prototype()
        p.bubble_sort([3, 4, 5, 6])
        for line_num, total_time in self.line_info_total.items():
            print(f"Line {line_num}: {total_time} seconds")
