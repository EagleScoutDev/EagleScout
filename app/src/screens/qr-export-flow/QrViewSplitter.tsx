import React from 'react';
import {QrExport} from './QrExport';
import {QrImport} from './QrImport';

export const QrViewSplitter = ({route}: {route: any}) => {
  const {type} = route.params;
  return type === 'export' ? <QrExport /> : <QrImport />;
};
