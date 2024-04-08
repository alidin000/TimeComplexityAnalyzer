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

    java_epilog = """

        public static void main(String[] args)
        {
            InstrumentedPrototype p = new InstrumentedPrototype();
            """ + call + """
            try(PrintWriter pw = new PrintWriter(new File("output.txt"))) {
                pw.write(p.lineInfoTotal.toString());
            } catch (IOException ex) {}
        }
    }
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

    return java_prolog + instrumented_user_function + java_epilog


# Example usage with a complete Java function
call = "p.mySortFunction(new int[] {3, 4, 5, 6, 0});"
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
instrumented_code = instrument_java_function(call, user_function)

# Write the instrumented code to a Java file in the same directory as the Python script
java_file_path = os.path.join(os.path.dirname(__file__), "InstrumentedPrototype.java")
with open(java_file_path, "w") as java_file:
    java_file.write(instrumented_code)

# Compile and run the Java code as before
compile_command = f"javac {java_file_path}"
subprocess.run(compile_command, shell=True)

run_command = "java time_complexity_analyzer.analyzer.InstrumentedPrototype"
subprocess.run(run_command, shell=True)

# The rest of the reading output and printing line information remains the same
