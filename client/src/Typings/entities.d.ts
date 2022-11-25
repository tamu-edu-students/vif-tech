interface IUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  usertype: string;
  company_id?: number;
  interests?: string[];
}

interface ICompany {
  id: number;
  name: string;
  description: string;
}

interface IAllowlistEmail {
  id: number;
  company_id?: number;
  email: string;
  usertype: Usertype;
  isPrimaryContact?: boolean;
}

interface IAllowlistDomain {
  id: number;
  company_id?: number;
  email_domain: string;
  usertype: Usertype;
}

interface IFAQ {
  id: number;
  question: string;
  answer: string;
}
