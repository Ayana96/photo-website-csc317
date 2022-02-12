var db = require('../config/database');
const PostModel = {};

PostModel.create = (title, description, photoPath, thumbnail, fk_userId) => {
    let baseSQL = 'INSERT INTO post (title, description, photopath, thumbnail, created, fk_userId) VALUE (?,?,?,?, now(),?);;';
    return db.execute(baseSQL, [title, description, photoPath, thumbnail, fk_userId])
        .then(([results, fields]) => {
            return Promise.resolve(results && results.affectedRows);
        })
        .catch((err) => Promise.reject(err));
};

PostModel.search = (searchTerm) => {
    let baseSQL =
        "SELECT id, title, description, thumbnail, concat_ws(' ', title, description) AS haystack \
        FROM post \
        HAVING haystack like ?;";
    let sqlReadySearchTerm = "%" + searchTerm + "%";
    return db.execute(baseSQL, [sqlReadySearchTerm])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err));
}

PostModel.getNrecentPosts = (numberOfPost) => {
    let baseSQL = 'SELECT id, title, description, thumbnail, created FROM post ORDER BY created DESC LIMIT ?';
    return db.query(baseSQL, [numberOfPost])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err));
};

PostModel.getPostById = (postId) => {
    let baseSQL =
        `SELECT u.id, u.username, p.title, p.description, p.photopath, p.created
  FROM users u 
  JOIN post p 
  ON u.id=fk_userId 
  WHERE p.id=?;`;

    return db.execute(baseSQL, [postId])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch(err => Promise.reject(err));
}

module.exports = PostModel;