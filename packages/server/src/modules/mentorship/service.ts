import { Mentorship, User } from '@chess-tent/models';
import { MentorshipModel } from './model';

export const requestMentorship = (
  student: User['id'],
  coach: User['id'],
  approved?: boolean,
) =>
  new Promise(resolve => {
    MentorshipModel.create({ student, coach, approved: approved })
      .then(result => {
        result
          .populate('student')
          .populate('coach')
          .execPopulate()
          .then(resolve);
      })
      .catch(err => {
        throw err;
      });
  });

export const resolveMentorshipRequest = (
  student: User['id'],
  coach: User['id'],
  approved: boolean,
) =>
  new Promise<void>(resolve => {
    MentorshipModel.updateOne({ student, coach }, { approved }).exec(
      (err, result) => {
        if (err) {
          throw err;
        }
        resolve();
      },
    );
  });

export const getStudents = (coach: User['id']): Promise<Mentorship[]> =>
  new Promise(resolve => {
    MentorshipModel.find({ coach })
      .populate('student')
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result.map(item => item.toObject<Mentorship>()));
      });
  });

export const getCoaches = (student: User['id']): Promise<Mentorship[]> =>
  new Promise(resolve => {
    MentorshipModel.find({ student })
      .populate('coach')
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result.map(item => item.toObject<Mentorship>()));
      });
  });
