import subprocess
import os

def instrument_java_function(user_function, call_template, num_inputs):
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

user_function = """
public int maxSubArray(int[] A) {
  int maxSoFar=A[0], maxEndingHere=A[0];
  for (int i=1;i<A.length;++i){
    maxEndingHere= Math.max(maxEndingHere+A[i],A[i]);
    maxSoFar=Math.max(maxSoFar, maxEndingHere);
  }
  return maxSoFar;
}
"""
call_template = "p.maxSubArray($$size$$);"
num_inputs = 50

java_code = instrument_java_function(user_function, call_template, num_inputs)
write_and_compile_java(java_code)
run_java_program()
