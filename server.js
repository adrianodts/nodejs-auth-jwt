require('dotenv').config();
const app = require('./app');
const port = 3000;
const db = require('./database');
const routes = require('./rotas');
require('./redis/blocklist-access-token')
require('./redis/allowlist-refresh-token')
routes(app);

app.listen(port, () => console.log(`App listening on port ${port}`));
