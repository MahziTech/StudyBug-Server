import QuizDatabase from "../models/quiz.models.js";
import UserDatabase from "../models/user.models.js";
import StudyUnitDatabase from "../models/studyUnit.models.js";


export const createQuiz = async(req, res) => {
    try {
        const { userId, studyUnitId, info, name, questions} = req.body

        const existingQuiz = await QuizDatabase.findOne({ name })
        if(existingQuiz) {
            return res.status(409).json({ ok: false, error: "You already have a quiz with that same name. try a different name :)" })
        }

        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "The user could not be found" })
        }

        if(studyUnitId) {
            const studyUnit = await StudyUnitDatabase.findOne({ _id: studyUnitId, user: userId })
            if(!studyUnit) {
                return res.status(404).json({ ok: false, error: "The study unit could not be found" })
            }
        }

        const newQuiz = new QuizDatabase({
            name,
            user: userId,
            info,
            studyUnit: studyUnitId || null,
            questions
        })

        const savedQuiz = await newQuiz.save()
        return res.status(201).json({ ok: true, body: savedQuiz })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const getQuizById = async(req, res) => {
    try {
        const { id } = req.params

        const quiz = await QuizDatabase.findById(id)
        if(quiz) {
            return res.status(200).json({ ok: true, body: quiz })
        }
        return res.status(404).json({ ok: false, error: "Quiz could not be found" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const getAllUserQuizzes = async(req, res) => {
    try {
        const { userId } = req.params
        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "The user could not be found" })
        }

        const quizzes = await QuizDatabase.find({ user: userId })
        return res.status(200).json({ ok: true, body: quizzes })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const changeQuizName = async(req, res) => {
    try {
        const { id, newName } = req.body
        const quiz = await QuizDatabase.findById(id)

        if(!quiz) {
            return res.status(404).json({ ok: false, error: "Quiz could not be found" })
        }

        const existingQuiz = await QuizDatabase.findOne({ name: newName })
        if(existingQuiz) {
            return res.status(409).json({ ok: false, error: "You already have a quiz with that same name. try a different name :)" })
        }

        quiz.name = newName
        await quiz.save()

        return res.status(200).json({ ok: true, body: quiz })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const moveQuizToStudyUnit = async(req, res) => {
    try {
        const { userId, quizId, studyUnitId } = req.body

        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "The user could not be found" })
        }

        const quiz = await QuizDatabase.findById(quizId)
        if(!quiz) {
            return res.status(404).json({ ok: false, error: "The Quiz could not be found" })
        }

        if(studyUnitId) {
            const studyUnit = await StudyUnitDatabase.findOne({ _id: studyUnitId, user: userId })
            if(!studyUnit) {
                return res.status(404).json({ ok: false, error: "The study unit could not be found" })
            }
        }

        quiz.studyUnit = studyUnitId
        const updatedQuiz = await quiz.save()

        return res.status(200).json({ ok: true, body: updatedQuiz })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const deleteQuiz = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedQuiz = await QuizDatabase.findByIdAndDelete(id);

        if (!deletedQuiz) {
            return res.status(404).json({ ok: false, error: 'quiz not found' });
        }

        return res.status(200).json({ ok: true, body: deletedQuiz });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" });
    }
}