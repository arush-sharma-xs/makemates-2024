import DB from "../db/db.js";

export const getUserProfile = (req, res) => {
  const userId = req.body.id;
  let allPosts = [];
  DB.query("SELECT * FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) return res.status(401).send(err);
    if (result.length > 0) {
      const { password, ...other } = result[0];
      let query =
        "SELECT u.id, p.desc, p.date, u.name, pis.image_url AS profileImage, pm.media_url FROM posts p JOIN post_media pm ON p.id = pm.post_id JOIN users u ON u.id = p.user_id LEFT JOIN profileimages pis ON u.img = pis.id WHERE p.user_id = ? ORDER BY date DESC";

      DB.query(query, [userId], (err, result) => {
        if (err) return res.status(401).send(err);
        return res.status(200).send({ userData: other, userPost: result });
      });
    } else {
      return res.status(204).send("User not Found");
    }
  });
};

export const checkFollowed = (req, res) => {
  console.log(req.body);
  const { friendId } = req.body;
  const userId = req.user.id;
  DB.query(
    "SELECT * FROM relationships WHERE follower_id = ? AND follow_id = ?",
    [userId, friendId],
    (err, result) => {
      if (err) return res.status(401).send(err);
      console.log(result);
      result;
      if (result.length > 0) {
        return res.status(200).send("USER_FOUND");
      } else {
        return res.status(200).send("USER_NOT_FOUND");
      }
    }
  );
};

export const searchUser = (req, res) => {
  const { keyword } = req.body;

  let query = `SELECT u.id, u.name, u.city, pis.image_url AS profileImage FROM users u LEFT JOIN profileimages pis ON u.img = pis.id WHERE name LIKE ?`;

  DB.query(query, [`%${keyword.toLowerCase()}%`], (err, result) => {
    if (err) return res.status(401).send(err);
    console.log(result);
    return res.status(200).send(result);
  });
};
