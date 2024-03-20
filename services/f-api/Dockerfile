# Use an official Python runtime as a parent image
FROM python:3.11

# Set the working directory to /app
RUN mkdir /code
WORKDIR /code

# Install any needed packages specified in requirements.txt
COPY requirements.txt .
RUN pip3 install -r requirements.txt
RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Copy the current directory contents into the container at /app
COPY . .

# Make port 8000 (or your preferred port) available to the world outside this container
EXPOSE 8000

# Run app.py when the container launches
CMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"] 