import { FileDeletedEvent, Publisher, Subjects, } from '@htkradass/nestcommon'

export class FileDeletedPublisher extends Publisher<FileDeletedEvent> {
  subject: Subjects.FileDeleted = Subjects.FileDeleted;
}
