# Production deployment

This guide deploys the Next.js app on an Ubuntu server with Node.js, PostgreSQL, systemd and Nginx. It assumes DNS for `smartplcsolutions.com` points to the server and that PostgreSQL is reachable from it.

## 1. Configure DNS and the server

- Create A/AAAA records for `smartplcsolutions.com` pointing to the server. Point `www.smartplcsolutions.com` to the same server if it will be supported.
- Allow inbound SSH, HTTP (80) and HTTPS (443); keep the app port (3000) private to the server.
- Install a supported Node.js LTS release, npm, PostgreSQL client tools, Nginx and Certbot. Use a managed PostgreSQL service or a separately secured PostgreSQL server for the database.

## 2. Install the application

Use `/srv/smartplcsolutions` as the application directory (or adjust the paths below). Copy the project contents from `medieval-armors/` to the server, excluding `.env`, `.next`, `node_modules`, and local backups. Product image files must live in persistent storage because deployments replace the application directory. The uploader supports JPG, PNG, WebP, AVIF, and GIF, and serves new uploads through an application route so images uploaded after a build are available immediately.

Create persistent storage for uploads and point `PRODUCT_UPLOAD_DIR` in `/etc/smartplcsolutions.env` to it. The API writes new images there and serves them directly. For example, on first setup:

```sh
sudo mkdir -p /srv/smartplcsolutions-shared/uploads/products
sudo chown -R smartplc:smartplc /srv/smartplcsolutions-shared/uploads
echo 'PRODUCT_UPLOAD_DIR=/srv/smartplcsolutions-shared/uploads/products' | sudo tee -a /etc/smartplcsolutions.env
```

Existing image URLs use `/uploads/products/...`. Preserve those files at the same URL path by linking the legacy public directory to shared storage on each release. During the one-time migration, copy existing uploads and move the old directory aside before creating the link:

```sh
rsync -a /srv/smartplcsolutions/public/uploads/ /srv/smartplcsolutions-shared/uploads/
mv /srv/smartplcsolutions/public/uploads /srv/smartplcsolutions/public/uploads.pre-persistent
mkdir -p /srv/smartplcsolutions/public
ln -s /srv/smartplcsolutions-shared/uploads /srv/smartplcsolutions/public/uploads
```

For later releases, create the `public/uploads` link before building or starting the new release; existing links in a release directory can be left in place.

Back up `/srv/smartplcsolutions-shared/uploads` along with PostgreSQL. If uploads were not preserved on the server, restore them from the previous release or a backup; the database only contains their URLs, not the image bytes.

```sh
cd /srv/smartplcsolutions
npm ci
npx prisma generate
```

Create `/etc/smartplcsolutions.env` readable only by the application service account. Start from `.env.example`; use strong, unique secrets for both JWT values, production payment credentials, and production email settings. Set at least:

```dotenv
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://smartplcsolutions.com
DATABASE_URL=postgresql://USER:PASSWORD@DB_HOST:5432/DATABASE
ADMIN_JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET
CUSTOMER_JWT_SECRET=REPLACE_WITH_A_DIFFERENT_LONG_RANDOM_SECRET
```

Set the remaining `RESEND_*`, `ORDER_EMAIL_FROM`, `QUOTE_EMAIL_TO`, PayPal and Razorpay values required by the features you will enable. Keep payment provider modes and credentials in production mode. Do not commit or copy `.env` into the release artifact.

Set ownership and permissions for the environment file, then apply migrations and build as the service account:

```sh
sudo chown root:smartplc /etc/smartplcsolutions.env
sudo chmod 640 /etc/smartplcsolutions.env
set -a && . /etc/smartplcsolutions.env && set +a
npx prisma migrate deploy
npm run build
```

Do not run `prisma db seed` against production until the catalog data and seed behavior have been reviewed for that database.

## 3. Run Next.js with systemd

Create `/etc/systemd/system/smartplcsolutions.service` (replace `smartplc` and the app path if needed):

```ini
[Unit]
Description=Smart PLC Solutions web app
After=network.target

[Service]
Type=simple
User=smartplc
Group=smartplc
WorkingDirectory=/srv/smartplcsolutions
EnvironmentFile=/etc/smartplcsolutions.env
Environment=PORT=3000
ExecStart=/usr/bin/npm run start -- --hostname 127.0.0.1
Restart=on-failure
RestartSec=5
TimeoutStopSec=30
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Ensure the service account can write to `public/uploads/products/`, then enable and start the service:

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now smartplcsolutions
sudo systemctl status smartplcsolutions
```

## 4. Configure Nginx and HTTPS

Configure Nginx to proxy the domain to `127.0.0.1:3000`, forward the original `Host`, `X-Forwarded-For` and `X-Forwarded-Proto` headers, and allow request bodies large enough for the app's 10 MB product image limit (for example `client_max_body_size 12m`). Validate and reload Nginx, then issue a Let's Encrypt certificate for the apex domain and `www` if used. Redirect HTTP to HTTPS and choose one canonical hostname; update `NEXT_PUBLIC_SITE_URL` if the canonical origin is `https://www.smartplcsolutions.com` instead.

## 5. Release updates and operations

For each release, back up the database and uploaded images, deploy the new source, install dependencies with `npm ci`, generate Prisma, run `npx prisma migrate deploy`, build, and restart the systemd service. Check `journalctl -u smartplcsolutions` and the Nginx error log if startup or requests fail. Configure off-server, tested backups for PostgreSQL and `public/uploads/products/` before taking live orders.

After DNS and HTTPS are live, verify `https://smartplcsolutions.com/robots.txt`, `/sitemap.xml` and `/api/merchant/products.xml`. Add the property to Google Search Console and submit the sitemap. Confirm payment webhooks/return URLs and email delivery with the production domain in each provider dashboard before enabling live checkout.
