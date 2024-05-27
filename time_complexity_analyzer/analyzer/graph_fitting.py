import numpy as np
from scipy.optimize import least_squares
from scipy.special import factorial

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

def cubic(x, a, b, c, d):
    return a * x**3 + b * x**2 + c * x + d

def log_linear(x, a, b):
    return a * x * np.log(x) + b

def factorial_complexity(x, a):
    return a * factorial(x)

def polynomial(x, *coeffs):
    return sum(c * x**i for i, c in enumerate(reversed(coeffs)))

def inverse_ackermann(x, a):
    return a * np.log(np.log(np.log(x + 1) + 1) + 1)

def iterated_logarithmic(x, a, b):
    return a * np.log(np.log(x + 1)) + b

def polylogarithmic(x, a, b, c):
    return a * (np.log(x)**b) + c

def fractional_power(x, a, b):
    return a * (x ** b)

def quasilinear(x, a, b, c):
    return a * x * (np.log(x) ** b) + c

def quasi_polynomial(x, a, b):
    return a * np.exp(np.log(x)**b)

def subexponential(x, a, b):
    return a * np.exp(x ** b)

def polynomial_linear_exponent(x, a, b):
    return a * 2**(b * x)

def double_exponential(x, a, b):
    return a * 2**(2**x)

def error_function(params, x, y, model):
    return model(x, *params) - y

models = {
    'constant': {'func': constant, 'initial_guess': [1]},
    'linear': {'func': linear, 'initial_guess': [1, 1]},
    'quadratic': {'func': quadratic, 'initial_guess': [1, 1, 1]},
    'logarithmic': {'func': logarithmic, 'initial_guess': [1, 1]},
    'exponential': {'func': exponential, 'initial_guess': [1, 0.01]},
    'cubic': {'func': cubic, 'initial_guess': [1, 1, 1, 1]},
    'log_linear': {'func': log_linear, 'initial_guess': [1, 1]},
    'factorial': {'func': factorial_complexity, 'initial_guess': [1]},
    'polynomial': {'func': polynomial, 'initial_guess': [1, 1, 1, 1]},
    'inverse_ackermann': {'func': inverse_ackermann, 'initial_guess': [1]},
    'iterated_logarithmic': {'func': iterated_logarithmic, 'initial_guess': [1, 1]},
    'polylogarithmic': {'func': polylogarithmic, 'initial_guess': [1, 1, 1]},
    'fractional_power': {'func': fractional_power, 'initial_guess': [1, 0.5]},
    'quasilinear': {'func': quasilinear, 'initial_guess': [1, 1, 1]},
    'quasi_polynomial': {'func': quasi_polynomial, 'initial_guess': [1, 1]},
    'subexponential': {'func': subexponential, 'initial_guess': [1, 0.5]},
    'polynomial_linear_exponent': {'func': polynomial_linear_exponent, 'initial_guess': [1, 1]},
    'double_exponential': {'func': double_exponential, 'initial_guess': [1, 1]}
}

time_complexity_notation = {
    'constant': 'O(1)',
    'linear': 'O(n)',
    'quadratic': 'O(n^2)',
    'logarithmic': 'O(log n)',
    'exponential': 'O(2^n)',
    'cubic': 'O(n^3)',
    'log_linear': 'O(n log n)',
    'factorial': 'O(n!)',
    'polynomial': 'O(n^k)',
    'inverse_ackermann': 'O(α(n))',
    'iterated_logarithmic': 'O(log* n)',
    'polylogarithmic': 'O((log n)^k)',
    'fractional_power': 'O(n^c)',
    'quasilinear': 'O(n log^k n)',
    'quasi_polynomial': 'O(exp((log n)^k))',
    'subexponential': 'O(exp(n^c))',
    'polynomial_linear_exponent': 'O(2^(O(n)))',
    'double_exponential': 'O(2^(2^n))'
}

def parse_output_file(file_path):
    line_exec_times = {}
    function_exec_times = [] 

    with open(file_path, 'r') as file:
        for line in file:
            if line.startswith('test case = '):
                continue
            elif line.startswith('Function execution time: '):
                exec_time = int(line.strip().split(': ')[1].split(' ')[0])
                function_exec_times.append(exec_time)
            elif line.startswith('{'):
                exec_times = eval(line.strip().replace('=', ':'))
                for line_num, time in exec_times.items():
                    if line_num not in line_exec_times:
                        line_exec_times[line_num] = []
                    line_exec_times[line_num].append(time)
    return line_exec_times, function_exec_times

def select_best_fitting_model(x_data, y_data):
    best_fit = {'model': None, 'params': None, 'rss': np.inf}
    for name, model in models.items():
        try:
            if name == 'logarithmic' and np.any(x_data <= 0):
                continue
            result = least_squares(error_function, model['initial_guess'], args=(x_data, y_data, model['func']))
            rss = np.sum(result.fun ** 2)
            if rss < best_fit['rss']:
                best_fit = {'model': name, 'params': result.x, 'rss': rss}
        except ValueError as e:
            print(f"Error fitting model {name}: {e}")
    return best_fit

def parse_and_analyze(file_paths):
    sizes = [int(path.split('_')[-1].split('.')[0]) for path in file_paths]
    aggregated_line_exec_times = {}
    aggregated_function_exec_times = {size: [] for size in sizes}

    for file_path, size in zip(file_paths, sizes):
        line_exec_times, function_exec_times = parse_output_file(file_path)
        
        for line_num, times in line_exec_times.items():
            if line_num not in aggregated_line_exec_times:
                aggregated_line_exec_times[line_num] = {size: [] for size in sizes}
            aggregated_line_exec_times[line_num][size].extend(times)
        
        aggregated_function_exec_times[size].extend(function_exec_times)
    
    best_fits = {'lines': {}, 'function': None}

    for line_num, exec_times_by_size in aggregated_line_exec_times.items():
        avg_exec_times = [np.mean(exec_times_by_size[size]) for size in sizes if size in exec_times_by_size]
        x_data = np.array(sizes)
        y_data = np.array(avg_exec_times)
        best_fit = select_best_fitting_model(x_data, y_data)
        avg_exec_time = {size: np.mean(exec_times_by_size[size]) for size in sizes if size in exec_times_by_size}
        best_fits['lines'][line_num] = {'best_fit': best_fit, 'average_exec_times': avg_exec_time}

    avg_function_exec_times = [np.mean(aggregated_function_exec_times[size]) for size in sizes]
    if avg_function_exec_times:
        x_data = np.array(sizes)
        y_data = np.array(avg_function_exec_times)
        overall_best_fit = select_best_fitting_model(x_data, y_data)
        avg_exec_time = {size: np.mean(aggregated_function_exec_times[size]) for size in sizes}
        best_fits['function'] = {'best_fit': overall_best_fit, 'average_exec_times': avg_exec_time}

    return best_fits

if __name__ == "__main__":
    file_path = r'C:\Users\user\Desktop\THESIS\TimeComplexityAnalyzer\time_complexity_analyzer\output_java.txt' 
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

