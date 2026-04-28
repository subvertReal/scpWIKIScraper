# scpWikiAPI
An API currently being built for an react native named [SCIP-READER](https://github.com/subvertReal/SCIPNET-READER) in order to make it easier to read the SCP wiki including offline downloading. This API was heavily inspired by [scp-api](https://github.com/scp-data/scp-api) and originally was meant to exist as essentially a modified API of that one.

Similar to scp-api, it will scrape data from the official [SCP wiki](https://scp-wiki.wikidot.com/) and store data into a public github repo for access. The API is planned to have both a plain txt version as well as a html version of the wiki.

## Problematic Articles
Currently having issues with these articles and may need to manually put a fix or something for these specific articles
- SCP-3211
- SCP-3125
- SCP-2212
- ~SCP-736 (api pulls the name as "We" instead of the actual item number which is very confusing for obvious reasons)~ 736 is completely fine