# NFT Artworks

NFT Artworks is a web application that allows users to upload and display their NFT images. Built using React, Tailwind CSS, and Pinata, this app provides a simple and intuitive interface for managing your NFT collections.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Screenshot](#screenshot)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Upload multiple images to IPFS using Pinata
- Display uploaded NFT images in a responsive gallery
- Loading animations during uploads
- Toast notifications for user feedback
- Dark and light theme support

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Pinata (for IPFS integration)
- **Deployment**: Vercel

## Screenshot

### Light Theme

![project screenshot](/src/assets/images/light-theme.png)

### Light Theme

![project screenshot](/src/assets/images/dark-theme.png)

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/coder-ralph/NFT-Artworks.git
   cd NFT-dApps-Artworks
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:

   Create a `.env.local` file in the root of the project and add your Pinata API keys:

   ```
   REACT_APP_PINATA_API_KEY=your_pinata_api_key
   REACT_APP_PINATA_SECRET_KEY=your_pinata_secret_key
   ```

4. Start the development server:

   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Deployment

The project is deployed on Vercel. You can access it [here](https://nft-dapp-artworks.vercel.app/).

## Environment Variables

Make sure to set the following environment variables in your Vercel project settings:

- `REACT_APP_PINATA_API_KEY`: Your Pinata API key.
- `REACT_APP_PINATA_SECRET_KEY`: Your Pinata secret key.

## Usage

- Drag and drop images or click the upload area to select images.
- After uploading, view your uploaded NFTs in the gallery.
- The application provides real-time feedback and loading animations.

## Contributing

Contributions are welcome! If you have suggestions for improvements or features, please fork the repository and create a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
