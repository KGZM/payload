import { Payload } from '../../..';
import { PayloadRequest } from '../../../express/types';
import { Document } from '../../../types';
import getFileByPath from '../../../uploads/getFileByPath';
import create from '../create';
import { File } from '../../../uploads/types';
import { getDataLoader } from '../../dataloader';


export type Options<T> = {
  collection: string
  data: Record<string, unknown>
  depth?: number
  locale?: string
  fallbackLocale?: string
  user?: Document
  overrideAccess?: boolean
  disableVerificationEmail?: boolean
  showHiddenFields?: boolean
  filePath?: string
  file?: File
  overwriteExistingFiles?: boolean
  req?: PayloadRequest
  draft?: boolean
}

export default async function createLocal<T = any>(payload: Payload, options: Options<T>): Promise<T> {
  const {
    collection: collectionSlug,
    depth,
    locale,
    fallbackLocale,
    data,
    user,
    overrideAccess = true,
    disableVerificationEmail,
    showHiddenFields,
    filePath,
    file,
    overwriteExistingFiles = false,
    req: incomingReq,
    draft,
  } = options;

  const collection = payload.collections[collectionSlug];

  const req = {
    ...incomingReq || {},
    user,
    payloadAPI: 'local',
    locale: locale || incomingReq?.locale || (payload?.config?.localization ? payload?.config?.localization?.defaultLocale : null),
    fallbackLocale: fallbackLocale || incomingReq?.fallbackLocale || null,
    payload,
    files: {
      file: file ?? getFileByPath(filePath),
    },
  } as PayloadRequest;

  if (!req.payloadDataLoader) req.payloadDataLoader = getDataLoader(req);

  return create({
    depth,
    data,
    collection,
    overrideAccess,
    disableVerificationEmail,
    showHiddenFields,
    overwriteExistingFiles,
    draft,
    req,
  });
}
