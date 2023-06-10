const express = require("express");
const path = require("path");
// const bodyParser = require("body-parser");
const mysql = require("mysql2");
const port = 3000;
const static = require("serve-static");
const session = require("express-session");
// const bodyParser = require("body-parser");
const sqlData = require("./mysql.json");
const fs = require("fs");
let uid = null;
const pool = mysql.createPool({
  host: sqlData.host,
  user: sqlData.user,
  password: sqlData.password,
  database: sqlData.database,
  port: sqlData.port,
  debug: false,
  connectionLimit: 10,
});
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my key",
    resave: true,
    saveUninitialized: true,
  })
);

app.post("/process/logIn", (req, res) => {
  console.log("/process/logIn 호출됨" + req);
  const paramId = req.body.logInId;
  const paramPw = req.body.logInPw;
  const paramName = req.body.logInName;
  uid = paramId;

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("DB connection failed");
      return;
    }
    console.log("DB connection success");
    const exec = conn.query(
      "select id, passwd from members where id = ? and passwd = ?",
      [paramId, paramPw],
      (err, result) => {
        conn.release();
        console.log("실행된 sql: " + exec.sql);
        if (err) {
          console.log("sql 실행 시 오류 발생");
          console.dir(err);
          res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
          res.write("<h2>로그인 실패</h2>");
          res.end();
          return;
        }
        if (paramId === "admin" || paramPw === "admin") {
          console.log("관리자 로그인");
          req.session.userId = paramId;
          res.redirect("/admin");
          res.end();
        } else if (result.length > 0) {
          console.dir(result);
          console.log("로그인 성공");
          req.session.userId = paramId;
          res.redirect("/main");
          res.end();
        } else {
          res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
          res.write(
            "<script>alert('아이디 또는 비밀번호가 일치하지 않습니다.');</script>"
          );
          res.write(fs.readFileSync("./public/home.html"));
          res.end();
        }
      }
    );
  });
});

app.post("/process/signUp", (req, res) => {
  console.log("/process/signUp 호출됨" + req);

  const paramId = req.body.signUpId;
  const paramPw = req.body.signUpPw;
  const paramName = req.body.signUpName;

  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("DB connection failed");
      return;
    }
    console.log("DB connection success");
    const exec = conn.query(
      "insert into members (id, passwd, name) values (?, ?, ?)",
      [paramId, paramPw, paramName],
      (err, result) => {
        conn.release();
        console.log("실행된 sql: " + exec.sql);
        if (err) {
          res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
          res.write("<script>alert('이미 존재하는 아이디입니다.')</script>");
          res.write(fs.readFileSync("./public/home.html"));
          res.end();
          return;
        }
        if (result) {
          console.dir(result);
          console.log("inserted 성공");
          // res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
          // res.write(
          //   "<script>alert('환영합니다 " + `${paramName}` + "님!')</script>"
          // );
          res.redirect("/home");
          // res.write(fs.readFileSync("./public/home.html"));
          res.end();
        } else {
          res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
          res.write("<script>alert('이스터에그 발견!')</script>");
          res.write(fs.readFileSync("./public/home.html"));
          res.end();
        }
      }
    );
  });
});
app.get("/main", (req, res) => {
  // res.sendFile(path.join(__dirname, "public", "main.html"));
  console.log(uid + "님의 리스트");
  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("DB connection failed");
      return;
    }
    console.log("DB connection success");
    const exec = conn.query(
      "select task from tasks where id = ?",
      [uid],
      (err, result) => {
        conn.release();
        console.log("실행된 sql: " + exec.sql);
        if (err) {
          console.log("sql 실행 시 오류 발생");
          console.dir(err);
          res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
          res.write("<h2>불러오기 실패</h2>");
          res.end();
          return;
        }
        const taskList = result.map((row) => {
          return `
            <li class="task">
              <div>${row.task}</div>
              <div class="taskButtons">
                <button type="button" class="check">
                  <img src="/public/images/check.png" />
                </button>
                <form action="/process/delete" method="post" name="reset">
                  <input type="hidden" name="task" value="${row.task}" />
                  <button type="submit" class="delete">
                    <img src="/public/images/trashcan.png" />
                  </button>
                </form>
              </div>
            </li> 
      `;
        });
        const cheerio = require("cheerio");
        const $ = cheerio.load(`<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>plzDoIt</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500;700&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/public/app.css" />
      <style></style>
    </head>
    <body>
      <header>
        <h1>&lt;제발 좀 하고 놀아라 /&gt;</h1>
      </header>
      <main>
        <form action="/addTask" method="post" name="addTask" id="addTask">
          <input type="text" name="taskText" id="taskText" /><button
            type="submit"
            id="addTaskButton"
          >
            Add
          </button>
        </form>
        <div id="clock">
          <div id="date"></div>
          <div id="time"></div>
        </div>
          <ul id="taskList"></ul>
          <form action="/process/reset" method="post" name="reset">
            <button type="submit" id="reset">Reset</button>
          </form>
      </main>
      <footer></footer>
      <script src="/public/main.js"></script>
    </body>
  </html>
  `);
        const $ul = $("ul#taskList");
        taskList.forEach((task) => {
          $ul.append(task);
        });
        res.send($.html());
      }
    );
  });
});

app.post("/addTask", (req, res) => {
  const task = req.body.taskText;
  console.log(task);
  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("DB connection failed");
      return;
    }
    console.log("DB connection success");
    const exec = conn.query(
      "insert into tasks (id, task) values (?, ?)",
      [uid, task],
      (err, result) => {
        conn.release();
        console.log("실행된 sql: " + exec.sql);
        if (err) {
          console.log("sql 실행 시 오류 발생");
          console.dir(err);
          res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
          res.write("<h2>추가 실패</h2>");
          res.end();
          return;
        }
        console.dir(result);
        res.redirect("/main");
      }
    );
  });
});

app.post("/process/delete", (req, res) => {
  const task = req.body.task;
  console.log(task);
  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("DB connection failed");
      return;
    }
    console.log("DB connection success");
    const exec = conn.query(
      "delete from tasks where id = ? and task = ?",
      [uid, task],
      (err, result) => {
        conn.release();
        console.log("실행된 sql: " + exec.sql);
        if (err) {
          console.log("sql 실행 시 오류 발생");
          console.dir(err);
          res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
          res.write("<h2>삭제 실패</h2>");
          res.end();
          return;
        }
        console.dir(result);
        res.redirect("/main");
      }
    );
  });
});

app.post("/process/reset", (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) {
      conn.release();
      console.log("DB connection failed");
      return;
    }
    console.log("DB connection success");
    const exec = conn.query(
      "delete from tasks where id = ?",
      [uid],
      (err, result) => {
        conn.release();
        console.log("실행된 sql: " + exec.sql);
        if (err) {
          console.log("sql 실행 시 오류 발생");
          console.dir(err);
          res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
          res.write("<h2>삭제 실패</h2>");
          res.end();
          return;
        }
        console.dir(result);
        res.redirect("/main");
      }
    );
  });
});

// const db = mysql.createConnection({
//   host: sqlData.host,
//   user: sqlData.user,
//   password: sqlData.password,
//   database: sqlData.database,
//   port: sqlData.port,
//   debug: false,
//   connectionLimit: 10,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to database: ", err);
//     return;
//   }
//   console.log("Connected to database.");
// });

// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

// app.get("/main", (req, res) => {
//   const userId = req.session.userId;
//   const query = "SELECT * FROM tasks WHERE id = ?";
//   db.query(query, [userId], (err, rows) => {
//     if (err) {
//       console.error("Error querying database: ", err);
//       res.sendStatus(500);
//       return;
//     }
//     const taskList = rows.map((row) => {
//       const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
//       const newTask = dom.window.document.createElement("li");
//       newTask.innerHTML = `
//         <input type="checkbox" class="check" />
//         <span class="task">${row.task}</span>
//         <button class="delete" type="button">
//           <img src="/public/images/trashcan.png" />
//         </button>
//       `;
//       return newTask;
//     });
//     res.render("main", { taskList });
//   });
// });
// app.post("/addTask", (req, res) => {
//   console.log(1);
//   const task = req.body.taskText;
//   const query = "INSERT INTO tasks (id, task) VALUES (?, ?)";
//   db.run(query, [paramId, task], (err) => {
//     if (err) {
//       console.log(err);
//       res.sendStatus(500);
//     } else {
//       res.redirect("/");
//     }
//   });
// });

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/admin", (req, res) => {
  pool.getConnection((err, conn) => {
    conn.query("SELECT id, name FROM members", (error, results, fields) => {
      if (error) throw error;

      let idsHtml = "";
      for (let i = 0; i < results.length; i++) {
        idsHtml += `<li class='adminLi'>${results[i].id} : ${results[i].name}</li>`;
      }

      res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>plzDoIt</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500;700&display=swap"
            rel="stylesheet"
          />
          <link rel="stylesheet" href="/public/app.css" />
        </head>
        <body>
          <h1 class="adminTitle">사용자 목록</h1>
          <ul class="adminUl">
            ${idsHtml}
          </ul>
        </body>
      </html>
    `);
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
