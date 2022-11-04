enum Usertype {
  Student = "student",
  Admin = "admin",
  Representative = "representative",
  Volunteer = "volunteer",
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
  allow_lists
}
