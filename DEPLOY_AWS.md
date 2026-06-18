# Deploying Lok Mangal News to AWS (EC2 + PM2 + Nginx)

This app is a single Node/Express server that **serves the built React frontend
and the API**, and runs the **News Autopilot scheduler in-process** (node-cron).
Because the scheduler must run continuously, deploy it on an **always-on EC2
instance** (not Lambda/serverless). PM2 keeps it alive and restarts it on crash
or reboot; Nginx terminates HTTP/HTTPS and proxies to the Node process.

```
Internet ──443/80──> Nginx ──proxy──> Node (PORT 5050) ──> MongoDB Atlas
                                         └─ in-process autopilot cron
```

---

## 0. Prerequisites
- A domain (e.g. `thelokmangal.com`) you can point at an IP.
- The MongoDB Atlas cluster you already use.
- Your secrets ready: `MONGO_URI`, `JWT_SECRET`, `WEATHER_API_KEY`, `OPENAI_API_KEY`.

---

## 1. Launch the EC2 instance
1. EC2 → **Launch instance**.
   - **AMI:** Ubuntu Server 24.04 LTS.
   - **Type:** `t3.small` (2 GB RAM) recommended. `t2.micro`/`t3.micro` (1 GB) can
     run the app but may run out of memory during the Vite build — if so, build
     the frontend locally and upload `frontend/dist` (see note in step 6).
   - **Key pair:** create/download one for SSH.
   - **Storage:** 16–20 GB gp3.
2. **Security group** (inbound):
   | Port | Source | Why |
   | --- | --- | --- |
   | 22 | *your IP only* | SSH |
   | 80 | 0.0.0.0/0 | HTTP (redirects to HTTPS) |
   | 443 | 0.0.0.0/0 | HTTPS |

   Do **not** expose port 5050 publicly — Nginx reaches it locally.
3. **Allocate an Elastic IP** and associate it with the instance (stable public IP).

---

## 2. Point MongoDB Atlas at the server
Atlas → **Network Access** → **Add IP Address** → enter the **Elastic IP** (`/32`).
(Using `0.0.0.0/0` works but is far less secure.) Confirm the DB user in your
`MONGO_URI` exists.

---

## 3. SSH in and install runtime
```bash
ssh -i your-key.pem ubuntu@<ELASTIC_IP>

# Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx

sudo npm install -g pm2
node -v && npm -v
```

---

## 4. Get the code onto the server
```bash
cd /var/www 2>/dev/null || (sudo mkdir -p /var/www && sudo chown $USER /var/www && cd /var/www)
git clone <YOUR_REPO_URL> lokmangal
cd lokmangal
```
(No repo remote? `scp -r` the project up, excluding `node_modules`, `frontend/dist`, `.env`.)

---

## 5. Create the production `.env`
`.env` is gitignored, so create it on the server (repo root):
```bash
cat > /var/www/lokmangal/.env <<'EOF'
NODE_ENV=production
PORT=5050
MONGO_URI=<your atlas uri>
JWT_SECRET=<your jwt secret>
WEATHER_API_KEY=<your weather key>

# News Autopilot
AUTOPILOT_ENABLED=true
AUTOPILOT_DRY_RUN=false
OPENAI_API_KEY=<your openai key>
OPENAI_MODEL=gpt-4o-mini
AUTOPILOT_AUTHOR_USERNAME=lokmangalwriter
AUTOPILOT_TIMEZONE=Asia/Kolkata
AUTOPILOT_MIN_PER_CATEGORY=1
AUTOPILOT_MAX_PER_CATEGORY=2
AUTOPILOT_EXTRA_CHANCE=0.35
AUTOPILOT_DAY_START=08:00
AUTOPILOT_DAY_END=22:00
AUTOPILOT_ONLY_TODAY=false
AUTOPILOT_MAX_AGE_DAYS=2
EOF
chmod 600 .env
```
> Tip: keep `AUTOPILOT_DRY_RUN=true` for the first boot to confirm everything
> works without publishing, then flip to `false`.

The server timezone can stay UTC — the autopilot uses `AUTOPILOT_TIMEZONE` for
its schedule, so waves still fire on IST.

---

## 6. Install deps & build the frontend
```bash
cd /var/www/lokmangal
npm install                      # backend deps (root package.json)
cd frontend && npm install && npm run build   # produces frontend/dist
cd ..
```
> **Low-RAM instances:** if `npm run build` is killed (OOM), either add a swap
> file (`sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap
> /swapfile && sudo swapon /swapfile`) or build `frontend/dist` on your laptop and
> `scp` it to `frontend/dist` on the server.

---

## 7. Start with PM2
```bash
cd /var/www/lokmangal
pm2 start backend/server.js --name lokmangal --time
pm2 save
pm2 startup        # run the sudo command it prints, so it survives reboots
pm2 logs lokmangal # watch: should show "MongoDB connected" + "[autopilot] enabled …"
```
Verify locally on the box:
```bash
curl -s localhost:5050/api/news/hashtags   # should return JSON
```

Optional log rotation:
```bash
pm2 install pm2-logrotate
```

---

## 8. Nginx reverse proxy
```bash
sudo tee /etc/nginx/sites-available/lokmangal >/dev/null <<'EOF'
server {
    listen 80;
    server_name thelokmangal.com www.thelokmangal.com;
    client_max_body_size 10m;

    location / {
        proxy_pass http://127.0.0.1:5050;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
sudo ln -sf /etc/nginx/sites-available/lokmangal /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

---

## 9. DNS + HTTPS
1. At your DNS provider, add **A records** for `@` and `www` → the **Elastic IP**.
   Wait for propagation (`dig thelokmangal.com +short`).
2. Issue a free TLS cert:
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d thelokmangal.com -d www.thelokmangal.com
```
Certbot edits the Nginx config for HTTPS and auto-renews via a systemd timer.

Visit `https://thelokmangal.com` — the site should load and the API should work.

---

## 10. Verify the autopilot
```bash
pm2 logs lokmangal | grep autopilot
#   [autopilot] enabled — 1-2 article(s)/category/day at random times …
#   [autopilot] planDay <date>: N publish(es) scheduled across 8 categories

# Optional manual checks (run from the project dir):
npm run autopilot:dry                                  # full wave, no DB writes
node backend/automation/run.js --category खेल --dry-run # single category
```
Articles then appear automatically at their random times. Confirm new posts on
the live site or in Atlas.

---

## Updating after a code change
```bash
cd /var/www/lokmangal
git pull
npm install
cd frontend && npm install && npm run build && cd ..
pm2 restart lokmangal
```

## Operations cheatsheet
| Task | Command |
| --- | --- |
| View logs | `pm2 logs lokmangal` |
| Restart | `pm2 restart lokmangal` |
| Status | `pm2 status` |
| Pause publishing | set `AUTOPILOT_DRY_RUN=true` in `.env`, `pm2 restart lokmangal` |
| Stop autopilot only | set `AUTOPILOT_ENABLED=false`, `pm2 restart lokmangal` |

## Rough cost
- EC2 `t3.small`: ~$15/mo (or `t3.micro` ~$7.5/mo with a swap file).
- Elastic IP: free while attached to a running instance.
- MongoDB Atlas: your existing tier.
- OpenAI `gpt-4o-mini`: a few cents/day at ~8–16 articles/day.

## Notes
- Keep `.env` out of git (it already is) — never commit secrets.
- The autopilot makes outbound HTTPS (news sites + OpenAI); EC2 allows outbound by default.
- If you later move the DB or rotate keys, edit `.env` and `pm2 restart lokmangal`.
- For zero-downtime/multi-instance setups you'd move the cron out of the web
  process; for a single server this in-process design is simplest and fine.
