import numpy as np
from scipy.optimize import least_squares
from scipy.special import factorial

def constant(x, c):
    return c

def inverse_ackermann(x, a):
    return a * np.log(np.log(np.log(x + 1) + 1) + 1)

def iterated_logarithmic(x, a, b):
    return a * np.log(np.log(x + 1)) + b

def log_logarithmic(x, a, b):
    return a * np.log(np.log(x)) + b

def logarithmic(x, a, b):
    return a * np.log(x) + b

def polylogarithmic(x, a, b, c):
    return a * (np.log(x)**b) + c

def fractional_power(x, a, b):
    return a * (x ** b)

def linear(x, m, c):
    return m * x + c

def log_linear(x, a, b):
    return a * x * np.log(x) + b

def quasilinear(x, a, b, c):
    return a * x * (np.log(x) ** b) + c

def quadratic(x, a, b, c):
    return a * x**2 + b * x + c

def cubic(x, a, b, c, d):
    return a * x**3 + b * x**2 + c * x + d

def polynomial(x, *coeffs):
    return sum(c * x**i for i, c in enumerate(reversed(coeffs)))

def quasi_polynomial(x, a, b):
    return a * np.exp(np.log(x)**b)

def subexponential(x, a, b):
    return a * np.exp(x ** b)

def subexponential_variant(x, a, b):
    return a * np.exp(x ** b)

def exponential(x, a, b):
    return a * np.exp(b * x)

def factorial_complexity(x, a):
    return a * factorial(x)

def polynomial_linear_exponent(x, a, b):
    return a * 2**(b * x)

def double_exponential(x, a, b):
    return a * 2**(2**x)

def exponential_poly(x, a, b):
    return a * 2**(b * x)

def error_function(params, x, y, model):
    return model(x, *params) - y

models = {
    'constant': {'func': constant, 'initial_guess': [1]},
    'inverse_ackermann': {'func': inverse_ackermann, 'initial_guess': [1]},
    'iterated_logarithmic': {'func': iterated_logarithmic, 'initial_guess': [1, 1]},
    'log_logarithmic': {'func': log_logarithmic, 'initial_guess': [1, 1]},
    'logarithmic': {'func': logarithmic, 'initial_guess': [1, 1]},
    'polylogarithmic': {'func': polylogarithmic, 'initial_guess': [1, 1, 1]},
    'fractional_power': {'func': fractional_power, 'initial_guess': [1, 0.5]},
    'linear': {'func': linear, 'initial_guess': [1, 1]},
    'log_linear': {'func': log_linear, 'initial_guess': [1, 1]},
    'quasilinear': {'func': quasilinear, 'initial_guess': [1, 1, 1]},
    'quadratic': {'func': quadratic, 'initial_guess': [1, 1, 1]},
    'cubic': {'func': cubic, 'initial_guess': [1, 1, 1, 1]},
    'polynomial': {'func': polynomial, 'initial_guess': [1, 1, 1, 1]},
    'quasi_polynomial': {'func': quasi_polynomial, 'initial_guess': [1, 1]},
    'subexponential': {'func': subexponential, 'initial_guess': [1, 0.5]},
    'subexponential_variant': {'func': subexponential_variant, 'initial_guess': [1, 0.5]},
    'exponential': {'func': exponential, 'initial_guess': [1, 0.01]},
    'factorial': {'func': factorial_complexity, 'initial_guess': [1]},
    'polynomial_linear_exponent': {'func': polynomial_linear_exponent, 'initial_guess': [1, 1]},
    'double_exponential': {'func': double_exponential, 'initial_guess': [1, 1]},
    'exponential_poly': {'func': exponential_poly, 'initial_guess': [1, 1]}
}

time_complexity_notation = {
    'constant': 'O(1)',
    'inverse_ackermann': 'O(α(n))',
    'iterated_logarithmic': 'O(log* n)',
    'log_logarithmic': 'O(log log n)',
    'logarithmic': 'O(log n)',
    'polylogarithmic': 'O((log n)^k)',
    'fractional_power': 'O(n^c)',
    'linear': 'O(n)',
    'log_linear': 'O(n log n)',
    'quasilinear': 'O(n log^k n)',
    'quadratic': 'O(n^2)',
    'cubic': 'O(n^3)',
    'polynomial': 'O(n^k)',
    'quasi_polynomial': 'O(exp((log n)^k))',
    'subexponential': 'O(exp(n^c))',
    'subexponential_variant': '2^(o(n))',
    'exponential': 'O(2^n)',
    'factorial': 'O(n!)',
    'polynomial_linear_exponent': 'O(2^(O(n)))',
    'double_exponential': 'O(2^(2^n))',
    'exponential_poly': 'O(2^(poly(n)))'
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

def simplify_model(name, params):
    if name == 'cubic' and np.isclose(params[0], 0):
        return simplify_model('quadratic', params[1:])
    if name == 'quadratic' and np.isclose(params[0], 0):
        return simplify_model('linear', params[1:])
    if name == 'linear' and np.isclose(params[0], 0):
        return simplify_model('constant', params[1:])
    if name == 'exponential' and np.isclose(params[1], 0):
        return simplify_model('constant', params[:1])
    if name == 'polylogarithmic' and np.isclose(params[1], 0):
        return simplify_model('logarithmic', params[:2])
    if name == 'polynomial' and len(params) > 1 and np.isclose(params[0], 0):
        return simplify_model('polynomial', params[1:])
    if name == 'factorial' and np.isclose(params[0], 0):
        return simplify_model('constant', params[:1])
    if name == 'double_exponential' and np.isclose(params[1], 0):
        return simplify_model('exponential', params[:1])
    if name == 'exponential_poly' and np.isclose(params[1], 0):
        return simplify_model('polynomial', params[:1])
    if name == 'log_logarithmic' and np.isclose(params[0], 0):
        return simplify_model('constant', params[1:])
    if name == 'logarithmic' and np.isclose(params[0], 0):
        return simplify_model('constant', params[1:])
    if name == 'quasi_polynomial' and np.isclose(params[1], 0):
        return simplify_model('constant', params[:1])
    if name == 'subexponential' and np.isclose(params[1], 0):
        return simplify_model('exponential', params[:1])
    if name == 'subexponential_variant' and np.isclose(params[1], 0):
        return simplify_model('exponential', params[:1])
    if name == 'log_linear' and np.isclose(params[0], 0):
        return simplify_model('constant', params[1:])
    if name == 'quasilinear' and np.isclose(params[0], 0):
        return simplify_model('logarithmic', params[1:])
    return name, params

def select_best_fitting_model(x_data, y_data):
    best_fit = {'model': None, 'params': None, 'rss': np.inf}
    for name, model in models.items():
        try:
            if name == 'logarithmic' and np.any(x_data <= 0):
                continue
            result = least_squares(error_function, model['initial_guess'], args=(x_data, y_data, model['func']))
            params = result.x
            rss = np.sum(result.fun ** 2)

            # complexity faking check
            simplified_name, simplified_params = simplify_model(name, params)

            if rss < best_fit['rss']:
                best_fit = {'model': simplified_name, 'params': simplified_params, 'rss': rss}
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
        model_name = fit['best_fit']['model']
        params = fit['best_fit']['params']
        rss = fit['best_fit']['rss']
        time_complexity = time_complexity_notation[model_name]  
        print(f"Line {line_num} Best Fit: {model_name} with params {params}, RSS {rss}. Time Complexity: {time_complexity}")

    if best_fits['function']:
        fit = best_fits['function']['best_fit']
        model_name = fit['model']
        params = fit['params']
        rss = fit['rss']
        time_complexity = time_complexity_notation[model_name]  
        print(f"Overall Function Best Fit: {model_name} with params {params}, RSS {rss}. Time Complexity: {time_complexity}")
