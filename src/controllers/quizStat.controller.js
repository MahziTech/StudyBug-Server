import QuizStatDatabase from "../models/quizStat.models.js";


export const createQuizStat = async(req, res) => {
    try {
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}