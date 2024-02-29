def instrument_java_code(call, user_code):
  java_prolog = """
  package time_complexity_analyzer.analyzer;

  import java.io.PrintWriter;
  import java.io.File;
  import java.io.IOException;
  import java.util.HashMap;

  public class Prototype
  {
  """

  java_epilog = """
      HashMap<Integer, Long> lineInfoLastStart;
      HashMap<Integer, Long> lineInfoTotal;
      public static void main(String[] args)
      {
          Prototype p = new Prototype();
          """ + call + """
          try(PrintWriter pw = new PrintWriter(new File("output.txt"))) {
            pw.write(p.lineInfoTotal.toString());
          } catch (IOException ex) {}
      }
  }
  """
  return (java_prolog +
          '\n'.join(
            f"lineInfoLastStart.put({i+1}, System.nanoTime());" +
            x +
            f"lineInfoTotal.put({i+1}, lineInfoTotal.get({i+1}) + System.nanoTime() - lineInfoLastStart.get({i+1}));" for i, x in enumerate(user_code.splitlines())) +
          java_epilog)

with open("output.txt", "r") as f:
  lineInfo = {int(x): int(y) for x, y in f.readlines().split(": ")}