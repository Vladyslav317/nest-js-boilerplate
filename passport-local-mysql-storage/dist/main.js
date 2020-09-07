"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const flash = require("connect-flash");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const path_1 = require("path");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./components/app/app.module");
const _404_filter_1 = require("./filters/404.filter");
const MySQLStore = require('express-mysql-session')(session);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.default);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalFilters(new _404_filter_1.default());
    const viewsPath = path_1.join(__dirname, '../public/views');
    app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }));
    app.set('views', viewsPath);
    app.set('view engine', '.hbs');
    app.use(session({
        secret: process.env.PASSPORT_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new MySQLStore({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '1234',
            database: 'sessions',
        }),
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    const port = process.env.SERVER_PORT || 3000;
    await app.listen(port, () => console.log(`The server is running on ${port} port`));
}
bootstrap();
//# sourceMappingURL=main.js.map