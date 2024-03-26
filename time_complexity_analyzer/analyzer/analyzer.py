import subprocess
import os


# Define the instrument_java_code function
def instrument_java_code(call, user_code):
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


        public void bubbleSort(int[] array) {
    """

    java_epilog = """
        }

        public static void main(String[] args)
        {
            InstrumentedPrototype p = new InstrumentedPrototype();
            p.bubbleSort(new int[] { 3,4,5,6 });
            try(PrintWriter pw = new PrintWriter(new File("output.txt"))) {
                pw.write(p.lineInfoTotal.toString());
            } catch (IOException ex) {}
        }
    }
    """

    instrumented_user_code = "\n".join(
        f"this.lineInfoLastStart.put({i+1}, System.nanoTime());\n"
        + x
        + "\n"
        + f"this.lineInfoTotal.put({i+1}, this.lineInfoTotal.getOrDefault({i+1}, 0L) + System.nanoTime() - getLastLineInfo({i+1}));"
        for i, x in enumerate(user_code.splitlines())
    )

    return java_prolog + instrumented_user_code + java_epilog


# Call the instrument_java_code function with your desired Java code
call = ""
user_code = """
        for (int i = 0; i < array.length; i++) {
            for (int j = i+1; j < array.length; j++) {
                if (array[i] > array[j]) {
                    int temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }
        }
"""
instrumented_code = instrument_java_code(call, user_code)

# Write the instrumented code to a Java file in the same directory as the Python script
java_file_path = os.path.join(os.path.dirname(__file__), "InstrumentedPrototype.java")
with open(java_file_path, "w") as java_file:
    java_file.write(instrumented_code)

# Compile the Java code
compile_command = f"javac {java_file_path}"
subprocess.run(compile_command, shell=True)

# Run the compiled Java code
run_command = "java time_complexity_analyzer.analyzer.InstrumentedPrototype"
subprocess.run(run_command, shell=True)

# Read the output from the file "output.txt"
lineInfo = {}
output_file_path = os.path.join(os.path.dirname(__file__), "output.txt")
with open(output_file_path, "r") as f:
    lines = f.readlines()
    for line in lines:
        parts = line.strip().split(": ")
        if len(parts) == 2:
            line_number, time_taken = int(parts[0]), int(parts[1])
            lineInfo[line_number] = time_taken

print(lineInfo)
