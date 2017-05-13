
export class Utils {
  public sanitize_email(email: string): string {
    email = email.trim();
    email = email.replace(/\./g, "_");
    email = email.replace(/\$/g, "_");
    email = email.replace(/\[/g, "_");
    email = email.replace(/\]/g, "_");
    email = email.replace(/#/g, "_");
    email = email.replace(/\//g, "_");
    return email;
  }

  public email_from_phone(phone: string, attempt: number) {
    if (attempt == 0) {
      return 'user_' + phone.toString() + '@trackbabyvitals.com';
    }
    else {
      return 'user_' + phone.toString() + '_' + attempt + '@trackbabyvitals.com';
    }
  }
} 