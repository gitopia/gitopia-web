## Changelog

### v2.1.1 - 3rd July 2024

- Fix offchain sign
- Update bounty link in rewards page

### v2.1.0 - 1st July 2024

- Cache token prices in components
- Improve bounties page

### v2.0.0 - 26th Jun 2024

- Refactor the webapp to use the API client context across components
- Decentralize API providers
- New provider selector component in the header
- Add a button to refresh the API provider
- Remove WebSocket subscription
- Poll for task completion in the case of fork repository and merge PR
- Show platform incentives in Rewards view
- Add a new Bounties page
- Add a new Bounties Leaderboard view
- Support highlighting of specific lines in the code view. URL format: `...<filename>#L10-L22`
- Fix comments count in the issues list view
- Fix user profile link in the DAO view
- Fix 404 error in Repository view when tag name includes `-` in the url
- Fix the size of Issue description component in the issue view

### v1.15.3 - 23rd Feb 2024

- Fix graphql query in issue link field

### v1.15.2 - 18th Sep 2023

- Changes in rewards api

### v1.15.1 - 16th Sep 2023

- Fix arbitrary message signing in Keplr

### v1.15.0 - 14th Sep 2023

- Update rewards flow
- Add latest activity and bounty feed

### v1.14.0 - 17th Aug 2023

- Updated homepage with activity feed
- Changed designs of dao / user settings page

### v1.13.4 - 5th Jul 2023

- Use pull request api for diff calculation

### v1.13.3 - 5th Jul 2023

- Fixed review comments in merged pull requests and updated files

### v1.13.2 - 27th Jun 2023

- Fixed creating review comments in forked pull requests

### v1.13.1 - 24th Jun 2023

- Fixed default branch loading other commit files

### v1.13.0 - 23 Jun 2023

- Adding assignee and reviewer modal
- Disable commenting option in a commit
- Fixed the overflow for issue pull request view
- Fixed delete branch always deletes main branch
- Fixed ledger ibc transfers

### v1.12.0 - 19 Jun 2023

- Update display format of tokens
- Fixes ibc transfers for keplr

### v1.11.1 - 16 Jun 2023

- Fixes ibc transfers and caching

### v1.11.0 - 15 Jun 2023

- Fixes russian characters rendering
- Loading IBC config according to network type
- Correcting owner in issue link view
- Balance Available -> Owner Balance in support project
- Fixing review comments and updating review comment design
- Show dollar value using coingecko
- Disable delete repository button

### v1.10.0 - 9 Jun 2023

- Loading IBC config according to network type

### v1.9.0 - 6 Jun 2023

- Adding autocomplete for branches in change default branch
- Fixing ui for branch protection rule component
- Updated label dialog
- Correcting pull request message
- Typo fixes in support project
- Disabling buttons for reward page

### v1.8.0 - 16th May 2023

- Add feegrants support
- Updated wallet selection dropdown
- Repository description edit transcation supported
- Fixed ledger transport always connected issue
- Removed localstorage saving of plain wallet
- Account popup info card added
- Design changes for repository page, landing page

### v1.7.0 - 3rd Mar 2023

- Claim rewards page updated
- Build and code improvements

### v1.6.0 - 24th Mar 2023

- Added comments in diffs of pull requests and commits
- Files changed tree view added
- Updated behaviour for syntax highlighting of large files
- Updated bounty design, expiry date check

### v1.5.0 - 16th Mar 2023

- Added branch protection rules
- Update DAO member role
- Funding page while onboarding new user
- Better autodetection of code syntax highlighting
- Updated forking flow with branch selection and repository name change
- Added back button in wallet selection
- Bounty and balance related fixes
- Minor design improvements
- Testing suite updated for ux changes

### v1.4.1 - 22nd Feb 2023

- Added a prompt to backup wallet
- Disabled cssnano, build fixed

### v1.4.0 - 22nd Feb 2023

- New wallet panel in header showing all assets
- Deposit and Withdraw from IBC chains
- New bounties workflow inside issues which can use any IBC token
- Issues can be interlinked with Pull Requets
- Reward bounties to pull request owner when closing an issue

### v1.3.2 - 20th Dec 2022

- Fix ledger wallet onboarding

### v1.3.1 - 5th Dec 2022

- Fix the input validation in sendTlore component
- Fix the text overflow in mobile view
- Updated the GSoB copy

### v1.3.0 - 2nd Dec 2022

- Profile image upload to ipfs
- Date parsing fixed in safari
- Disable pull request creation from ahead branch
- Minor UX bug fixes

### v1.2.1 - 1st Dec 2022

- fix build: add null check

### v1.2.0 - 1st Dec 2022

- Fix keplr gasPriceStep type issue
- Better error and warning messages

### v1.1.0 - 11th Nov 2022

- Fix keplr wallet integration
- Fix mardown rendering in release description
- Only include necessary fields in the download wallet
- Support for relative links and images in markdown
- Show file too big message when loading files larger than 1Mb
- Raw button to download files

### v1.0.0 - 27th Oct 2022

User and Dao profile overhaul

- Support revamed Gitopia APIs
- Username creation now mandatory for all other interactions
- User and Dao profile have expanded fields and support updation
- GraphQL query integrated for profile's commit history timeline
- Most pages have a basic mobile view
- File viewer now supports images and markdown rendering
- Landing page updated

### v0.3.0 - 5th Apr 2022

Framework updates and Task queue implementation

- Upgrade Next.js and DaisyUI packages
- New invoke flow for forking and pull request merging
- Git server authorizations

### v0.2.0 - 5th Feb 2022

Collaborative and pull request features

- Add collaborators and permissions
- Forking and insights
- Pull request creation
- Search and sort pull requests and issues
- User transactions
- Keplr wallet interation
- Send currency to other wallets
- Showcase repository in landing page

### v0.1.1 - 10th Sep 2021

Code browsing, issue and release

- Browse through uploaded code
- User public page
- Integrated with git-remote-helper
- Create a release
- Create issues and labels

### v0.1.0 - 1st Aug 2021

Basic integration with Gitopia chain

- Create and recover wallet
- Recieve currency from faucet
- Create respository and dao
- Basic dashboard setup
