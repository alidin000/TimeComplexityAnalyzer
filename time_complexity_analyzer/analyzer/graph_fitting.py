import numpy as np
from scipy.optimize import least_squares

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

def error_function(params, x, y, model):
    return model(x, *params) - y

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
    'exponential': 'O(2^n)'  
}

def parse_output_file(file_path):
    line_exec_times = {}
    function_exec_times = [] 

    with open(file_path, 'r') as file:
        current_size = None
        for line in file:
            if line.startswith('size = '):
                current_size = int(line.strip().split('=')[1].strip())
            elif line.startswith('Function execution time: '):

                exec_time = int(line.strip().split(': ')[1].split(' ')[0])
                function_exec_times.append((current_size, exec_time))
            elif line.startswith('{'):
                exec_times = eval(line.strip().replace('=', ':'))
                for line_num, time in exec_times.items():
                    if line_num not in line_exec_times:
                        line_exec_times[line_num] = []
                    line_exec_times[line_num].append((current_size, time))
    return line_exec_times, function_exec_times


def select_best_fitting_model(x_data, y_data):
    best_fit = {'model': None, 'params': None, 'rss': np.inf}
    for name, model in models.items():
        result = least_squares(error_function, model['initial_guess'], args=(x_data, y_data, model['func']))
        rss = np.sum(result.fun ** 2)  
        if rss < best_fit['rss']:
            best_fit = {'model': name, 'params': result.x, 'rss': rss}
    return best_fit

def parse_and_analyze(file_path):
    line_exec_times, function_exec_times = parse_output_file(file_path)
    

    best_fits = {'lines': {}, 'function': None}

    for line_num, times in line_exec_times.items():
        sizes, exec_times = zip(*times)  
        x_data = np.array(sizes)
        y_data = np.array(exec_times)
        best_fit = select_best_fitting_model(x_data, y_data)
        best_fits['lines'][line_num] = best_fit

    if function_exec_times:
        sizes, total_times = zip(*function_exec_times)  
        x_data = np.array(sizes)
        y_data = np.array(total_times)
        overall_best_fit = select_best_fitting_model(x_data, y_data)
        best_fits['function'] = overall_best_fit

    return best_fits


if __name__ == "__main__":
    file_path = 'C://Users//user//Desktop//THESIS//TimeComplexityAnalyzer//time_complexity_analyzer//analyzer//output_python.txt' 
    best_fits = parse_and_analyze(file_path)

    for line_num, fit in best_fits['lines'].items():
        model_name = fit['model']
        params = fit['params']
        rss = fit['rss']
        time_complexity = time_complexity_notation[model_name]  
        print(f"Line {line_num} Best Fit: {model_name} with params {params}, RSS {rss}. Time Complexity: {time_complexity}")

    if best_fits['function']:
        fit = best_fits['function']
        model_name = fit['model']
        params = fit['params']
        rss = fit['rss']
        time_complexity = time_complexity_notation[model_name]  
        print(f"Overall Function Best Fit: {model_name} with params {params}, RSS {rss}. Time Complexity: {time_complexity}")

