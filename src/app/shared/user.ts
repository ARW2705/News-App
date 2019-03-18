export interface User {
  username: string,
  password: string,
  remember: boolean,
  email?: string,
  firstname?: string,
  lastname?: string,
  preferredSources?: string[],
  country?: string,
  language?: string
}
