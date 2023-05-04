const express = require("express"); // express 모듈을 가져옴
const app = express(); // express 인스턴스를 생성
const PORT = 3000;

const Posts = require("./routes/posts.route.js"); 


app.use(express.json());  // JSON 형식의 요청을 받기 위해 body-parser 미들웨어 등록
app.use('/', [Posts]); // 대괄호 필수



app.listen(PORT, () => {
    console.log(`Server listen ${PORT}`)
});