import { Request, Response } from 'express';
import pool from '../db';

/**
 * トップページ(タスク一覧)
 * @param req
 * @param res
 */
export const top = async (req: Request, res: Response) => {
    try {
        const completeTasks = await fetchCompleteTask(); // 完了タスク
        const incompleteTasks = await fetchIncompleteTask(); // 未完了タスク
        res.render('index', { completeTasks , incompleteTasks });  // ビューにデータを渡す
    } catch (err) {
        res.status(500).send('Error loading tasks');
    }
};

/**
 * タスクを追加
 * @param req
 * @param res
 */
export const createTodo = async (req:Request,res:Response) => {
    try {
        try {
            const result = await pool.query(
                'INSERT INTO t_task (task_title,task_description,created_on,complete_flg) VALUES ($1,$2,$3,$4) RETURNING *',
                [req.body.title,req.body.description,'now',0]
            );
            res.redirect('/');
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }catch (err){

    }
}

/**
 * 完了済みのタスクを取得
 */
export const fetchCompleteTask = async () => {
    try {
        const result = await pool.query('SELECT * FROM t_task WHERE complete_flg = 1');
        return result.rows;
    } catch (err) {
        throw new Error(`タスクの完了取得エラー。 ${err}`)
    }
};

/**
 * 未完了のタスクを取得
 */
export const fetchIncompleteTask = async () => {
    try {
        const result = await pool.query('SELECT * FROM t_task WHERE complete_flg = 0');
        return result.rows; // データのみを返す
    } catch (err) {
        throw new Error(`タスクの未完了取得エラー。 ${err}`)
    }
};

/**
 * タスクを更新
 * @param req
 * @param res
 */
export const updateTodo = async (req: Request, res: Response) => {
    const { taskId,status} = req.body;

    try {
        const result = await pool.query(
            'UPDATE t_task SET complete_flg = $1 WHERE task_id = $2 RETURNING *',
            [status, taskId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

/**
 * タスクを削除
 * @param req
 * @param res
 */
export const deleteTodo = async (req: Request, res: Response) => {
    const { taskId } = req.body;
    try {
        await pool.query('DELETE FROM t_task WHERE task_id = $1', [taskId]);
        res.status(200).send();
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
