const http = require('http');
const randomstring = require('randomstring');

const db = require('./db');

const Notes = db.notes;

http
  .createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-Requested-With,content-type'
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    console.log('server work');

    if (req.method === 'GET') {
      res.end('server work');
    } else {
      // POST Метод
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        let params = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });

        if (params.note) {
          let note = params.note;
          note = note.trim();
          console.log(note);

          Notes.create({
            url: randomstring.generate({
              length: 24,
              capitalization: 'lowercase'
            }),
            text: note,
            timestamp: Math.floor(Date.now() / 1000)
          })
            .then((result) => {
              res.end(JSON.stringify({ result: true, url: result.url }));
            })
            .catch((err) => {
              console.log(err);
              res.end(JSON.stringify({ result: false, error: err }));
            });
        } else if (params.url) {
          let url = params.url;
          url = url.trim();
          console.log(url);

          Notes.findOne({
            where: {
              url: url
            }
          })
            .then((result) => {
              if (result) {
                res.end(JSON.stringify({ result: true, note: result.text }));
                // Для удаления сообщения
                // Notes.destroy({where: {id: result.id}});
              } else {
                res.end(
                  JSON.stringify({ result: false, text: 'note not found' })
                );
              }
            })
            .catch((err) => {
              console.log(err);
              res.end(JSON.stringify({ result: false, error: err }));
            });
        }
      });
    }
  })
  .listen(3500);
