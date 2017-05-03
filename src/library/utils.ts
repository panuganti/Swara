
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
} 