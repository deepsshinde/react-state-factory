Define a cost function and its gradient
def cost_function(theta):
    return theta**2  # Example cost function

def gradient_function(theta):
    return 2 * theta  # Gradient of the example cost function

# Set initial values
initial_theta = 3.0
learning_rate = 0.1
num_iterations = 100

# Run gradient descent
optimized_theta = gradient_descent(initial_theta, learning_rate, num_iterations, gradient_function)

print("Optimized theta:", optimized_theta)
