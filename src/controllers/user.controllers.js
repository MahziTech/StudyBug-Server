import mongoose from "mongoose"
import InstitutionDatabase from "../models/institution.models.js";
import UserDatabase from "../models/user.models.js";
import { getPagination } from "../services/query.services.js";

//! when testing auth remember to set secure to false temporarily because server isn't https yet
//! find out the url origin when you make requests from postman or your test-client or javscript frtch code
//! for postman, see if it still works even with cors policy. stackoverflow reference


// test if you can see cookies and acccesstokten in browser ntework tab
// test if jwt works with a different encrypted user _id 
// test if a users access token works for another user

//todo: DO EDITUSER SUBSCRIPTION, PASSWORD, PICTURE
//todo: DO DELETE and signout USER


export const getUser = async(req, res) => {
    try {
        const user = await UserDatabase.findById(req.body.userId, { __v: 0, _id: 0, password: 0, tokens: 0, resetPasswordTokenExpiry: 0, resetPasswordToken: 0 })
        if(user) {
            return res.status(200).json({ ok: true, body: user });
        }

        return res.status(404).json({ ok: false, error: "user not found" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const editUserMainDetails = async(req, res) => {
    try {
        const { userId, updates } = req.body
        const allowedFields = ["firstName", "lastName", "telephone"]
        const user = await UserDatabase.findById(userId)

        if(!user) {
            return res.status(404).json({ ok: false, "error": "The user could not be found" })
        }

        const unallowedField = updates.find(update => !allowedFields.includes(update.field))?.field

        if(unallowedField) {
            return res.status(403).json({ ok: false, error: `You can't change the ${unallowedField} field or this is the wrong way to do it.` })
        }
        updates.forEach(({ field, value }) => {
            user[field] = value
        })

        await user.save()

        const updatedUser = await UserDatabase.findById(userId, { __v: 0, _id: 0, password: 0, tokens: 0, resetPasswordTokenExpiry: 0, resetPasswordToken: 0 })
        return res.status(200).json({ ok: true, body: updatedUser })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const addUserToInstitution = async(req, res) => {
    try {
        const { userId, institutionId, code } = req.body

        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "user not found" })
        }

        if(user.institution) {
            return res.status(400).json({ ok: false, error: "You are already part of an institution. If you wish to change institutions, exit out of your current one and join a new one" })
        }

        const institution = await InstitutionDatabase.findById(institutionId)
        if(!institution) {
            return res.status(404).json({ ok: false, error: "institution not found" })
        }

        if(code !== institution.code) {
            return res.status(400).json({ ok: false, error: "Invalid code" })
        } else {
            user.institution = institutionId
            await user.save()
            return res.status(201).json({ ok: true, message: "You were successfully added to "+institution.name })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const removeUserFromInstitution = async(req, res) => {
    try {
        const { userId } = req.params

        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "user not found" })
        }

        if(!user.institution) {
            return res.status(400).json({ ok: false, error: "You are not part of an institution" })
        }

        user.institution = null
        await user.save()
        return res.status(201).json({ ok: true, message: "You were successfully removed from the institution" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const searchFilterAndSortAllResources = async (req, res) => {
    try {
        const {
            userId,
            studyUnitId,
            searchQuery,
            resourceType,
            minDate,
            maxDate,
            sortByDate  
        } = req.body

        const { skip, limit, page } = getPagination({ limit: req.body.limit, page: req.body.page })
        // Base match stage
        const matchStage = { user: new mongoose.Types.ObjectId(userId) }

        if (studyUnitId) matchStage.studyUnit = new mongoose.Types.ObjectId(studyUnitId)
        if (searchQuery) matchStage.name = { $regex: searchQuery, $options: 'i' }
        if (minDate || maxDate) {
            matchStage.createdAt = {}
            if (minDate) matchStage.createdAt.$gte = new Date(minDate)
            if (maxDate) matchStage.createdAt.$lte = new Date(maxDate)
        }

        // dtermine which collections to query
        let collections = []
        if (!resourceType || resourceType === 'all') {
            collections = ['flashcardsets', 'notes', 'documents']
        } else {
            switch (resourceType) {
                case 'flashcards': collections = ['flashcardsets']; break;
                case 'notes': collections = ['notes']; break;
                case 'documents': collections = ['documents']; break;
                default: return res.status(400).json({ ok: false, error: 'Invalid resourceType' });
            }
        }

        // Prepare sort object
        const sortField = sortByDate ? 'createdAt' : 'name'
        const sortObj = { [sortField]: (!sortByDate || sortByDate === 'asc') ? 1 : -1 }

        // Aggregation pipeline
        const pipeline = [
            { $match: matchStage },
            { $addFields: { resourceType: { $literal: 'flashcardset' } } },
            {
                $unionWith: {
                    coll: 'notes',
                    pipeline: [
                        { $match: matchStage },
                        { $addFields: { resourceType: { $literal: 'note' } } }
                    ]
                }
            },
            {
                $unionWith: {
                    coll: 'documents',
                    pipeline: [
                        { $match: matchStage },
                        { $addFields: { resourceType: { $literal: 'document' } } }
                    ]
                }
            },
            { $match: { resourceType: { $in: collections.map(c => c.slice(0, -1)) } } },
            { $sort: sortObj },
            {
                $facet: {
                    metadata: [{ $count: 'totalResults' }],
                    data: [{ $skip: skip }, { $limit: limit }]
                }
            }
        ]

        const [result] = await mongoose.model('FlashcardSet').aggregate(pipeline)

        const totalResults = result.metadata[0]?.totalResults || 0
        const totalPages = Math.ceil(totalResults / limit)

        return res.status(200).json({
            ok: true,
            body: result.data,
            page,
            totalPages,
            totalResults
        })

    } catch (error) {
        return res.status(500).json({ ok: false, error: 'Internal Server error', message: error.message })
    }
}