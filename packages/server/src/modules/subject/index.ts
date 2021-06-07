import application from '@application';
import {
  subjectPathUpdatesToMongoose,
  flattenStateToMongoose$set,
} from './service';

application.service.subjectPathUpdatesToMongoose = subjectPathUpdatesToMongoose;
application.service.flattenStateToMongoose$set = flattenStateToMongoose$set;
