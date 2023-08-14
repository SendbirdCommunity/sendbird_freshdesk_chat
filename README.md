
# Global FD Chat

Global FD Chat is a Freshdesk app designed to enhance customer support and communication. This project leverages the Freshdesk platform to build a robust and reliable chat solution, compatible with major browsers.

## Table of Contents
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Support and Compatibility](#support-and-compatibility)
- [Contributing](#contributing)
- [License](#license)

## Quick Start
You can build a Freshdesk app by using the following steps. For detailed instructions, please refer to the [Freshdesk Quick Start Guide](https://developers.freshdesk.com/v2/docs/quick-start/).

### Install NVM
- **MacOS**: Follow the installation steps in [NVM’s GitHub repository](https://github.com/nvm-sh/nvm) or install via [brew](https://brew.sh/).
- **Linux**: Install cURL and run the installation script as described in the Freshdesk documentation.
- **Windows**: Download the NVM Setup installer or install via [Chocolatey](https://chocolatey.org/).

### Install Node
- Install Node.js using NVM.
- Verify the Node installation and set the default Node version.
- Install required build tools for MacOS and Windows.

### Install the Freshworks CLI
- Follow the instructions to install the CLI version compatible with your project.

## Prerequisites
- Google Chrome, Firefox, Edge, Safari (latest and immediately preceding version).
- Node.js 18.15.0 or later.
- NVM 0.39.3 or later.
- Freshworks CLI 9.0.0 or later.
- Freshdesk webhooks and Sendbird's [webhook server](https://somelink.com)
- A proxy server to create Freshdesk tickets and associate Sendbird channel ([example](https://somelink.com))


## Installation
To install the project locally, follow these steps:
1. Clone the repository.
2. Navigate to the project directory.
3. Add an `iparams.json` file to the project root directory.

```json
{
  "api_token": {
    "display_name": "Sendbird Api_Token",
    "description": "Collect from Sendbird Dashboard",
    "type": "text",
    "required": true,
    "secure": true,
    "default_value": "YOUR_API_TOKEN"
  },
  "app_id": {
    "display_name": "Sendbird app_id",
    "description": "Collect from Sendbird Dashboard",
    "type": "text",
    "required": true,
    "secure": false,
    "default_value": "YOUR_APP_ID"
  }
}
```

4. Follow the Quick Start instructions above.

## Usage

### Running the Application Test Mode
1. Navigate to the project directory.
2. Start the server by running `fdk run`.
3. Open the Freshdesk configuration webpage in your browser (link seen in terminal after `fdk run`).
4. Add your Sendbird app_id and session token (from Sendbird dashboard) to the Freshdesk app settings.
5. Open your Fresdesk app add `?dev=true` to the url and reload in a compatible browser to access the main interface.

### Running the Application in Production Mode
1. Run `fdk validate` to validate the whole project.
2. Run `fdk package` to create a zip file of the app.
3. Upload app to Freshdesk.

### Interacting with the Application

- The application provides a global sidebar (`ctiModal.html`) and a ticket sidebar (`index.html`) within the Freshdesk interface.
- 

### Configuration
- Modify `config/iparams.json` to customize HTTP requests and parameters.
- Set up Freshdesk webhooks to handle ticket changes - [video](https://youtube.com).

## Support and Compatibility
Apps built on the Freshworks platform are compatible with the latest and immediately preceding versions of Google Chrome, Firefox, Edge, and Safari.

## Contributing
If you would like to contribute to this project, please review the contributing guidelines and submit your changes via pull requests.

## License
MIT License
