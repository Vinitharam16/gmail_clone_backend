const TokenShield = require("../Middlewares/TokenShield");
const { saveSentEmails, getEmails, moveEmailsToBin, getsendMails, toggleStarredEmails, deleteEmails, GET_ALL_MAILS } = require("../controller/emailcontroller");

const routes = require('express').Router();

//SAVED ALL EMAILS
routes.get('/email',  GET_ALL_MAILS)

// sent and save mails using post method
routes.post('/save', TokenShield, saveSentEmails);
// save draft mails using post method
routes.post('/save-draft', TokenShield,  saveSentEmails);
// get sent mails using get method
routes.get('/emails/sent', TokenShield,  getsendMails);
// get mails from bin, starred and allmails using get method
routes.get('/emails/:type', TokenShield, getEmails);
// move emails to bin using post method
routes.post('/bin', TokenShield,  moveEmailsToBin);
// starred mails using post method
routes.post('/starred', TokenShield,  toggleStarredEmails);
// delete mails using delete method
routes.delete('/delete', TokenShield,  deleteEmails);


module.exports = routes;