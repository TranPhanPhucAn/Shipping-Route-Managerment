export class ForgotPasswordEvent {
  constructor(
    public readonly email: string,
    public readonly subject: string,
    public readonly name: string,
    public readonly activationCode: string,
  ) {}
  toString() {
    return JSON.stringify({
      email: this.email,
      subject: this.subject,
      name: this.name,
      activationCode: this.activationCode,
    });
  }
}
