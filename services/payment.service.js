import axios from "axios";

const baseURL = "https://api.paystack.co";

const Paystack = axios.create({
  baseURL,
  headers: {
    Authorization: `BEARER ${process.env.PAYSTACK_API_KEY}`,
  },
});

export default Paystack;
