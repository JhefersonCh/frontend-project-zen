export interface RegisterUserInterface {
    id:                   string;
    identification:       string;
    fullName:             string;
    avatarUrl?:            string;
    username:             string;
    phone?:                number;
    email:                string;
    password:             string;
    passwordConfirmation: string;
    identificationTypeId: number,
}
