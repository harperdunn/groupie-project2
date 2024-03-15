import os
import subprocess
import time
import requests

def update_api_key(new_key):
    # Path to your .env file
    env_file_path = 'env.js'
    # Variable to hold the updated content
    updated_lines = []
    # Flag to check if the key is found and updated
    key_updated = False

    # Read the current content of the .env file
    with open(env_file_path, 'r') as file:
        lines = file.readlines()
        for line in lines:
            # Check if the line contains the updated_lines variable
            if line.startswith('const ourApiKey='):
                updated_lines.append(f'const ourApiKey=\'{new_key}\'\n')#updates the variable in env file
                key_updated = True
            else:
               updated_lines.append(line) #add to the list of lines to write

    # Add the API_KEY variable if it wasn't found in the file
    if not key_updated:
        print("API Key not updated.")

    # Write the updated content back to the .env file
    with open(env_file_path, 'w') as file:
        file.writelines(updated_lines)

# Prompt the user for the new API key
new_api_key = input("Please enter the new API Key: ")
# Update the .env file with the new key
update_api_key(new_api_key)
print("API key updated.")

def run_npm_commands():
    try:
        # Run 'npm install' to install dependencies
        print("Installing dependencies...")
        subprocess.run(['npm', 'install'], check=True)
        print("Dependencies installed successfully.")

        # After successful installation, run 'npm run dev'
        print("Starting development server...")
        subprocess.run(['npm', 'run', 'dev'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")

time.sleep(10)  # Wait 10 seconds; adjust based on how quickly your server starts
run_npm_commands()
# Step 4: Check if localhost:3000 is up and running
try:
    response = requests.get("http://localhost:3000")
    if response.status_code == 200:
        print("Server is up and running!")
    else:
        print("Server responded, but there might be an issue. Status Code:", response.status_code)
except requests.ConnectionError:
    print("Failed to connect to the server. Check if the server is running and the API key is correct.")