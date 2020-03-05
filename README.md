<div align="center">
  <img src="https://github.com/felixheck/loaa/blob/master/assets/hut.svg" width="200" alt="hawaiian hut icon">
  <h1>Loa'a</h1>
  <h2>Hostelworld Slack Alerting</h2>
</div>

> You have a hostel in mind, but there is currently no bed available? Would you like to have a simple alerting tool to be informed about released beds? Easy-peasy. Clone the repo, quickly set the two slack-specific variables and deploy it. After that, you can pass the preferred dates and property ID via URL or repeatedly via cronjob. The service then notifies you directly in Slack. The limitation: you need to pass single dates, no ranges.

<br>
<br>

## 1. Clone

```
git clone https://github.com/felixheck/loaa.git
```

## 2. Set up Slack Bot
1. Create a Slack app [here](https://api.slack.com/slack-apps)
2. Assign a name and a workspace in the following steps
3. Grant the following permissions under **OAuth & Permissions**:
    - `chat:write`
    - `chat:write.customize`
    - `chat:write.public`
4. Install app to workspace
5. Note **Bot User OAuth Access Token**
6. Find out the Slack channel ID by right-clicking the channel's name and copying the link's URL.

## 3. Configure

Either add secrets to `now`:

```
now secret add hostel-slack-token <SLACK BOT TOKEN>
now secret add hostel-slack-channel <SLACK CHANNEL>
```

Or, add the respective values to `.env`:
```
cp ./.env.keep ./.env
```

You may have to edit the `.gitignore` file accordingly.

## 4. Deploy

```
now
```

## 5. Request
Simple perform a a `GET` request to the `/search` endpoint of your deployment and pass the respective data:

```
<DEPLOYMENT>/search?dates=2020-04-19,2020-04-23&hostel=12345
```

Query Parameters: 
- `dates`: comma-separated list of dates (YYYY-MM-DD)
- `hostel`: hostelworld property identifier of the website's URL

<br><br>

---

<div align="center">
  <sup>
  Logo made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
  </sup>
</div>
