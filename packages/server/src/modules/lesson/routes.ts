import application from "@application";
import { saveSubject } from "../subject/service";
import { Lesson } from "@chess-tent/models";

application.service.registerGetRoute("/lesson/all", (req, res) => {
  res.send("All lessons!");
});

application.service.registerPostRoute(
  "/lesson/save",
  (req, res, next) => {
    saveSubject(req.body as Lesson)
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
