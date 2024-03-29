const mongoose = require("mongoose");
const Email = require("../models/email");
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const tranporter = nodemailer.createTransport({
    service: "Gmail",
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});


const saveSentEmails = async (req, res) => {
    try {
        const email = new Email(req.body);

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email.to,
            subject: email.subject,
            text: email.body,
        };

        tranporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email: ", error);
            } else {
                console.log("Email sent: ", info.response);
            }
        });
        email.save();

        res.status(200).json('email saved successfully');
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }

}

const getsendMails = async (req,res) => {
    try {
        let emails = await Email.find();
        res.status(200).send(emails);

    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
}

const getEmails = async (req, res) => {
    try {
        let emails;
        if (req.params.type === 'bin') {
            emails = await Email.find({ bin: true });
        } else if (req.params.type === 'allmail') {
            emails = await Email.find({});
        } else if(req.params.type === 'starred') {
            emails = await Email.find({ starred: true, bin: false})
        } else {
            emails = await Email.find({ type: req.params.type })
        }

        return res.status(200).json(emails);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
}


const moveEmailsToBin = async (req, res) => {
    try {
        await Email.updateMany({ _id: { $in: req.body } }, { $set: { bin: true, starred: false, type: '' } })

        return res.status(200).json('emails deleted successfully');

    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
}

const toggleStarredEmails = async (req, res) => {
    try {
        await Email.updateOne({_id: req.body.id}, { $set: { starred: req.body.value }})
        return res.status(200).json("email is starred mark");
    } catch (error) {
        console.log(err);
        res.status(500).json(error.message);
    }
}

const deleteEmails = async (req, res) => {
    try {
        await Email.deleteMany({ _id: { $in: req.body}});
        return res.status(200).json("email is deleted successfully");
    } catch (error) {
        console.log(err);
        res.status(500).json(error.message);
    }
}


module.exports = {
    saveSentEmails,
    getsendMails,
    getEmails,
    moveEmailsToBin,
    toggleStarredEmails,
    deleteEmails
}
