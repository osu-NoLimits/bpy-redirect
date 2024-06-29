

<h1 align="center">BPY-REDIRECT</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/osu-NoLimits/bpy-redirect?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/osu-NoLimits/bpy-redirect?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/osu-NoLimits/bpy-redirect?color=56BEB8">

  <img alt="License" src="https://img.shields.io/github/license/osu-NoLimits/bpy-redirect?color=56BEB8">
</p>




<br>

## :dart: About ##

Use this to setup the right ingame redirects for your <a href="https://github.com/osuAkatsuki/bancho.py">bancho.py</a> instance
## :sparkles: Redirect Routes ##

:heavy_check_mark: /u/:userid\
:heavy_check_mark: /beatmapsets/:beatmap/discussion\
:heavy_check_mark: /beatmapsets/:set_id/discussion/:beatmap\
:heavy_check_mark: /beatmaps/:beatmap\
:heavy_check_mark: /beatmapsets/:beatmap


## :white_check_mark: Requirements ##

Before starting :checkered_flag:, you need to have [Git](https://git-scm.com) and [Node](https://nodejs.org/en/) installed and at the moment there are only setup instructions for [nginx](https://nginx.org/en/).

## :checkered_flag: Installing ##

```bash
# Clone this project
$ git clone https://github.com/osu-NoLimits/bpy-redirect

# Change dir and install dependencies
cd bpy-redirect
npm install

# Copy env file and change config
cp .env.example .env
nano .env # or vim idc
```

#### :memo: Nginx setup

```bash
# Go into your current bancho nginx config
server {
  listen 80;
  listen [::]:80;
  server_name c.osunolimits.dev ce.osunolimits.dev c4.osunolimits.dev osu.osunolimits.dev b.osunolimits.dev api.osunolimits.dev;
  client_max_body_size 20M;

  # ADD THOSE ROUTES
  location /u/ {
    proxy_pass http://localhost:8080;
  }

  location /home/account/edit {
    proxy_pass http://localhost:8080;
  }

  location /beatmapsets/ {
    proxy_pass http://localhost:8080;
  }

  location /beatmaps/ {
    proxy_pass http://localhost:8080;
  }
  # END OF BPY-REDIRECT ROUTES

  location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Host $http_host;
    add_header Access-Control-Allow-Origin *;
    proxy_redirect off;
    proxy_pass http://bancho;
  }
}
```

#### :memo: Running
```bash
screen -S redirect # open a screen to keep the session running
npm run serve
```

## :memo: License ##

This project is under license from MIT. For more details, see the [LICENSE](LICENSE.md) file.


Made with :heart: by <a href="https://github.com/osu-NoLimits" target="_blank">Marc Andre Herpers</a>

&#xa0;

<a href="#top">Back to top</a>
