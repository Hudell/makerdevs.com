import { Picker } from 'meteor/meteorhacks:picker';
import { check } from 'meteor/check';
import http from 'http';

import Files from '../models/Files';

Picker.route('/download/:fileId', function(params: Record<string, any>, req: http.IncomingMessage, res: http.ServerResponse, next: any) {
  check(params.fileId, String);

  const file = Files.findOneById(params.fileId);
  if (!file) {
    throw new Meteor.Error('invalid-file');
  }

  res.writeHead(200, {
    'Content-Type': file.type,
    'Content-Disposition': `attachment; filename=${ file.name }`
  });
  res.end(file.data, 'binary');
});