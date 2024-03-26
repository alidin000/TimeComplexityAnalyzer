
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
    this.lineInfoLastStart.put(1, System.nanoTime());

this.lineInfoTotal.put(1, this.lineInfoTotal.getOrDefault(1, 0L) + System.nanoTime() - getLastLineInfo(1));
this.lineInfoLastStart.put(2, System.nanoTime());
        for (int i = 0; i < array.length; i++) {
this.lineInfoTotal.put(2, this.lineInfoTotal.getOrDefault(2, 0L) + System.nanoTime() - getLastLineInfo(2));
this.lineInfoLastStart.put(3, System.nanoTime());
            for (int j = i+1; j < array.length; j++) {
this.lineInfoTotal.put(3, this.lineInfoTotal.getOrDefault(3, 0L) + System.nanoTime() - getLastLineInfo(3));
this.lineInfoLastStart.put(4, System.nanoTime());
                if (array[i] > array[j]) {
this.lineInfoTotal.put(4, this.lineInfoTotal.getOrDefault(4, 0L) + System.nanoTime() - getLastLineInfo(4));
this.lineInfoLastStart.put(5, System.nanoTime());
                    int temp = array[i];
this.lineInfoTotal.put(5, this.lineInfoTotal.getOrDefault(5, 0L) + System.nanoTime() - getLastLineInfo(5));
this.lineInfoLastStart.put(6, System.nanoTime());
                    array[i] = array[j];
this.lineInfoTotal.put(6, this.lineInfoTotal.getOrDefault(6, 0L) + System.nanoTime() - getLastLineInfo(6));
this.lineInfoLastStart.put(7, System.nanoTime());
                    array[j] = temp;
this.lineInfoTotal.put(7, this.lineInfoTotal.getOrDefault(7, 0L) + System.nanoTime() - getLastLineInfo(7));
this.lineInfoLastStart.put(8, System.nanoTime());
                }
this.lineInfoTotal.put(8, this.lineInfoTotal.getOrDefault(8, 0L) + System.nanoTime() - getLastLineInfo(8));
this.lineInfoLastStart.put(9, System.nanoTime());
            }
this.lineInfoTotal.put(9, this.lineInfoTotal.getOrDefault(9, 0L) + System.nanoTime() - getLastLineInfo(9));
this.lineInfoLastStart.put(10, System.nanoTime());
        }
this.lineInfoTotal.put(10, this.lineInfoTotal.getOrDefault(10, 0L) + System.nanoTime() - getLastLineInfo(10));
        }

        public static void main(String[] args)
        {
            InstrumentedPrototype p = new InstrumentedPrototype();
            p.bubbleSort(new int[] { 3,4,5,6, 0 });
            try(PrintWriter pw = new PrintWriter(new File("output.txt"))) {
                pw.write(p.lineInfoTotal.toString());
            } catch (IOException ex) {}
        }
    }
    