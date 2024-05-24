import re
import subprocess
import os

def instrument_java_function(user_function, call_template, num_inputs, output_file_path):
    function_name = re.search(r"public\s+(?:static\s+)?\w+\s+(\w+)\(", user_function).group(1)
    output_file_path = output_file_path.replace("\\", "\\\\")
    java_prolog = """
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
            try(PrintWriter pw = new PrintWriter(new File("output_java.txt"))) {{
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
    java_file_dir = os.path.dirname(__file__)
    java_file_path = os.path.join(java_file_dir, "InstrumentedPrototype.java")

    with open(java_file_path, "w") as java_file:
        java_file.write(java_code)
    
    subprocess.run(["javac", java_file_path], check=True)

def run_java_program():
    java_file_dir = os.path.dirname(__file__)
    command = ["java", "-cp", java_file_dir, "InstrumentedPrototype"]
    subprocess.run(command, check=True)

# user_function = """
# public boolean isPalindrome(int[] arr) {
#     int length = arr.length;
#     for (int i = 0; i < length / 2; i++) {
#         if (arr[i] != arr[length - 1 - i]) {
#             return false;
#         }
#     }
#     return true;
# }
# """
# call_template = "p.isPalindrome($$size$$);"
# num_inputs = 50

# output_file_path = os.path.join(os.path.dirname(__file__), "output_java.txt")

# java_code = instrument_java_function(user_function, call_template, num_inputs, output_file_path)
# write_and_compile_java(java_code)
# run_java_program()
