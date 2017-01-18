import {MediaType, TypeDescriptor} from "../media-type";

export const __UserProfile:TypeDescriptor = {
  name: 'user-profile',
  version: 1,
  prefix: 'vnd'
}

export class UserProfileType implements MediaType {
  descriptor: TypeDescriptor = __UserProfile;
  definition:UserProfile = UserProfile
}


export class UserProfile {
  key?: string
}
