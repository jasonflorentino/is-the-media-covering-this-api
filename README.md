# 🗞 Is The Media Covering This?
**The backend api for a [web app](https://github.com/jasonflorentino/is-the-media-covering-this-webapp) and [Twitter bot](https://github.com/jasonflorentino/is-the-media-covering-this-bot)**

#### 💀 Deprecation Notice
As of 2022-11-26, those apps won't work. That's because this app is no longer running on its free Heroku dyno. Because those no longer exist. And currently, I'm not planning on spinning it up elsewhere. Sorry!

# Notes

During development I tried different news APIs to see which I prefer and eventually landed on Google's. Interfaces for the others still exist in code though. I think maybe I had been kicking around the idea of allowing the user to choose which service, or maybe aggregating the results from all services. During the app's production runtime, it only ever reached out to Google. Or rather, the client app only knew to reach out to this app's Google endpoint.
