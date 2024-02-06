var http = require('http');
            var url = require('url');
            var qs = require('querystring');
            var db = require("./db");
const { title } = require('process');
            var port = 8080
            http.createServer(function (req, res) {
                var q = url.parse(req.url, true);
                
                var id = q.query.id;
                res.setHeader('Content-Type', 'application/json');
                
                if(q.pathname == "/books" && req.method === "GET"){
                    let sql = "SELECT * FROM library.book";
                    db.query(sql,(err, result) => {
                        if (err) throw err;
                        
                        res.end(JSON.stringify(result));
                        
                    });
                }
                else if(q.pathname == "/books/genre" && req.method === "GET"){
                    let sql = "SELECT DISTINCT genre FROM library.book";
                    db.query(sql,(err, result) => {
                        if (err) throw err;
                        
                        res.end(JSON.stringify(result));
                        
                    });
                }
                else if(q.pathname == "/books/years" && req.method === "GET"){
                    let sql = "SELECT title FROM library.book WHERE publicationYear > 1950";
                    db.query(sql,(err, result) => {
                        if (err) throw err;
                        
                        res.end(JSON.stringify(result));
                        
                    });
                }
                else if(q.pathname == "/books/authorBirthYear" && req.method === "GET"){
                    let sql = "SELECT * FROM library.book WHERE authorBirthYear > 1900";
                    db.query(sql,(err, result) => {
                        if (err) throw err;
                        
                        res.end(JSON.stringify(result));
                        
                    });
                }
                else if(q.pathname == "/books" && req.method === "POST"){
                    var body = '';
                    req.on('data', function (data) {
                        body += data;
                        if (body.length > 1e6)
                            req.connection.destroy();
                    });
                    req.on('end', function () {
                        var postData = qs.parse(body);
                        let title = postData.title;
                        let genre = postData.genre;
                        let publisher = postData.publisher;
                        let publicationYear = postData.publicationYear;
                        let authorName = postData.authorName;
                        let authorBirthYear = postData.authorBirthYear;
                        let authorNationality = postData.authorNationality;
                        let sql = `INSERT INTO library.book (title, genre, publisher, publicationYear, authorName, authorBirthYear, authorNationality) VALUES ('${title}','${genre}','${publisher}','${publicationYear}','${authorName}','${authorBirthYear}','${authorNationality}')`;
            		db.query(sql,(err, result) => {
            		        if (err) throw err;
            			    
            			    if(result.affectedRows == 1){
            			    res.end(JSON.stringify({message: 'success'}));	
            			    }else{
            				res.end(JSON.stringify({message: 'gagal'}));	
            			    }
            			    
            		    });    	
                
                });
                }
                else if(q.pathname == "/books" && req.method === "DELETE"){
                	let sql = `DELETE FROM library.book WHERE id = ${id}`;
            		db.query(sql,(err, result) => {
            	        if (err) throw err;
            		    
            		    if(result.affectedRows == 1){
            		    	res.end(JSON.stringify({message: 'success'}));	
            		    }else{
            				res.end(JSON.stringify({message: 'gagal'}));	
            		    }
            		    
            	    });    	
                }
                else if(q.pathname == "/books/title" && req.method === "DELETE"){
                	let sql = "DELETE FROM library.book WHERE title = 'The Hobbit'";
            		db.query(sql,(err, result) => {
            	        if (err) throw err;
            		    
            		    if(result.affectedRows == 1){
            		    	res.end(JSON.stringify({message: 'success'}));	
            		    }else{
            				res.end(JSON.stringify({message: 'gagal'}));	
            		    }

            	    });    	
                }
                else{
                	res.end();
                }
                
              
            }).listen(port);
            console.log('server is running on http://localhost:'+ port);
            
