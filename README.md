# Estimator

Estimator is a web application designed to facilitate real-time collaborative estimation sessions, commonly used in agile development practices like planning poker. The application leverages WebSockets to provide a seamless, interactive experience for distributed teams.

## Features

- **Real-Time Collaboration:** Multiple users can join a session and provide their estimates simultaneously, with instant updates across all participants.
- **User-Friendly Interface:** A clean and intuitive UI ensures that users can easily navigate and participate in estimation sessions.
- **Customizable Sessions:** Create sessions tailored to specific projects or teams, with options to set estimation scales and other parameters.

## Getting Started

### Prerequisites

- Node.js (version 14.x or higher)
- pnpm package manager

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Mitri45/estimator.git
   ```


2. **Navigate to the project directory:**

   ```bash
   cd estimator
   ```


3. **Install dependencies:**

   ```bash
   pnpm install
   ```


### Running the Application

1. **Start the server:**

   ```bash
   pnpm run start:server
   ```


2. **Start the client:**

   ```bash
   pnpm run start:client
   ```


3. **Access the application:**

   Open your browser and navigate to `http://localhost:3000` to start using Estimator.

## Project Structure

- **app/**: Contains the front-end React application.
- **server/**: Houses the back-end server code, including WebSocket implementation.
- **common/**: Shared utilities and types used by both the client and server.

## Technologies Used

- **Front-End:** React, TypeScript, CSS
- **Back-End:** Node.js, WebSocket, TypeScript
- **Build Tools:** pnpm

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

Special thanks to all contributors and the open-source community for their invaluable support and resources.

---

For more information or to report issues, please visit the [GitHub repository](https://github.com/Mitri45/estimator). 
