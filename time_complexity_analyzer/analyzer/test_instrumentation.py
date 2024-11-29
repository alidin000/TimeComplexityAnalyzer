import unittest
import os

import pytest
from analyzer.analyzer import (
    instrument_java_function,
    write_and_compile_java,
    run_java_program,
)
from analyzer.analyzer_python import run_instrumented_python_code
from analyzer.analyzer_cpp import (
    instrument_cpp_function,
    write_and_compile_cpp,
    run_cpp_program,
)


class TestInstrumentation(unittest.TestCase):
    def setUp(self):
        self.output_java_path = os.path.join(os.getcwd(), "analyzer/InstrumentedPrototype.java")
        self.output_cpp_path = os.path.join(os.getcwd(), "analyzer/InstrumentedPrototype.cpp")
        self.output_python_path = os.path.join(os.getcwd(), "analyzer/output_python_50.txt")

    def tearDown(self):
        if os.path.exists(self.output_java_path):
            os.remove(self.output_java_path)
        if os.path.exists(self.output_cpp_path):
            os.remove(self.output_cpp_path)
        if os.path.exists(self.output_python_path):
            os.remove(self.output_python_path)

    @pytest.mark.skipif("CI" in os.environ, reason="Skipping in CI environment")
    def test_java_instrumentation(self):
        user_function = """
        public int sumArray(int[] arr) {
            int sum = 0;
            for (int i = 0; i < arr.length; i++) {
                sum += arr[i];
            }
            return sum;
        }
        """
        call_template = "p.sumArray(input);"
        java_code = instrument_java_function(
            user_function,
            call_template,
            num_inputs=50,
            output_file_path=self.output_java_path,
            size_array=50,
        )

        write_and_compile_java(java_code)
        self.assertTrue(os.path.exists(self.output_java_path))

        run_java_program()

    @pytest.mark.skipif("CI" in os.environ, reason="Skipping in CI environment")
    def test_cpp_instrumentation(self):
        user_function = """
        void sumArray(std::vector<int>& arr) {
            int sum = 0;
            for (int num : arr) {
                sum += num;
            }
        }
        """
        call_template = "p.sumArray(input);"
        cpp_code = instrument_cpp_function(user_function, call_template, num_inputs=50, size_array=50)

        write_and_compile_cpp(cpp_code)
        self.assertTrue(os.path.exists(self.output_cpp_path))

        run_cpp_program()

    @pytest.mark.skipif("CI" in os.environ, reason="Skipping in CI environment")
    def test_python_instrumentation(self):
        user_code = """
        def sum_array(arr):
            total = 0
            for num in arr:
                total += num
            return total
        """
        run_instrumented_python_code(user_code, number_of_inputs=50, size_array=50)

        self.assertTrue(os.path.exists(self.output_python_path))
