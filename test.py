import requests

# Base URL of the API
base_url = "https://placeholder-hono-api.yapzanan.workers.dev/placeholder"

# List of text strings to generate placeholder images for
text_list = [
    "clumsy",
    "chaotic",
    "bossy",
    "forgetful",
    "nerdy",
    "stubborn",
    "sarcastic",
    "shy",
    "competitive",
    "mischievous",
    "scatterbrained",
    "dramatic",
    "foodie",
    "sleepy",
    "loud",
    "awkward",
    "picky",
    "artsy",
    "forgets boundaries",
    "quirky"
]

# Parameters for the API request
params = {
    "width": "600",
    "height": "600",
    "font": "New Amsterdam",
    "format": "png"
}

# Iterate over the text list and generate images
for text in text_list:
    # Update the text parameter
    params["text"] = text
    
    # Make the API request
    response = requests.get(base_url, params=params)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Save the image to a file
        filename = f"test/{text}.png"
        with open(filename, "wb") as file:
            file.write(response.content)
        print(f"Saved {filename}")
    else:
        print(f"Failed to generate image for text: {text}. Status code: {response.status_code}")