import numpy as np
from scipy.optimize import least_squares

# Define the models for fitting
def constant(x, c):
    return c

def linear(x, m, c):
    return m * x + c

def quadratic(x, a, b, c):
    return a * x**2 + b * x + c

def logarithmic(x, a, b):
    return a * np.log(x) + b

def exponential(x, a, b):
    return a * np.exp(b * x)

# Error function for least squares fitting
def error_function(params, x, y, model):
    return model(x, *params) - y

# Models for fitting with their initial guesses
models = {
    'constant': {'func': constant, 'initial_guess': [1]},
    'linear': {'func': linear, 'initial_guess': [1, 1]},
    'quadratic': {'func': quadratic, 'initial_guess': [1, 1, 1]},
    'logarithmic': {'func': logarithmic, 'initial_guess': [1, 1]},
    'exponential': {'func': exponential, 'initial_guess': [1, 0.01]}
}

time_complexity_notation = {
    'constant': 'O(1)',
    'linear': 'O(n)',
    'quadratic': 'O(n^2)',
    'logarithmic': 'O(log n)',
    'exponential': 'O(2^n)'  # or 'O(e^n)', depending on the base of the exponential growth
}

def parse_output_file(file_path):
    line_exec_times = {}
    function_exec_times = []  # To store total execution time for each size

    with open(file_path, 'r') as file:
        current_size = None
        for line in file:
            if line.startswith('size = '):
                current_size = int(line.strip().split('=')[1].strip())
            elif line.startswith('Function execution time: '):
                # Extract total function execution time for the current size
                exec_time = int(line.strip().split(': ')[1].split(' ')[0])
                function_exec_times.append((current_size, exec_time))
            elif line.startswith('{'):
                exec_times = eval(line.strip().replace('=', ':'))
                for line_num, time in exec_times.items():
                    if line_num not in line_exec_times:
                        line_exec_times[line_num] = []
                    line_exec_times[line_num].append((current_size, time))

    # Return both individual line times and total function times
    return line_exec_times, function_exec_times


# Function to select the best fitting model based on the lowest residual sum of squares (RSS)
def select_best_fitting_model(x_data, y_data):
    best_fit = {'model': None, 'params': None, 'rss': np.inf}
    for name, model in models.items():
        result = least_squares(error_function, model['initial_guess'], args=(x_data, y_data, model['func']))
        rss = np.sum(result.fun ** 2)  # Calculate the residual sum of squares
        if rss < best_fit['rss']:
            best_fit = {'model': name, 'params': result.x, 'rss': rss}
    return best_fit

# Parse the output file and analyze time complexity with all models
def parse_and_analyze(file_path):
    # Parse the file to get both line-specific and overall function execution times
    line_exec_times, function_exec_times = parse_output_file(file_path)
    
    # Initialize a dictionary to hold the best fits for both lines and the overall function
    best_fits = {'lines': {}, 'function': None}

    # Analyze each line for the best fitting model
    for line_num, times in line_exec_times.items():
        sizes, exec_times = zip(*times)  # Unpack sizes and execution times
        x_data = np.array(sizes)
        y_data = np.array(exec_times)
        best_fit = select_best_fitting_model(x_data, y_data)
        best_fits['lines'][line_num] = best_fit

    # Analyze the overall function for the best fitting model
    if function_exec_times:
        sizes, total_times = zip(*function_exec_times)  # Unpack sizes and total execution times
        x_data = np.array(sizes)
        y_data = np.array(total_times)
        overall_best_fit = select_best_fitting_model(x_data, y_data)
        best_fits['function'] = overall_best_fit

    return best_fits


# Main execution
if __name__ == "__main__":
    file_path = 'C://Users//user//Desktop//THESIS//TimeComplexityAnalyzer//time_complexity_analyzer//analyzer//output_java.txt'  # Adjust the file path as necessary
    best_fits = parse_and_analyze(file_path)

    # Print out the best fitting model for each line
    for line_num, fit in best_fits['lines'].items():
        model_name = fit['model']
        params = fit['params']
        rss = fit['rss']
        time_complexity = time_complexity_notation[model_name]  # Assuming time_complexity_notation is defined
        print(f"Line {line_num} Best Fit: {model_name} with params {params}, RSS {rss}. Time Complexity: {time_complexity}")

    # Now also print the best fitting model for the overall function
    if best_fits['function']:
        fit = best_fits['function']
        model_name = fit['model']
        params = fit['params']
        rss = fit['rss']
        time_complexity = time_complexity_notation[model_name]  # Assuming time_complexity_notation is defined
        print(f"Overall Function Best Fit: {model_name} with params {params}, RSS {rss}. Time Complexity: {time_complexity}")

