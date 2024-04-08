import subprocess
import os

def instrument_java_function(call, user_function):
    java_prolog = """
    package time_complexity_analyzer.analyzer;

    import java.io.PrintWriter;
    import java.io.File;
    import java.io.IOException;
    import java.util.HashMap;

    public class InstrumentedPrototype
    {
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
        public static void main(String[] args)
        {{
            InstrumentedPrototype p = new InstrumentedPrototype();
            {call}
            long startTime = System.nanoTime();
            try(PrintWriter pw = new PrintWriter(new File("time_complexity_analyzer/analyzer/output_java.txt"))) {{
                pw.println("Function execution time: " + (System.nanoTime() - startTime) + " ns");
                pw.println(p.lineInfoTotal.toString());
            }} catch (IOException ex) {{}}
        }}
    }}
    """

    lines = user_function.strip().splitlines()
    instrumented_user_function = lines[0]  # Function declaration

    for i, line in enumerate(lines[1:], start=2):  # Start enumeration from 2 to account for function declaration line
        trimmed_line = line.strip()
        if not trimmed_line or trimmed_line == '}':
            # Skip empty lines or closing braces
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
    # Ensure the package directory structure exists
    java_file_dir = os.path.join(os.getcwd(), "time_complexity_analyzer", "analyzer")
    os.makedirs(java_file_dir, exist_ok=True)
    
    java_file_path = os.path.join(java_file_dir, "InstrumentedPrototype.java")
    with open(java_file_path, "w") as java_file:
        java_file.write(java_code)
    
    # Navigate to the root directory and compile the Java program
    subprocess.run(["javac", java_file_path], check=True)

def run_java_program():
    # Run the Java program from the root directory
    command = ["java", "-cp", os.getcwd(), "time_complexity_analyzer.analyzer.InstrumentedPrototype"]
    subprocess.run(command, check=True)

# Example usage
call = "p.mySortFunction(new int[]{3, 4, 5, 6, 0});"
user_function = """
public void mySortFunction(int[] array) {
    for (int i = 0; i < array.length; i++) {
        for (int j = i + 1; j < array.length; j++) {
            if (array[i] > array[j]) {
                int temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
    }
}
"""
java_code = instrument_java_function(call, user_function)
write_and_compile_java(java_code)
run_java_program()
