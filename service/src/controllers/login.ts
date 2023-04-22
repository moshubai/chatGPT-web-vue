import { db } from '../db/index'
import { failRes, successRes } from '../types'
const login = (req) => {
  return new Promise((resolve, reject) => {
    const { useName, password } = req.body
    const sql = `SELECT * FROM user_t WHERE user_name='${useName}' AND passwd='${password}'`
    db.query(sql, async (err, result) => {
      if (err) {
        // 执行失败
        reject(JSON.stringify(err))
      }
      else {
        // 判断返回result是否有数据
        console.log(result)
        // db.end()
        const res = (result.length > 0 && result[0].status === 0) ? successRes : failRes
        resolve({ ...res })
      }
    })
  })
}
export { login }
