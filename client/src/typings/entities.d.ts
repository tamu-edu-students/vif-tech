enum Usertype {
  STUDENT = "student",
  ADMIN = "admin",
  REPRESENTATIVE = "company representative",
  VOLUNTEER = "volunteer",
}

interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  usertype: Usertype;
  company_id?: number;
  interests?: string[];
}

interface Company {
  id: number;
  name: string;
  description: string;
  allowlist_emails: AllowlistEmail[];
  allowlist_domains: AllowlistDomain[];
}

interface AllowlistEmail {
  id: number;
  company_id?: number;
  email: string;
  usertype: Usertype;
  isPrimaryContact?: boolean;
}

interface AllowlistDomain {
  id: number;
  company_id?: number;
  email_domain: string;
  usertype: Usertype;
}
