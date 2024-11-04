import { Request, Response } from "express";
import ResponseApi from "../config/ResponseApi";
import MailService from "../services/MailService";

class MailController {
  sendMail = async (req: Request, res: Response) => {
    try {
      const { email, subject, html } = req.body;
      await MailService.sendMail(email, subject, html);
      return res.status(200).json(
        ResponseApi({
          code: 200,
          message: "Email sent successfully",
          version: 1.0,
        })
      );
    } catch (error) {
      return res.status(500).json(
        ResponseApi({
          code: 500,
          message: String(error),
          errors: error,
          version: 1.0,
        })
      );
    }
  };
}

export default new MailController();
