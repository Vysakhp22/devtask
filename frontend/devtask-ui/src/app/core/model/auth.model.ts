export interface ILoginModel {
    email: string;
    password: string;
}

export interface ISignupModel {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
}