import { records, requests } from '@application';
import { Mentorship, TYPE_MENTORSHIP } from '@chess-tent/models';

const students = records.createRecord(
  records.withRecordBase<Mentorship[]>(),
  records.withRecordCollection(),
  records.withRecordDenormalizedCollection(TYPE_MENTORSHIP),
  records.withRecordApiLoad(requests.myStudents),
);

const coaches = records.createRecord(
  records.withRecordBase<Mentorship[]>(),
  records.withRecordCollection(),
  records.withRecordDenormalizedCollection(TYPE_MENTORSHIP),
  records.withRecordApiLoad(requests.myCoaches),
  records.withRecordMethod()(
    'requestMentorship',
    () => () => record => async coach => {
      record.amend({ loading: true });
      const { data } = await requests.mentorshipRequest({
        coachId: coach.id,
      });
      record.update(
        [...(record.get().value || []), data as unknown as Mentorship],
        { loading: false },
      );
    },
  ),
);

export { students, coaches };
