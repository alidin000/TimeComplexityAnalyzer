package time_complexity_analyzer.analyzer;

import java.io.PrintWriter;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;

public class Prototype
{
    public static void bubbleSort(int[] array) {
        for (int i = 0; i < array.length; i++) {
          for (int j = i+1; j < array.length; i++) {
            if (array[i] > array[j]) {
              int temp = array[i];
              array[i] = array[j];
              array[j] = temp;
            }
          }
        }
    }

    public void bubbleSortWithProfiling(int[] array) {
      lineInfoLastStart.put(2, System.nanoTime());
      for (int i = 0; i < array.length; i++) {
        lineInfoLastStart.put(3, System.nanoTime());
        for (int j = i+1; j < array.length; i++) {
          lineInfoLastStart.put(4, System.nanoTime());
          if (array[i] > array[j]) {
            lineInfoLastStart.put(5, System.nanoTime());
            int temp = array[i];
            lineInfoTotal.put(5, lineInfoTotal.get(5) + System.nanoTime() - lineInfoLastStart.get(5));
            lineInfoLastStart.put(6, System.nanoTime());
            array[i] = array[j];
            lineInfoTotal.put(6, lineInfoTotal.get(6) + System.nanoTime() - lineInfoLastStart.get(6));
            lineInfoLastStart.put(7, System.nanoTime());
            array[j] = temp;
            lineInfoTotal.put(7, lineInfoTotal.get(7) + System.nanoTime() - lineInfoLastStart.get(7));
          }
          lineInfoTotal.put(4, lineInfoTotal.get(4) + System.nanoTime() - lineInfoLastStart.get(4));
        }
        lineInfoTotal.put(3, lineInfoTotal.get(3) + System.nanoTime() - lineInfoLastStart.get(3));
      }
      lineInfoTotal.put(2, lineInfoTotal.get(2) + System.nanoTime() - lineInfoLastStart.get(2));
    }

    HashMap<Integer, Long> lineInfoLastStart;
    HashMap<Integer, Long> lineInfoTotal;
    public static void main(String[] args)
    {
        Prototype p = new Prototype();
        bubbleSort(new int[] { 3,4,5,6 });
        try(PrintWriter pw = new PrintWriter(new File("output.txt"))) {
          for (Integer x : p.lineInfoTotal.keySet()) {
            pw.write(x + ": " + p.lineInfoTotal.get(x));
          }          
        } catch (IOException ex) {}
    }
}