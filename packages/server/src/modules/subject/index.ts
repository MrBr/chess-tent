import application from '@application';
import {
  subjectPathUpdatesToMongoose$set,
  flattenStateToMongoose$set,
} from './service';

application.service.subjectPathUpdatesToMongoose$set = subjectPathUpdatesToMongoose$set;
application.service.flattenStateToMongoose$set = flattenStateToMongoose$set;
