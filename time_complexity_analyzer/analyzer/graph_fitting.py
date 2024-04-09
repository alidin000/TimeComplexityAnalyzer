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

def parse_output_file(file_path):
    line_exec_times = {}
    with open(file_path, 'r') as file:
        for line in file:
            if line.startswith('size = '):
                size = int(line.strip().split('=')[1].strip())
            elif line.startswith('{'):
                exec_times = eval(line.strip().replace('=', ':'))
                for line_num, time in exec_times.items():
                    if line_num not in line_exec_times:
                        line_exec_times[line_num] = []
                    line_exec_times[line_num].append((size, time))
    return line_exec_times

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
    line_exec_times = parse_output_file(file_path)  # Assuming parse_output_file is defined as before
    best_fits = {}
    for line_num, times in line_exec_times.items():
        sizes, exec_times = zip(*times)  # Unpack sizes and execution times
        x_data = np.array(sizes)
        y_data = np.array(exec_times)
        best_fit = select_best_fitting_model(x_data, y_data)
        best_fits[line_num] = best_fit
    return best_fits

# Main execution
if __name__ == "__main__":
    file_path = 'C://Users//user//Desktop//THESIS//TimeComplexityAnalyzer//time_complexity_analyzer//analyzer//output_java.txt'  # Adjust the file path as necessary
    best_fits = parse_and_analyze(file_path)

    # Print out the best fitting model for each line
    for line_num, fit in best_fits.items():
        print(f"Line {line_num} Best Fit: {fit['model']} with params {fit['params']} and RSS {fit['rss']}")
