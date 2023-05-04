const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { Posts } = require('../models');

// 게시글 작성
const createNewPost = async (req, res) => {
    try {
        const { title, content } = req.body; // HTTP 요청에서 받은 게시글 제목과 내용을 추출

        await Posts.create({ // Sequelize 모델을 이용해 DB에 새로운 게시글을 생성
            title, content
        });

        return res.status(200).json({ message: "게시글 작성에 성공하였습니다." })

    } catch (error) {
        console.error(`${req.method} ${req.originalUrl} : ${error.message}`); // 서버 콘솔에 에러 메시지를 출력
        return res.status(400).json({
            errorMessage: "게시글 생성에 실패하였습니다."
        });
    }
};


// 게시글 전체 조회
const getAllPosts = async (req, res) => {
    try {
        const posts = await Posts.findAll({ // Sequelize 모델을 이용해 DB에서 게시글 목록을 조회
            attributes: ['id', 'title', 'content', 'createdAt', 'updatedAt'], // 반환할 속성 필드들을 지정
            order: [['createdAt', 'DESC']], // 최신순으로 정렬
        });
        return res.status(200).json({ posts }); // 조회한 게시글 목록을 클라이언트에 반환
    } catch (error) {
        console.error(`${req.method} ${req.originalUrl} : ${error.message}`); // 서버 콘솔에 에러 메시지를 출력
        return res.status(400).json({
            errorMessage: "게시글 조회에 실패하였습니다."
        });
    }
};

const updatePost = async (req, res) => {
    /** (구현) **/
    try {
        const { postId } = req.params; // URL 파라미터에서 게시글 id 값을 가져옵니다.
        const { title, content } = req.body; // HTTP 요청 본문에서 게시글의 제목과 내용을 가져옵니다.

        const post = await Posts.findOne({ where: { id: postId } }); // DB에서 해당 id 값을 가진 게시글을 조회합니다.

        await post.update(
            {
                title, content
            },
            {
                where: {
                    [Op.and]: [postId]
                }
            }
        ); // 조회한 게시글의 제목과 내용을 HTTP 요청에서 가져온 값으로 수정합니다.

        return res.status(200).json({ post }) 

    } catch (error) {
        console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            errorMessage: "게시글 수정에 실패하였습니다."
        });
    }
};


const deletePostById = async (req, res) => {
    /** (구현) **/
    try {
        const { postId } = req.params; // URL 파라미터에서 게시글 id 값을 가져옵니다.

        await Posts.findOne({ where: { id: postId } }); // DB에서 해당 id 값을 가진 게시글을 조회합니다.
        await Posts.destroy({
            where: {
                [Op.and]: [{ id: postId }]
            }
        }); // 조회한 게시글을 DB에서 삭제합니다.

        return res.status(200).json({ message: "success" }); 

    } catch (error) {
        console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            errorMessage: "게시글 삭제에 실패하였습니다."
        });
    }
};


router.post('/api/posts', createNewPost);
router.get('/api/posts', getAllPosts);
router.put('/api/posts/:postId', updatePost);
router.delete('/api/posts/:postId', deletePostById);

module.exports = router;