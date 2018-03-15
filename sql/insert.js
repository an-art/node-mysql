var mysql = require('mysql');
const fs = require('fs');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'node_mysql_task'
});
connection.connect();

var users = [
    {
        firstName: 'Alex',
        lastName: 'Booker',
        image: fs.readFileSync('C:/pacman.png'),
    },
    {
        firstName: 'lol',
        lastName: 'kek',
        image: fs.readFileSync('C:/pacman.png'),
    },
    {
        firstName: 'op',
        lastName: 'pop',
        image: fs.readFileSync('C:/pacman.png'),
    },
    {
        firstName: 'lala',
        lastName: 'land',
        image: fs.readFileSync('C:/pacman.png'),
    }
];
users.map(user => connection.query('insert into user set ?', user, function (err, result) {
  if (err) {
    console.error(err);
    return;
  }
  console.error(result);
}));
connection.end();
