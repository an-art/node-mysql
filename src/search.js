const mysql = require('mysql');
const fs = require('fs');
const pdf = require('pdfkit');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'node_mysql_task'
});
let selectQuery, insertQuery;
module.exports = function (firstName) {
    const poolConnection = pool.getConnection(function(err, connection) {
        let userPDF;
        
        if (err) {           
            console.log('Error connecting database');
            return;
        }
        console.log('Database is connected ');

        selectQuery = connection.query('select firstName, lastName, image from user where firstName = ?', firstName, function (err, result) {          
            if (err) {
                console.error('Query error!');
                return;
            }
            try {              
                userPDF = createPDF(result[0]);
            } catch (e) {
                console.log('There is no user with such a name');
                return;
            }

            insertQuery = connection.query('update user set pdf=? where firstName=?', [userPDF, firstName], function(err, result) {
                connection.release();
                if (err) {
                    console.error(err);
                    return;
                }  
                return true;              
            });
            return true;   
        });
        return true;   
    });
    
    if (!poolConnection && !selectQuery && !insertQuery) {
        return false;
    }
    return true;
}

function createPDF(user) {
    const doc = new pdf;
    const userPDF = 'pdf/' + user.firstName + '.pdf';
    try {
        doc.pipe(fs.createWriteStream(userPDF));
        doc.font('Times-Roman')
            .fontSize(20)
            .text(user.firstName + ' ' + user.lastName)
            .image(user.image);
        console.log('pdf is created');
    } catch (e) {
        console.log('Error creating pdf');
        return;
    }  
    doc.end();
    return userPDF;
}