require 'rails_helper'

RSpec.describe User, type: :model do
  subject { User.new(username: "neyobrainy", email: "jsmith@sample.com", password_digest: "ligali" )}

  it "is valid with valid attributes" do
    expect(subject).to be_valid
  end
  it "is not valid without a username" do
    subject.username=nil
    expect(subject).to_not be_valid
  end
  it "is not valid without a password_digest" do
    subject.password_digest=nil
    expect(subject).to_not be_valid
  end
end
