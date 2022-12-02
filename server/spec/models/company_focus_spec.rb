require "rails_helper"

RSpec.describe CompanyFocus, type: :model do
  before(:each) do
    @focus1 = Focus.create(focus: "anime design")
    @focus2 = Focus.create(focus: "visualizations")
    Company.create(name: "disney", description: "blah")
    Company.create(id: 3, name: "dreamworks", description: "blah")
  end

  it "valid with valid attributes" do
    expect(CompanyFocus.create(company: Company.find_by(name: "disney"), focus: @focus1)).to be_valid
  end

  it "invalid with invalid attributes" do
    expect(CompanyFocus.create(company: Company.find_by(name: "doesn't exist"), focus: @focus2)).to_not be_valid
  end
end
