const express = require('express');
const router = express.Router();
const multer = require('multer');
const uuidv4 = require('uuid/v4');

// connection configurations
const db = require('../src/database/database');

const DIR = './public/images';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const mimetype = file.mimetype.split('/')[1];
        //   fieldname: 'profileImg',
        //   originalname: 'profileImg',
        //   encoding: '7bit',
        //   mimetype: 'image/jpg',
        //   destination: './public/',
        //   filename: '191516a0-b754-4f5a-938d-912fbf7d6142profileimg',
        //   path: 'public\\191516a0-b754-4f5a-938d-912fbf7d6142profileimg',
        //   size: 620235
        cb(null, uuidv4() + '.' + mimetype)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.post('/hot', upload.single('uploadImageHot'), async (req, res, next) => {
    // const url = req.protocol + '://' + req.get('host')
    // const uploadImage = url + '/public/' + req.file

    /* table images = {
        id
        work_permit_id
        user_id
        role // engineer or owner เพื่อเอาไปแสดงหน้า admin และ manager
    }*/
    // user_id: '4', work_permit_id: '27'
    // TODO เอา user_id มาหาว่าเป็น role อะไร // engineer or owner เพื่อเอาไปแสดงหน้า admin และ manager
    if (!req.file) {
        return res.status(200).json({
            error: false,
            data: []
        });
    }
    const sqlFindRoleById = `SELECT
                                right_user.n_approve as n_approve
                            FROM user LEFT OUTER JOIN right_user ON right_user.sign_right=user.right1
                            WHERE user.id = ?`;
    const [rowsUser, fieldsUser] = await db.query(sqlFindRoleById, [req.body.user_id]); // user_id: 4
    const role = rowsUser[0].n_approve; // engineer
    const work_permit_id = req.body.work_permit_id;
    const user_id = req.body.user_id;
    const imagePath = req.file.filename;

    const sqlInsertWorkPermitImages = `
        INSERT INTO work_permit_images (work_permit_id,work_permit_type_id,user_id,role,image_path) VALUES (?,?,?,?,?)
    `;
    // find hotwork id
    const [rowsHotwork, fieldsHotwork] = await db.query(`SELECT id FROM work_permit_type WHERE name='hotwork'`, null);
    const [rowsImages, fieldsImages] = await db.query(sqlInsertWorkPermitImages, [work_permit_id, rowsHotwork[0].id, user_id, role, imagePath]);
    // console.log(req.file);
    return res.status(200).json({
        error: false,
        data: role
    });
});

router.post('/height', upload.single('uploadImageHeight'), async (req, res, next) => {
    // const url = req.protocol + '://' + req.get('host')
    // const uploadImage = url + '/public/' + req.file
    if (!req.file) {
        return res.status(200).json({
            error: false,
            data: []
        });
    }
    const sqlFindRoleById = `SELECT
                                right_user.n_approve as n_approve
                            FROM user LEFT OUTER JOIN right_user ON right_user.sign_right=user.right1
                            WHERE user.id = ?`;
    const [rowsUser, fieldsUser] = await db.query(sqlFindRoleById, [req.body.user_id]); // user_id: 4
    const role = rowsUser[0].n_approve; // engineer
    const work_permit_id = req.body.work_permit_id;
    const user_id = req.body.user_id;
    const imagePath = req.file.filename;

    const sqlInsertWorkPermitImages = `
        INSERT INTO work_permit_images (work_permit_id,work_permit_type_id,user_id,role,image_path) VALUES (?,?,?,?,?)
    `;
    // find hotwork id
    const [rowsHotwork, fieldsHotwork] = await db.query(`SELECT id FROM work_permit_type WHERE name='heightwork'`, null);
    const [rowsImages, fieldsImages] = await db.query(sqlInsertWorkPermitImages, [work_permit_id, rowsHotwork[0].id, user_id, role, imagePath]);
    return res.status(200).json({
        error: false,
        data: role
    });
});

router.post('/confine', upload.single('uploadImageConfine'), async (req, res, next) => {
    // const url = req.protocol + '://' + req.get('host')
    // const uploadImage = url + '/public/' + req.file
    if (!req.file) {
        return res.status(200).json({
            error: false,
            data: []
        });
    }
    const sqlFindRoleById = `SELECT
                                right_user.n_approve as n_approve
                            FROM user LEFT OUTER JOIN right_user ON right_user.sign_right=user.right1
                            WHERE user.id = ?`;
    const [rowsUser, fieldsUser] = await db.query(sqlFindRoleById, [req.body.user_id]); // user_id: 4
    const role = rowsUser[0].n_approve; // engineer
    const work_permit_id = req.body.work_permit_id;
    const user_id = req.body.user_id;
    const imagePath = req.file.filename;

    const sqlInsertWorkPermitImages = `
        INSERT INTO work_permit_images (work_permit_id,work_permit_type_id,user_id,role,image_path) VALUES (?,?,?,?,?)
    `;
    // find hotwork id
    const [rowsConfinework, fieldsConfinework] = await db.query(`SELECT id FROM work_permit_type WHERE name='confinework'`, null);
    const [rowsImages, fieldsImages] = await db.query(sqlInsertWorkPermitImages, [work_permit_id, rowsConfinework[0].id, user_id, role, imagePath]);
    // console.log(req.file);
    return res.status(200).json({
        error: false,
        data: role
    });
});

module.exports = router;
