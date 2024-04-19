import re
import subprocess
import os

def instrument_java_function(user_function, call_template, num_inputs):
    function_name = re.search(r"public\s+\w+\s+(\w+)\(", user_function).group(1)
    java_prolog = """
    package analyzer;

    import java.io.PrintWriter;
    import java.io.File;
    import java.io.IOException;
    import java.util.HashMap;
    import java.util.Random;

    public class InstrumentedPrototype {
        public HashMap<Integer, Long> lineInfoLastStart = new HashMap<>();
        public HashMap<Integer, Long> lineInfoTotal = new HashMap<>();

        private long getLastLineInfo(int lineNumber) {
            if (lineInfoLastStart.containsKey(lineNumber)) {
                return lineInfoLastStart.get(lineNumber);
            } else if (lineNumber > 1) {
                return getLastLineInfo(lineNumber - 1);
            }
            return 0L;
        }
    """

    java_epilog = f"""
        public static int[] generateInput(int size) {{
            Random rand = new Random();
            int[] input = new int[size];
            for (int i = 0; i < size; i++) {{
                input[i] = rand.nextInt(100); 
            }}
            return input;
        }}

        public static void main(String[] args) {{
            try(PrintWriter pw = new PrintWriter(new File("time_complexity_analyzer/analyzer/output_java.txt"))) {{
                for (int size = 1; size <= {num_inputs}; size++) {{
                    InstrumentedPrototype p = new InstrumentedPrototype();
                    long startTime = System.nanoTime();
                    {call_template.replace("$$size$$", "generateInput(size)")}
                    long endTime = System.nanoTime();
                    long execTime = endTime - startTime;
                    pw.printf("size = %d\\n", size);
                    pw.printf("Function execution time: %d ns\\n", execTime);
                    pw.println(p.lineInfoTotal.toString());
                }}
            }} catch (IOException ex) {{
                ex.printStackTrace();
            }}
        }}
    }}
    """

    lines = user_function.strip().splitlines()
    instrumented_user_function = lines[0] 
    last_line_index = len(lines) - 1
    for i, line in enumerate(lines[1:], start=2):
        trimmed_line = line.strip()
        line = re.sub(r"\b{}\b".format(function_name), f"this.{function_name}", line)
        if not trimmed_line or trimmed_line == '}' or i == last_line_index:
            instrumented_line = line
        elif "return" in trimmed_line:
            instrumented_line = line
        else:
            instrumented_line = (
                f"this.lineInfoLastStart.put({i}, System.nanoTime());\n"
                + line + "\n"
                + f"this.lineInfoTotal.put({i}, this.lineInfoTotal.getOrDefault({i}, 0L) + System.nanoTime() - getLastLineInfo({i}));"
            )
        instrumented_user_function += "\n" + instrumented_line

    full_java_code = java_prolog + instrumented_user_function + java_epilog
    return full_java_code

def write_and_compile_java(java_code):
    java_file_dir = os.path.join(os.getcwd(), "time_complexity_analyzer", "analyzer")
    os.makedirs(java_file_dir, exist_ok=True)
    java_file_path = os.path.join(java_file_dir, "InstrumentedPrototype.java")

    os.path.join(os.path.dirname(__file__), "output_java.txt")

    with open(java_file_path, "w") as java_file:
        java_file.write(java_code)
    
    subprocess.run(["javac", java_file_path], check=True)

def run_java_program():
    classpath = os.path.join(os.getcwd(), "time_complexity_analyzer")
    command = ["java", "-cp", classpath, "analyzer.InstrumentedPrototype"]
    subprocess.run(command, check=True)

# """TODO: try to fix the issue with two or more functions"""

# user_function = """
# public void mergeSort(int[] arr) {
#         if (arr.length < 2) {
#             return; // Base case: array is already sorted if it has less than two elements.
#         }
#         int mid = arr.length / 2;
#         int[] left = new int[mid];
#         int[] right = new int[arr.length - mid];

#         // Copy data to temporary subarrays
#         for (int i = 0; i < mid; i++) {
#             left[i] = arr[i];
#         }
#         for (int i = mid; i < arr.length; i++) {
#             right[i - mid] = arr[i];
#         }

#         // Recursive calls to sort each half
#         mergeSort(left);
#         mergeSort(right);

#         int i = 0, j = 0, k = 0;
#         while (i < left.length && j < right.length) {
#             if (left[i] <= right[j]) {
#                 arr[k++] = left[i++];
#             } else {
#                 arr[k++] = right[j++];
#             }
#         }
#         while (i < left.length) {
#             arr[k++] = left[i++];
#         }
#         while (j < right.length) {
#             arr[k++] = right[j++];
#         }
#     }
# """
# call_template = "p.mergeSort($$size$$);"
# num_inputs = 100

# java_code = instrument_java_function(user_function, call_template, num_inputs)
# write_and_compile_java(java_code)
# run_java_program()
