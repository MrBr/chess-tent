import { records, requests } from '@application';
import { Mentorship, TYPE_MENTORSHIP, User } from '@chess-tent/models';
import { CoachesRecord, StudentsRecord } from '@types';
import { MF } from '@chess-tent/redux-record/types';

const students = records.createRecord<StudentsRecord>({
  ...records.collectionRecipe,
  ...records.createApiRecipe(requests.myStudents),
  ...records.createDenormalizedCollectionRecipe(TYPE_MENTORSHIP),
});

const requestMentorship: MF<(coach: User) => Promise<void>, CoachesRecord> =
  () => () => record => async coach => {
    record.amend({ loading: true });
    const { data } = await requests.mentorshipRequest({
      coachId: coach.id,
    });
    record.update(
      [...(record.get()?.value || []), data as unknown as Mentorship],
      { loading: false },
    );
  };
const coaches = records.createRecord<CoachesRecord>({
  ...records.collectionRecipe,
  ...records.createApiRecipe(requests.myCoaches),
  ...records.createDenormalizedCollectionRecipe(TYPE_MENTORSHIP),
  requestMentorship,
});

export { students, coaches };
