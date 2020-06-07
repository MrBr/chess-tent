import application from "@application";
import { saveSubject } from "../subject/service";

application.service.registerGetRoute("/lesson/all", (req, res) => {
  res.send("All lessons!");
});

application.service.registerPostRoute(
  "/lesson/save",
  (req, res, next) => {
    saveSubject(req.body)
      .then(subject => {
        res.locals.subject = subject;
        next();
      })
      .catch(next);
  },
  (req, res) => {
    res.send(res.locals.subject);
  }
);
