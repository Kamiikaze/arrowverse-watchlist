
# Arrowverse Watchlist
![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/kamiikaze/arrowverse-watchlist)
[![CodeFactor](https://www.codefactor.io/repository/github/kamiikaze/arrowverse-watchlist/badge)](https://www.codefactor.io/repository/github/kamiikaze/arrowverse-watchlist)
[![Update Firestore with API Data](https://github.com/Kamiikaze/arrowverse-watchlist/actions/workflows/fetchShows.yml/badge.svg)](https://github.com/Kamiikaze/arrowverse-watchlist/actions/workflows/fetchShows.yml)

This is a project based on [AceFire6's Arrowverse series ordering](https://github.com/AceFire6/ordered-arrowverse).

As it seems that he is no longer working on it, I have created my own project with additional features. Currently, I have copied the list and created a watchlist for it in an Excel spreadsheet. This watchlist is now integrated into the website.

## What it does
The website shows the Arrowverse series in the order they are aired. The website also has a watchlist feature, which allows you to mark episodes as watched and see how many episodes you have left to watch.

The series are updated daily via Github Action from TMDB. Therefore, the list is always up to date.

## Features
Some features are currently only available for registered users. Registration is free and only requires email and password or can be done via Google.
### Watchlist
You can mark episodes as watched and see how many episodes you have left to watch including watched time.
### Filter
You can filter the series by the following criteria:
- Shows (only displays the series you have selected)
- Watched (only show unwatched episodes)
### Open Episode
You can open the episode on Netflix or Amazon Prime Video directly from the website.
### Dark Mode
As I am a coder, I prefer dark mode. Therefore, the website has a dark mode. (But for the weird people who like light mode, there is also a light mode)

## Account
Only when registering an account, the watchlist feature is available and will be saved in the database. Also your filters and thme will be saved.

## Planned Features
- [ ] Adding more series
  - [ ] Vixen
  - [ ] Freedom Fighters: The Ray
- [ ] Adding more streaming services
  - Option to define custom streaming services
- [ ] Adding more filters
- [ ] Adding more sorting options
- [ ] Adding more languages
  - [ ] German
- [ ] Saving watchlist and filters in local storage
- [ ] Account configuration
  - [ ] Change email
  - [ ] Change password
  - [ ] Change username
  - [ ] Change language
  - [ ] Delete account
- [ ] Adding more themes
- [ ] Adding more fancy statistics
- [ ] Adding better support for contributions

## Contributing
Currently you are unable to use the API, as it is not public and won't be. If you want to contribute you can run it in dev mode and it will use data I exported from the API request.
For more informations create an issue. I will update this section when the project is in a stable state.