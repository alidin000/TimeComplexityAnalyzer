
package analyzer;

import java.io.PrintWriter;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Random; // Import Random for generating random input values

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

    public void mySortFunction(int[] array) {
        this.lineInfoLastStart.put(2, System.nanoTime());
        for (int i = 0; i < array.length; i++) {
            this.lineInfoTotal.put(2, this.lineInfoTotal.getOrDefault(2, 0L) + System.nanoTime() - getLastLineInfo(2));
            this.lineInfoLastStart.put(3, System.nanoTime());
            for (int j = i + 1; j < array.length; j++) {
                this.lineInfoTotal.put(3,
                        this.lineInfoTotal.getOrDefault(3, 0L) + System.nanoTime() - getLastLineInfo(3));
                this.lineInfoLastStart.put(4, System.nanoTime());
                if (array[i] > array[j]) {
                    this.lineInfoTotal.put(4,
                            this.lineInfoTotal.getOrDefault(4, 0L) + System.nanoTime() - getLastLineInfo(4));
                    this.lineInfoLastStart.put(5, System.nanoTime());
                    int temp = array[i];
                    this.lineInfoTotal.put(5,
                            this.lineInfoTotal.getOrDefault(5, 0L) + System.nanoTime() - getLastLineInfo(5));
                    this.lineInfoLastStart.put(6, System.nanoTime());
                    array[i] = array[j];
                    this.lineInfoTotal.put(6,
                            this.lineInfoTotal.getOrDefault(6, 0L) + System.nanoTime() - getLastLineInfo(6));
                    this.lineInfoLastStart.put(7, System.nanoTime());
                    array[j] = temp;
                    this.lineInfoTotal.put(7,
                            this.lineInfoTotal.getOrDefault(7, 0L) + System.nanoTime() - getLastLineInfo(7));
                }
            }
        }
    }

    // Method to generate input array of given size with random values
    public static int[] generateInput(int size) {
        Random rand = new Random();
        int[] input = new int[size];
        for (int i = 0; i < size; i++) {
            input[i] = rand.nextInt(100); // Generate random integers in the range 0 to 99
        }
        return input;
    }

    public static void main(String[] args) {
        try (PrintWriter pw = new PrintWriter(new File("analyzer/output_java.txt"))) {
            for (int size = 1; size <= 5; size++) {
                InstrumentedPrototype p = new InstrumentedPrototype();
                long startTime = System.nanoTime();
                p.mySortFunction(generateInput(size));
                long endTime = System.nanoTime();
                long execTime = endTime - startTime;
                pw.printf("size = %d\n", size);
                pw.printf("Function execution time: %d ns\n", execTime);
                pw.println(p.lineInfoTotal.toString());
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
