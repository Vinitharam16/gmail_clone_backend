const Email = require("../models/email");
const nodemailer = require('nodemailer');
const Authmodel = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const GET_ALL_MAILS = async (req, res, next) => {
    try {
        const { mails } = await Authmodel.findOne({ _id: req.user })
        .select('mails')
        .populate('mails.inbox mails.sent mails.drafts mail.trash');
        return res.status(200).json({
            success: true,
            message: 'All mails fetched successfully',
            data: mails
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        })
    }
}


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

        // const mailOptions = {
        //     from: process.env.SMTP_USER,
        //     to: email.to,
        //     subject: email.subject,
        //     text: email.body,
        // };

        // tranporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.error("Error sending email: ", error);
        //     } else {
        //         console.log("Email sent: ", info.response);
        //     }
        // });
        const savedemail = await email.save();
        console.log('email sent')

        //generate a random reply email
        const newEmailIn = new Email({
            from: email.to,
            to: email.from,
            subject: 'Re:' + email.subject,
            body: 'This is a random reply mail',
            date: new Date(),
            image: '',
            name: email.name,
            starred: email.starred,
            type: 'inbox'
        });

        //save random reply email
        const savedEmailIn = await newEmailIn.save();
        console.log('reply received')

        res.status(200).json({
            success: true,
            message: 'Email saved successfully',
            data: savedemail,
            received: savedEmailIn
        });

        //get user and update email to its sentbox

        const user = await Authmodel.findOne({ _id: req.user });
        console.log(user)
        user.mails.sent.push(savedemail._id);
        user.mails.inbox.push(savedEmailIn._id);

    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }

}

const getsendMails = async (req, res) => {
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
        } else if (req.params.type === 'starred') {
            emails = await Email.find({ starred: true, bin: false })
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
        await Email.updateOne({ _id: req.body.id }, { $set: { starred: req.body.value } })
        return res.status(200).json("email is starred mark");
    } catch (error) {
        console.log(err);
        res.status(500).json(error.message);
    }
}

const deleteEmails = async (req, res) => {
    try {
        await Email.deleteMany({ _id: { $in: req.body } });
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
    deleteEmails,
    GET_ALL_MAILS,
}
