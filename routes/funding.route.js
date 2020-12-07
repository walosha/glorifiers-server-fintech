import express from "express";
import { verifyToken } from "../middlewares/auth/auth.middleware";
import FundingController from "../controllers/funding.controller";
import validate from "../helpers/validator";
var crypto = require('crypto');


const router = express.Router();

router.post(
  "/fundAccount",
  verifyToken.verify,
  validate.validateBody(validate.schemas.fundAccountSchema),
  FundingController.fundAccount
);

app.post("/webhook/funding", function (req, res) {
  var hash = crypto.createHmac('sha512', process.env.PAYSTACK_API_KEY).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    var event = req.body;
    console.log({event})

  res.send(200);
});

export default router;
