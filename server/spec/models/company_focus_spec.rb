require "rails_helper"

RSpec.describe CompanyFocus, type: :model do
  before(:each) do
    @focus1 = Focus.create(name: "anime design")
    @focus2 = Focus.create(name: "visualizations")
    @disney = Company.create(name: "disney", description: "blah")
    @dreamworks = Company.create(id: 3, name: "dreamworks", description: "blah")
  end

  it "valid with valid attributes" do
    expect(CompanyFocus.create(company: Company.find_by(name: "disney"), focus: @focus1)).to be_valid
  end

  it "invalid with invalid attributes" do
    expect(CompanyFocus.create(company: Company.find_by(name: "doesn't exist"), focus: @focus2)).to_not be_valid
  end

  it "focus returns companies correctly" do
    CompanyFocus.create(company: @disney, focus: @focus1)
    CompanyFocus.create(company: @dreamworks, focus: @focus1)
    CompanyFocus.create(company: @dreamworks, focus: @focus2)
    expect(@focus1.as_json["companies"]).to match_array([@disney.as_json, @dreamworks.as_json])
    expect(@focus2.as_json["companies"]).to match_array([@dreamworks.as_json])
  end
end
