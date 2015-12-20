serves static files from `public/` and handle requests to `/api/todos` to fetch or add data.

npm install
node server.js

## Changing the port

You can change the port number by setting the `$PORT` environment variable before invoking any of the scripts above, e.g.,

PORT=3001 node server.js