const express = require('express');
const app = express(); // 서버 모듈
const fs = require('fs'); // 파일 입출력
const bodyParser = require('body-parser'); // POST
var mysql = require('mysql');
var mongoose = require('mongoose');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("data"));


app.post('/data', (req, res) => { // 문제 가져오기
    var g = req.params.que;
    var c = req.params.source;
    fs.readFile('data/question' + g + 'g.json', (err, data) => { // data/timeTable/ 에있는 json파일을 불러옴
        if (err) res.send(null);
        else {
            res.send({
                result: JSON.parse(data)[c] // json파일로 변환후 해당 문제 전송
            });
        }
    })

})
/*
  /data (문제)
    param que, source

  /user/siginin (로그인)
  /user/siginup (회원가입)

  /find (유저찾기)

  /change (비밀번호 변경)

  /qna (게시판)
*/
app.post('/user/signin', (req, res) => { // 로그인
    var id = req.body.id; // 유저 아이디
    var pw = req.body.pw; // 유저 패스워드
    var sql = "SELECT id,password FROM login WHERE id=?"
    con.query(sql, [id], (err, result, fields) => {
        if (err) {
            res.status(505).end(); // 에러 시 505
        }
        if (!result[0]) {
            console.log("login id x");
            res.status(405).end(); // 아이디가 없을 시 405
        }
        else {
            if (result[0].password == pw) {
                console.log(`[LOGIN USER]\nID : ${id}`);
                res.status(200).end(); // 성공 시 200
            }
            else {
                console.log("login pw x");
                res.status(405).end(); // 비밀번호 불일치 시 405
            }
        }

    })
})
app.post('/user/signup', (req, res) => { // 회원가입
    var name = req.body.name; // 유저 이름
    var id = req.body.id; // 유저 아이디
    var pw = req.body.pw; // 유저 패스워드
    if (!name || !id || !pw) {
        console.log("[NOT DATA]")
        res.status(405).end() // 데이터가 없을 시 405
    }
    else {
        var sql = "SELECT id FROM login WHERE id=?";
        con.query(sql, [id], (err, result, fields) => {
            if (err) {
                res.status(505).end(); // 에러 시 505
            }
            if (!result[0]) {
                var sql = "INSERT INTO login (id, password, name) VALUES(?,?,?)";
                con.query(sql, [id, pw, name], (err, result, fields) => {
                    if (err) {
                        res.status(505).end(); // 에러 시 505
                    }
                    else {
                        var date = new Date();
                        console.log(`[Create User]\nID : ${id}\nNAME : ${name}`);
                        res.status(200).end() // 제대로 생성됬을 시 200
                    }
                })
            }
            else {
                console.log("[SAME USER]")
                res.status(405).end(); // 이미 있는 사용자일시 405
            }
        });
    }
})

app.post('/find', (req, res) => { // 비밀번호 변경을 위한 유저 찾기
    var id = req.body.id; // 유저 아이디
    var name = req.body.name; // 유저 이름
    if (!name || !id) {
        console.log("[NOT DATA]")
        res.status(405).end() // 데이터가 없을 시 405
    }
    else {
        var sql = "SELECT id,name FROM login WHERE id=?";
        con.query(sql, [id], (err, result, fields) => {
            if (err) {
                res.status(505).end(); // 에러 시 505
            }
            if (!result[0]) {
                console.log("[NOT DATA]")
                res.status(405).end() // 데이터가 없을 시 405
            }
            else {
                if (result[0].name == name) {
                    console.log("[FIND DATA]")
                    res.status(200).end() // 찾았을 시 200
                }
            }
        });
    }

})
app.post('/change', (req, res) => { // 유저찾기에 성공시 비밀번호 변경
    var id = req.body.id; // 유저 아이디
    var pw = req.body.password; // 유저 패스워드

    var sql = "UPDATE login SET password=? WHERE id=?"
    con.query(sql, [pw, id], (err, result, fields) => {
        if (err) {
            res.status(505).end(); // 에러 시 505
        }
        else {
            console.log("[CHANGE DATA]")
            res.status(200).end(); // 성공 시 200
        }
    })
})

app.post('/post', (req, res) => {
    // INSERT INTO QnA (writerId,date,content) VALUES (4,now(),"Hello World!");
})
app.get('/qna', (req, res) => {
    var sql = "SELECT * FROM QnA"
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.status(505).end(); // 에러 시 505
        }
        else {
            var data = [];
            var idx = "";
            for (i in result) {
                idx += result[i].writerId
                if (i < result.length - 1) {
                    idx += ",";
                }
            }
            var sql = "SELECT pCode,name FROM login WHERE pCode in (" + idx + ")";
            con.query(sql, (err, user, fields) => {
                for (i in result) {
                    data.push({
                        writer: user[user.findIndex(x => x.pCode == result[i].writerId)].name,
                        date: result[i].date,
                        content: result[i].content
                    })
                }
                res.send({ result: data })
            })
        }
    })
})

app.listen(3000, () => {
    console.log('server porting on 3000');
})
