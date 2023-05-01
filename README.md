# Maokai Matchups

Maokai Matchups is a website that shows League of Legends toplane matchups for Maokai. It displays information such as runes, items, and difficulty for each matchup.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- Displays runes, items, and difficulty for each matchup
- Data is sourced from a Google Spreadsheet and assets from the Riot API
- Built with React using the Typescript template
- Utilizes React-Router, react-tooltip, and dark-mode-toggle libraries

## Installation

1. Clone the repository to your local machine
2. Navigate to the project directory
3. Run `npm install` to install the necessary dependencies
4. Create a `.env` file in the root directory of the project
5. Add the following environment variables to the `.env` file:

```
REACT_APP_TWITCH_CLIENT_ID=[Your Twitch Client ID]
REACT_APP_TWITCH_CLIENT_SECRET=[Your Twitch Client Secret]
REACT_APP_GOOGLE_SHEETS_API_KEY=[Your Google Spreadsheet API Key]
```

6. Run `npm start` to start the development server

## Usage

To use the website, simply navigate to the homepage and select a matchup from the list. The website will display information about the selected matchup, including runes, items, and difficulty. The website also includes a tooltip component that displays additional information about each matchup when the user hovers over the matchup name.

## Contributing

If you would like to contribute to the project, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them to your branch
4. Push your changes to your forked repository
5. Open a pull request to the main repository

## Credits

This project was developed by Martin Mui. It sources data from a Google Spreadsheet created by [Aizolol](https://linktr.ee/aizolol) and assets from the Riot API.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Questions

If you have any questions or feedback regarding the project, please contact us at martinchmui@gmail.com.
