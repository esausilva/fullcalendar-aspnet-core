# FullCalendar .NET Core with Visual Studio

> Implementation of [FullCalendar](https://fullcalendar.io/) in ASP.NET Core

The project includes the implementation of FullCalendar in JavaScript ES6+ and comes wired with the necessary database access layer (including SQL statements) to interact with SQL Server.

## Setting Up

### Frontend

You will need to have [Node](https://nodejs.org) and npm installed as I use [Webpack](https://webpack.js.org) to compile my Sass files and modern ES6+ JavaScript files to JavaScript browsers can understand.

Clone this repository then in **Command Prompt** navigate to the project's directory and install NPM packages

```
cd [project's path]\fullcalendar-core\fullcalendar-core
npm i
```

You will also need [NPM Task Runner](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.NPMTaskRunner) as I have set up to run Webpack in watch mode when the project opens. Webpack will also run before each build _building_ the JavaScript for production. You can see the bindings if you open **Task Runner** within Visual Studio

### Backend

In SQL Server create a database and name it `fullcalendar`, then create a table and name it `Events` with the following format

| Column Name | Data Type                        |
| ----------- | -------------------------------- |
| event_id    | PK, int, identity(1,1), not null |
| title       | VarChar(300), not null           |
| description | VarChar(max), not null           |
| event_start | DateTime, not null               |
| event_end   | DateTime, null                   |
| all_day     | Bit, not null                    |

Once you have that, open `appsettings.json` and change the connection string to reflect your database connection.

## Things to Know

The source Sass and JavaScript files are found under `.\Styles` and `.\Scripts` directories. Webpack will compile them every time upon save and place the output files under `.\wwwroot\css` and `.\wwwroot\js`, so DO NOT modify these output files.

For production, Webpack will minify and optimize the output files appending `*.min.*` to the file name. The CSS will also get auto-prefixed.

## Implemented Features

- Update existing events (Start/End Times, Description, All Day)
- Create single day events
- Create all day events

## Upcoming Features

- Delete events
- Drag & Drop events
- Rezise events

_In no particular order_

## Giving Back

If you would like to support my work and the time I put in making tutorials, you can click the image below to get me a coffee. I would really appreciate it (but is not required).

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/esausilva)

## Preview

![Imgur](https://i.imgur.com/p6BjJ2Vm.jpg)

![Imgur](https://i.imgur.com/3378pXYm.jpg)

![Imgur](https://i.imgur.com/nlDoTsQm.jpg)

-Esau
