# ton-virtual-girlfriend

## Description

`ton-virtual-girlfriend` is a comprehensive application that simulates a virtual girlfriend experience. The project consists of a backend server, a frontend UI, a selection of Live2D models, and a smart contract. The backend is written in Python, the frontend UI is developed using Next.js, the Live2D models provide multiple avatars for users to choose from, and the smart contract is developed using Tact.

## Project Structure

- **Backend Server**: Written in Python, connects to the database and provides APIs.
- **Frontend UI**: Developed using Next.js.
- **Live2D Models**: Contains multiple models for users to choose from.
- **Smart Contract**: Developed using Tact.

## Installation

### Backend Server

To set up the backend server:

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   python server.py
   ```

### Frontend UI

To set up the frontend UI:

1. Navigate to the frontend-ui folder:
   ```bash
   cd frontend-ui
   ```
2. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Live2D Models

Ensure the live2d-model folder is correctly referenced in the frontend UI to provide model selection functionality.

### Smart Contract

To set up the smart contract:

1. Navigate to the smart contract folder:
   ```bash
   cd smart-contract
   ```
2. Install Tact dependencies and compile the contract:
   ```bash
   yarn install && yarn run build
   ```

## Usage

Once all components are set up, you can start the backend server and the frontend UI. The frontend UI will interact with the backend server APIs to fetch data and display the Live2D models. Users can interact with their chosen virtual girlfriend model.

## Prerequisites

- Python 3.x
- Node.js 18.x or higher
- Tact compiler

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Special thanks to the Live2D community for their amazing tools and resources.
