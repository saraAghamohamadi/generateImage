import requests
import os

# --- Configuration ---
# The URL of your service's API endpoint
API_URL = "http://127.0.0.1:8000/api/generate/" 

# Your unique API key from the dashboard
# It's best practice to load this from an environment variable
API_KEY = os.getenv("MY_APP_API_KEY", "4c3853d8-06c1-408d-9c43-2a52ae2a20ea")

# The prompt for the image you want to generate
prompt = "A hyper-realistic photo of a cute red panda wearing a tiny chef's hat"

# --- API Call ---
def generate_image(prompt_text):
    """Sends a request to the API to generate an image."""

    if API_KEY == "paste_your_api_key_here":
        print("ERROR: Please replace 'paste_your_api_key_here' with your actual API key.")
        return

    print("Sending request to generate image...")

    # Set the API key in the request headers
    headers = {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json"
    }

    # Set the prompt in the request body
    data = {
        "prompt": prompt_text
    }

    try:
        response = requests.post(API_URL, headers=headers, json=data)

        # Raise an exception for bad status codes (4xx or 5xx)
        response.raise_for_status() 

        # If successful, print the result
        result = response.json()
        print("\n✅ Success!")
        print(f"   Image URL: http://127.0.0.1:8000{result.get('image_url')}")
        print(f"   Credits Remaining: {result.get('credits')}")

    except requests.exceptions.HTTPError as err:
        print(f"\n❌ Error: {err.response.status_code} - {err.response.reason}")
        # Try to print the error message from the API response
        try:
            print(f"   Details: {err.response.json().get('error')}")
        except ValueError:
            print(f"   Could not decode JSON response.")
    except requests.exceptions.RequestException as err:
        print(f"\n❌ An unexpected error occurred: {err}")

# --- Run the script ---
if __name__ == "__main__":
    generate_image(prompt)