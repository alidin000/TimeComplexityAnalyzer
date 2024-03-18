import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import least_squares

# Define some example models for fitting
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

# Choose the model to fit (you can define more complex models as needed)
model_to_fit = exponential

# Example runtime data (replace with your own data)
x_data = np.array([1, 2, 3, 4, 5])  # Input sizes
y_data = np.array([0.5, 2.5, 6, 12, 20])  # Corresponding runtimes

# Define initial guess for the parameters based on the chosen model
initial_guess = [1, 1]  # For exponential model: a, b

# Define the error function to minimize (residuals)
def error_function(params, x, y, model):
    return model(x, *params) - y

# Perform least squares fitting
result = least_squares(error_function, initial_guess, args=(x_data, y_data, model_to_fit))

# Extract fitted parameters
fitted_params = result.x

# Generate fitted curve for plotting
x_fit = np.linspace(min(x_data), max(x_data), 100)
y_fit = model_to_fit(x_fit, *fitted_params)

# Plot original data and fitted curve
plt.scatter(x_data, y_data, label='Original Data')
plt.plot(x_fit, y_fit, 'r-', label='Fitted Curve')
plt.xlabel('Input Size')
plt.ylabel('Runtime')
plt.title('Runtime vs. Input Size')
plt.legend()
plt.grid(True)
plt.show()

# Print fitted parameters
print("Fitted Parameters:")
for i, param in enumerate(fitted_params):
    print(f"Parameter {i+1}: {param}")
