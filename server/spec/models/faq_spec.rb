require "rails_helper"

RSpec.describe Faq, type: :model do
  it "is valid with valid attributes" do
    expect(Faq.create(question: "where is your office located", answer: "abuja")).to be_valid
  end
  it "is invalid without a question" do
    expect(Faq.create(answer: "mars")).to_not be_valid
  end

  it "is invalid without an answer" do
    expect(Faq.create(question: "where is your office located", )).to_not be_valid
  end

end
