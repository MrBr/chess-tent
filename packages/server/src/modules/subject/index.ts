import application from '@application';
import {
  subjectPathUpdatesToMongoose$set,
  flattenStateToMongoose$set,
  transformSubjectVersion,
} from './service';

application.service.subjectPathUpdatesToMongoose$set = subjectPathUpdatesToMongoose$set;
application.service.flattenStateToMongoose$set = flattenStateToMongoose$set;
application.service.transformSubjectVersion = transformSubjectVersion;
