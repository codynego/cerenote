# Cerenote

Cerenote is a web application designed to help you organize smarter, not harder. It features a user-friendly interface for managing tasks, notes, and audio transcriptions.

## Project Structure

The project is divided into two main parts: the backend and the frontend.

### Backend

The backend is built with Python and includes the following key files and directories:

- `app.py`: The main application file.
- `audio/`: Directory for audio-related functionalities.
- `database.py`: Handles database connections and operations.
- `main.py`: Entry point for the backend application.
- `models/`: Directory containing database models.
- `routes/`: Directory containing route definitions.
- `schema.py`: Defines the data schemas.
- `schemas/`: Directory containing additional schemas.
- `settings.py`: Configuration settings for the application.
- `Transcribe_audio.py`: Handles audio transcription.
- `transcribe.py`: Additional transcription functionalities.
- `uploaded_audio/`: Directory for storing uploaded audio files.
- `utils/`: Utility functions and helpers.
- `requirements.txt`: Lists the Python dependencies.

### Frontend

The frontend is built with React, TypeScript, and Vite. Key files and directories include:

- `components/`: Contains React components.
- `index.html`: The main HTML file.
- `main.html`: Additional HTML file.
- `package.json`: Lists the JavaScript dependencies.
- `public/`: Directory for public assets.
- `src/`: Source directory containing the main application code.
- `tsconfig.json`: TypeScript configuration file.

## Getting Started

### Prerequisites

- Node.js and npm installed
- Python and pip installed
- `ffmpeg` installed

### Installation

1. Clone the repository:

```sh
git clone https://github.com/yourusername/cerenote.git
cd cerenote
```

2. Install backend dependencies:

```sh
cd backend2
pip install -r requirements.txt
```

3. Install frontend dependencies:

```sh
cd ../frontend
npm install
```

4. Install `ffmpeg`:

- On macOS, you can use Homebrew:

```sh
brew install ffmpeg
```

- On Ubuntu, you can use apt:

```sh
sudo apt update
sudo apt install ffmpeg
```

- On Windows, download the executable from the [official website](https://ffmpeg.org/download.html) and follow the installation instructions.

### Running the Application

1. Start the backend server:

```sh
cd backend2
python main.py
```

2. Start the frontend development server:

```sh
cd ../frontend
npm run dev
```

### Building for Production

To build the frontend for production, run:

```sh
npm run build
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
```

Feel free to customize this README file further based on your specific project details.
Feel free to customize this README file further based on your specific project details.